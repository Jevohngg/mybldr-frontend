// Re-export SpecItem from the consolidated specifications data file
// This maintains backward compatibility for existing imports
export type { SpecItem } from '../../data/specifications';

// Import SpecItem for local use in interfaces
import type { SpecItem } from '../../data/specifications';

export interface SpecSheetTableProps {
  data: SpecItem[];
  title?: string;
  variant?: 'default' | 'global';
  loading?: boolean;
  onSearchChange?: (query: string) => void;
}

export interface SpecRowData extends SpecItem {
  hierarchy: string[];
  isCategory?: boolean;
}
