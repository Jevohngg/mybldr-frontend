import { useState, useMemo, useCallback, useEffect } from 'react';
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
  GridSortModel,
} from '@mui/x-data-grid-premium';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { SpecSheetTableProps, SpecItem } from './types';
import { getColumns, defaultVisibleColumns, getGlobalColumns, defaultGlobalVisibleColumns } from './columns';
import './SpecSheetTable.css';

interface TreeDataRow extends SpecItem {
  hierarchy: string[];
}

export function SpecSheetTable({
  data,
  title,
  variant = 'default',
  loading = false,
  onSearchChange,
}: SpecSheetTableProps) {
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const isGlobal = variant === 'global';
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(
    isGlobal ? defaultGlobalVisibleColumns : defaultVisibleColumns
  );
  const [rows, setRows] = useState<TreeDataRow[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sort model - default sort by category then subCategory
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'category', sort: 'asc' },
    { field: 'subCategory', sort: 'asc' },
  ]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set(data.map(item => item.category));
    return Array.from(uniqueCategories).sort();
  }, [data]);

  // Filter data based on search query and category filter
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => {
        return (
          item.subCategory?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.manufacturer?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [data, searchQuery, categoryFilter]);

  // Transform filtered data into tree structure
  useMemo(() => {
    const transformedRows = filteredData.map((item) => ({
      ...item,
      hierarchy: [item.category, item.id],
    }));
    setRows(transformedRows);
  }, [filteredData]);

  // Notify parent of search changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  }, [searchQuery, onSearchChange]);

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
              flex: 1,
              minWidth: 0,
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
            flex: 1,
            minWidth: 0,
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
  // Global variant uses fixed width for horizontal scrolling;
  // default variant uses flex to fill available space.
  const groupingColDef = useMemo(() => ({
    headerName: 'Category / Sub Category',
    ...(isGlobal ? { width: 280 } : { flex: 1.5 }),
    minWidth: 280,
    editable: true,
    leafField: 'subCategory',
    renderCell: CustomGroupingCell,
    renderEditCell: CustomGroupingEditCell,
  }), [isGlobal, CustomGroupingCell, CustomGroupingEditCell]);

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

      {/* Filter Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 2,
          mb: 2,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
        }}
      >
        {/* Left side - Search and Category Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {/* Search Input */}
          <TextField
            size="small"
            placeholder="Search specifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3B82F6',
                  borderWidth: 1,
                },
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '14px',
                padding: '8px 12px',
              },
            }}
          />

          {/* Category Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E5E7EB',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3B82F6',
                  borderWidth: 1,
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

      </Box>

      {/* DataGrid Table */}
      <div style={{ width: '100%' }}>
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
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          sortingOrder={['asc', 'desc']}
          columnBufferPx={1000}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  minHeight: 200,
                }}
              >
                <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
                  {searchQuery || categoryFilter !== 'all'
                    ? 'No specifications match your filters'
                    : 'No specifications available'}
                </Typography>
              </Box>
            ),
          }}
        />
      </div>
    </div>
  );
}
