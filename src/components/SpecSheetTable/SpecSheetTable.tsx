import { useState, useMemo, useCallback } from 'react';
import {
  DataGridPremium,
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
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SpecSheetTableProps, SpecItem } from './types';
import { getColumns, defaultVisibleColumns, getGlobalColumns, defaultGlobalVisibleColumns } from './columns';
import './SpecSheetTable.css';

interface TreeDataRow extends SpecItem {
  hierarchy: string[];
}

export function SpecSheetTable({ data, title, variant = 'default' }: SpecSheetTableProps) {
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const isGlobal = variant === 'global';
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(
    isGlobal ? defaultGlobalVisibleColumns : defaultVisibleColumns
  );
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
          overflow: 'hidden',
        }}>
          <IconButton
            size="small"
            onClick={handleToggle}
            sx={{ mr: 1, flexShrink: 0 }}
          >
            {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
          <Typography
            noWrap
            sx={{
              fontWeight: 600,
              color: '#333',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
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
          overflow: 'hidden',
        }}
        onDoubleClick={handleDoubleClick}
      >
        <Typography
          noWrap
          sx={{
            color: '#555',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
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
    const baseColumns = isGlobal ? getGlobalColumns() : getColumns();
    // Remove subCategory from regular columns since it's shown in grouping column
    return baseColumns.filter(col => col.field !== 'subCategory');
  }, [isGlobal]);

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
    <div className="spec-sheet-table-container">
      {title && (
        <Box sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}
      <DataGridPremium
        autoHeight
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
        getRowClassName={getRowClassName}
        rowHeight={52}
        hideFooter
      />
    </div>
  );
}
