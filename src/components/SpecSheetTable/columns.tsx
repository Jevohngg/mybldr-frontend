import { GridColDef } from '@mui/x-data-grid-premium';

export const getColumns = (): GridColDef[] => [
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
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    flex: 1,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'model',
    headerName: 'Model/SKU#',
    flex: 1,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'color',
    headerName: 'Color/Finish',
    flex: 1,
    minWidth: 120,
    editable: true,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 0.7,
    minWidth: 100,
    editable: true,
  },
  {
    field: 'warranty',
    headerName: 'Warranty',
    flex: 0.7,
    minWidth: 100,
    editable: true,
  },
];

export const defaultVisibleColumns = {
  subCategory: true,
  location: true,
  description: true,
  manufacturer: false,
  model: false,
  color: false,
  quantity: false,
  warranty: false,
};

// Global specifications columns (for top-level /specifications page)
export const getGlobalColumns = (): GridColDef[] => [
  {
    field: 'subCategory',
    headerName: 'Category / Sub Category',
    flex: 1,
    minWidth: 200,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1.5,
    minWidth: 250,
    editable: true,
  },
  {
    field: 'region',
    headerName: 'Region',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'division',
    headerName: 'Division',
    flex: 1,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'community',
    headerName: 'Community',
    flex: 1,
    minWidth: 180,
    editable: true,
  },
];

export const defaultGlobalVisibleColumns = {
  subCategory: true,
  description: true,
  region: true,
  division: true,
  community: true,
};
