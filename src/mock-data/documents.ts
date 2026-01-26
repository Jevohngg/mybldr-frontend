export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'IMG';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export const communityDocuments: Document[] = [
  {
    id: '1',
    name: 'HOA Guidelines 2024',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: '2024-01-15',
    uploadedBy: 'Admin',
  },
  {
    id: '2',
    name: 'Architectural Review Committee Standards',
    type: 'PDF',
    size: '1.8 MB',
    uploadedAt: '2024-01-10',
    uploadedBy: 'Admin',
  },
  {
    id: '3',
    name: 'Community Site Plan',
    type: 'PDF',
    size: '56 MB',
    uploadedAt: '2023-12-20',
    uploadedBy: 'Admin',
  },
  {
    id: '4',
    name: 'Approved Color Palette',
    type: 'PDF',
    size: '4.2 MB',
    uploadedAt: '2023-11-15',
    uploadedBy: 'Admin',
  },
  {
    id: '5',
    name: 'Landscape Requirements',
    type: 'PDF',
    size: '890 KB',
    uploadedAt: '2023-10-22',
    uploadedBy: 'Admin',
  },
];
