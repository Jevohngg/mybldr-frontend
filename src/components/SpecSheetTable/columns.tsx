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
// Uses fixed widths instead of flex so the table can scroll horizontally
// when the total column width exceeds the container.
export const getGlobalColumns = (): GridColDef[] => [
  {
    field: 'subCategory',
    headerName: 'Category / Sub Category',
    width: 200,
    minWidth: 200,
    editable: true,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    minWidth: 250,
    editable: true,
  },
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    width: 180,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'region',
    headerName: 'Region',
    width: 200,
    minWidth: 180,
    editable: true,
  },
  {
    field: 'division',
    headerName: 'Division',
    width: 180,
    minWidth: 150,
    editable: true,
  },
  {
    field: 'community',
    headerName: 'Community',
    width: 200,
    minWidth: 180,
    editable: true,
  },
];

export const defaultGlobalVisibleColumns = {
  subCategory: true,
  description: true,
  manufacturer: true,
  region: true,
  division: true,
  community: true,
};
