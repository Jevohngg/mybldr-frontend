import { useState, useMemo, useCallback } from 'react';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridRowParams,
  useGridApiRef,
  GridRowSelectionModel,
  GRID_TREE_DATA_GROUPING_FIELD,
  GridColumnVisibilityModel,
  GridGroupNode,
  GridRenderCellParams,
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SpecSheetTableProps, SpecItem } from './types';
import { getColumns, defaultVisibleColumns } from './columns';
import './SpecSheetTable.css';

interface TreeDataRow extends SpecItem {
  hierarchy: string[];
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 2, gap: 1, borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <GridToolbarQuickFilter
          placeholder="Search..."
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              padding: '4px 12px',
              '&:before, &:after': { display: 'none' },
            },
            width: 200,
          }}
        />
        <Button
          size="small"
          startIcon={<FilterListIcon />}
          sx={{
            color: '#666',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Filter
        </Button>
        <Button
          size="small"
          startIcon={<SortIcon />}
          sx={{
            color: '#666',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Sort
        </Button>
      </Box>
      <Box sx={{
        '& .MuiButton-root': {
          color: '#666',
          textTransform: 'none',
          '&:hover': { backgroundColor: '#f5f5f5' }
        }
      }}>
        <GridToolbarColumnsButton />
      </Box>
    </GridToolbarContainer>
  );
}

export function SpecSheetTable({ data, title }: SpecSheetTableProps) {
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(defaultVisibleColumns);
  const [rows, setRows] = useState<TreeDataRow[]>([]);

  // Transform flat data into tree structure
  useMemo(() => {
    const transformedRows = data.map((item) => ({
      ...item,
      hierarchy: [item.category, item.id],
    }));
    setRows(transformedRows);
  }, [data]);

  // Custom grouping cell component with expand/collapse toggle
  const CustomGroupingCell = useCallback((params: GridRenderCellParams) => {
    const apiContext = useGridApiContext();
    const isGroup = params.rowNode.type === 'group';

    if (isGroup) {
      const groupNode = params.rowNode as GridGroupNode;
      const isExpanded = groupNode.childrenExpanded;

      const handleToggle = (event: React.MouseEvent) => {
        event.stopPropagation();
        apiContext.current.setRowChildrenExpansion(params.id, !isExpanded);
      };

      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}>
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{ mr: 1 }}
          >
            {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
          <Typography
            sx={{
              fontWeight: 600,
              color: '#333',
            }}
          >
            {groupNode.groupingKey}
          </Typography>
        </Box>
      );
    }

    // Handle double-click to enter edit mode for leaf rows
    const handleDoubleClick = () => {
      apiContext.current.startCellEditMode({ id: params.id, field: params.field });
    };

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          pl: 5,
          cursor: 'text',
        }}
        onDoubleClick={handleDoubleClick}
      >
        <Typography sx={{ color: '#555' }}>
          {params.row.subCategory}
        </Typography>
      </Box>
    );
  }, []);

  // Custom edit cell for the grouping column
  const CustomGroupingEditCell = useCallback((params: GridRenderEditCellParams) => {
    const { id, field, row } = params;
    const apiContext = useGridApiContext();
    // Use the subCategory value from the row since that's the leafField
    const currentValue = params.value ?? row?.subCategory ?? '';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      apiContext.current.setEditCellValue({ id, field, value: newValue });
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        apiContext.current.stopCellEditMode({ id, field });
      } else if (event.key === 'Escape') {
        apiContext.current.stopCellEditMode({ id, field, ignoreModifications: true });
      }
    };

    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        pl: 5,
      }}>
        <TextField
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          fullWidth
          size="small"
          variant="standard"
          sx={{
            '& .MuiInputBase-input': {
              padding: '4px 0',
            },
          }}
        />
      </Box>
    );
  }, []);

  // Get grouping column definition
  const groupingColDef = useMemo(() => ({
    headerName: 'Category / Sub Category',
    minWidth: 280,
    flex: 1.5,
    editable: true,
    leafField: 'subCategory',
    renderCell: CustomGroupingCell,
    renderEditCell: CustomGroupingEditCell,
  }), [CustomGroupingCell, CustomGroupingEditCell]);

  // Only allow editing on leaf rows (actual data), not group headers
  const isCellEditable = useCallback((params: { rowNode: { type: string }; field: string }) => {
    // Don't allow editing on group/category rows
    if (params.rowNode.type === 'group') {
      return false;
    }
    return true;
  }, []);

  // Handle row updates when editing
  const processRowUpdate = useCallback((newRow: TreeDataRow) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  }, []);

  const columns = useMemo(() => {
    const baseColumns = getColumns();
    // Remove subCategory from regular columns since it's shown in grouping column
    return baseColumns.filter(col => col.field !== 'subCategory');
  }, []);

  const getTreeDataPath = useCallback((row: TreeDataRow) => row.hierarchy, []);

  const handleRowSelectionChange = useCallback((newSelection: GridRowSelectionModel) => {
    setRowSelectionModel(newSelection);
  }, []);

  const getRowClassName = useCallback((params: GridRowParams) => {
    if (params.row.hierarchy?.length === 1) {
      return 'category-row';
    }
    const index = rows.findIndex(r => r.id === params.row.id);
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  }, [rows]);

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {title && (
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          treeData
          getTreeDataPath={getTreeDataPath}
          groupingColDef={groupingColDef}
          defaultGroupingExpansionDepth={-1}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handleRowSelectionChange}
          columnVisibilityModel={{
            ...columnVisibilityModel,
            [GRID_TREE_DATA_GROUPING_FIELD]: true,
          }}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          isCellEditable={isCellEditable}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: CustomToolbar,
          }}
          getRowClassName={getRowClassName}
          rowHeight={50}
          sx={{
            border: 'none',
            height: '100%',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fafafa',
              borderBottom: '2px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              color: '#333',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f9fa',
            },
            '& .even-row': {
              backgroundColor: '#ffffff',
            },
            '& .odd-row': {
              backgroundColor: '#fafafa',
            },
            '& .category-row': {
              backgroundColor: '#f5f5f5',
              fontWeight: 600,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #e0e0e0',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
