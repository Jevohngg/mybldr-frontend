export interface SpecItem {
  id: string;
  category: string;
  subCategory: string;
  location: string;
  description: string;
  manufacturer?: string;
  model?: string;
  color?: string;
  quantity?: string;
  warranty?: string;
}

export interface SpecSheetTableProps {
  data: SpecItem[];
  title?: string;
}

export interface SpecRowData extends SpecItem {
  hierarchy: string[];
  isCategory?: boolean;
}
