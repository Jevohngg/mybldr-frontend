import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  GridColDef,
} from '@mui/x-data-grid-premium';
import {
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './Templates.module.css';
import { breadcrumbStyles } from '@/components/Breadcrumb';

type ViewType = 'list' | 'detail';

interface Package {
  id: string;
  name: string;
  variations: number;
  usedIn: string;
}

interface SpecItem {
  id: string;
  category: string;
  subCategory: string;
  location: string;
  description: string;
}

interface TreeDataRow extends SpecItem {
  hierarchy: string[];
}

// Dummy data for packages list
const packagesData: Package[] = [
  { id: '1', name: 'Standard', variations: 3, usedIn: 'Silver Lake' },
  { id: '2', name: 'Move Up', variations: 2, usedIn: 'Silver Lake' },
  { id: '3', name: 'Luxury', variations: 5, usedIn: 'Real Forest' },
  { id: '4', name: 'Active Adult', variations: 1, usedIn: 'Real Forest' },
  { id: '5', name: 'Townhome', variations: 3, usedIn: 'Silver Lake' },
];

// Dummy data for template specifications (matches SpecItem structure)
const templateSpecsData: SpecItem[] = [
  // General Construction
  { id: '1', category: 'General Construction', subCategory: 'Concrete Strength', location: 'Foundation', description: 'Concrete shall have a minimum compressive strength of 4,000 psi at 28 days.' },
  { id: '2', category: 'General Construction', subCategory: 'Structural Steel Grade', location: 'Structural', description: 'All structural steel shall conform to ASTM A992, Grade 50.' },
  { id: '3', category: 'General Construction', subCategory: 'Masonry Unit Standards', location: 'Walls', description: 'Concrete masonry units (CMU) shall meet ASTM C90 standards, with a minimum compressive strength of 1,900 psi.' },
  // Building Exterior
  { id: '4', category: 'Building Exterior', subCategory: 'Exterior Wall Cladding', location: 'Exterior Walls', description: 'Install fiber cement siding with a 30-year warranty, painted with two coats of acrylic latex.' },
  { id: '5', category: 'Building Exterior', subCategory: 'Brick Masonry', location: 'Exterior', description: 'Face brick shall comply with ASTM C216, Grade SW, with Type S mortar joints.' },
  { id: '6', category: 'Building Exterior', subCategory: 'Exterior Paint', location: 'Exterior', description: 'Apply two coats of acrylic latex paint with a minimum dry film thickness of 2 mils per coat.' },
  { id: '7', category: 'Building Exterior', subCategory: 'Roofing Membrane', location: 'Roof', description: 'Install 60-mil TPO roofing membrane, fully adhered, with 20-year warranty.' },
  // Interior Finishes
  { id: '8', category: 'Interior Finishes', subCategory: 'Ceramic Tile Flooring', location: 'Bathrooms, Kitchen', description: 'Install 12"x12" porcelain ceramic tiles, meeting ANSI A137.1, with a slip resistance rating of 0.6 or higher.' },
  { id: '9', category: 'Interior Finishes', subCategory: 'Carpet Flooring', location: 'Bedrooms, Living Areas', description: 'Use nylon broadloom carpet, minimum 28 oz/yd², with a 10-year wear warranty.' },
];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const pageTransition = {
  duration: 0.18,
};

// Column definitions for the MUI DataGrid
const getColumns = (): GridColDef[] => [
  {
    field: 'subCategory',
    headerName: 'Category / Sub Category',
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: 'location',
    headerName: 'Location / Area',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 300,
    editable: true,
  },
];

const defaultVisibleColumns = {
  subCategory: true,
  location: true,
  description: true,
};

export default function GlobalSpecifications() {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // MUI DataGrid state
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(defaultVisibleColumns);
  const [rows, setRows] = useState<TreeDataRow[]>([]);

  // Transform flat data into tree structure
  useMemo(() => {
    const transformedRows = templateSpecsData.map((item) => ({
      ...item,
      hierarchy: [item.category, item.id],
    }));
    setRows(transformedRows);
  }, []);

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
    // Remove subCategory from regular columns since it's shown in grouping column
    return getColumns().filter(col => col.field !== 'subCategory');
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

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setCurrentView('detail');
  };

  const handleBackClick = () => {
    setCurrentView('list');
    setSelectedPackage(null);
  };

  // Package List View
  if (currentView === 'list') {
    return (
      <motion.div
        className={styles.page}
        key="list"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className="h1">Specifications</div>
          <button type="button" className={styles.addButton}>
            <img src="/assets/icons/plus.svg" alt="" className={styles.addButtonIcon} draggable={false} />
            <span>Add New</span>
          </button>
        </div>

        {/* Packages Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.thName}>Template</th>
                <th className={styles.thVariations}>Variations</th>
                <th className={styles.thUsedIn}>Used in</th>
                <th className={styles.thActions}></th>
              </tr>
            </thead>
            <tbody>
              {packagesData.map((pkg) => (
                <tr
                  key={pkg.id}
                  className={styles.packageRow}
                  onClick={() => handlePackageClick(pkg)}
                >
                  <td className={styles.tdName}>
                    <span className={styles.packageName}>{pkg.name}</span>
                  </td>
                  <td className={styles.tdVariations}>{pkg.variations}</td>
                  <td className={styles.tdUsedIn}>{pkg.usedIn}</td>
                  <td className={styles.tdChevron}>
                    <img src="/assets/icons/chevron-right.svg" alt="" className={styles.rowChevron} draggable={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  // Package Detail View
  return (
    <motion.div
      className={styles.page}
      key="detail"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Detail Header with Breadcrumb */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <div className={breadcrumbStyles.breadcrumb}>
            <button
              type="button"
              className={breadcrumbStyles.breadcrumbIconButton}
              onClick={handleBackClick}
              data-tooltip="Specifications"
            >
              <img src="/assets/icons/specifications.svg" alt="" className={breadcrumbStyles.breadcrumbIcon} draggable={false} />
            </button>
            <span className={breadcrumbStyles.breadcrumbSeparator}>/</span>
            <span className={breadcrumbStyles.breadcrumbCurrent}>{selectedPackage?.name}</span>
          </div>
        </div>
        <div className={styles.detailHeaderRight}>
          <button type="button" className={styles.secondaryButton}>
            <img src="/assets/icons/download.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
            <span>Export</span>
          </button>
          <button type="button" className={styles.primaryButton}>
            <img src="/assets/icons/plus.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
            <span>Import</span>
            <img src="/assets/icons/chevron-down-white.svg" alt="" className={styles.buttonIconSmall} draggable={false} />
          </button>
        </div>
      </div>

      {/* MUI DataGrid Table */}
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
          rowHeight={50}
          hideFooter
      />
    </motion.div>
  );
}
