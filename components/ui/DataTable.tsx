
import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Search,
  Download,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Button from './Button';
import type { ButtonVariant } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface BulkActionItem<T> {
  label: string;
  onClick: (rows: T[]) => void;
  variant?: ButtonVariant;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T, index: number) => string | number;
  searchKey?: string;

  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  onExport?: () => void;
  onExportCsv?: () => void;

  paginated?: boolean;
  pageSize?: number;

  onRowClick?: (item: T, index: number) => void;
  rowActions?: (item: T, index: number) => React.ReactNode;

  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  bulkActions?: React.ReactNode | BulkActionItem<T>[];

  emptyMessage?: string;
  emptyIcon?: React.ReactNode;

  isLoading?: boolean;

  stickyHeader?: boolean;
  stripedRows?: boolean;
  compactMode?: boolean;
  className?: string;
}

const getCellValue = <T extends object>(item: T, key: string): unknown =>
  (item as Record<string, unknown>)[key];

const renderCellValue = (value: unknown): React.ReactNode => {
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return null;
};

export default function DataTable<T extends object>({
  data,
  columns,
  keyExtractor,
  searchKey,
  searchable = false,
  searchPlaceholder = 'Search...',
  exportable = false,
  onExport,
  onExportCsv,
  paginated = false,
  pageSize = 10,
  onRowClick,
  rowActions,
  selectable = false,
  onSelectionChange,
  bulkActions,
  emptyMessage = 'No data available',
  emptyIcon,
  isLoading = false,
  stickyHeader = false,
  stripedRows = true,
  compactMode = false,
  className = ''
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const effectivePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;

  const getRowKey = (item: T, index: number): string | number => {
    if (keyExtractor) return keyExtractor(item, index);
    const id = getCellValue(item, 'id');
    return typeof id === 'string' || typeof id === 'number' ? id : index;
  };

  const searchedData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      const values = searchKey
        ? [getCellValue(item, searchKey)]
        : Object.values(item as Record<string, unknown>);
      return values.some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchable, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;

    const sorted = [...searchedData].sort((a, b) => {
      const aValue = getCellValue(a, sortConfig.key);
      const bValue = getCellValue(b, sortConfig.key);

      if (aValue === bValue) return 0;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : 1;
      } else {
        return aStr > bStr ? -1 : 1;
      }
    });

    return sorted;
  }, [searchedData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * effectivePageSize;
    const endIndex = startIndex + effectivePageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, effectivePageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / effectivePageSize);

  const handleSort = (columnKey: string) => {
    setSortConfig((current) => {
      if (!current || current.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
      }
      return null;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = paginatedData.map((item) => getRowKey(item, data.indexOf(item)));
      setSelectedRows(new Set(allKeys));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedRows(newSelected);

    if (onSelectionChange) {
      const selectedItems = data.filter((item, idx) => 
        newSelected.has(getRowKey(item, idx))
      );
      onSelectionChange(selectedItems);
    }
  };

  const allSelected = paginatedData.length > 0 && 
    paginatedData.every((item) => selectedRows.has(getRowKey(item, data.indexOf(item))));

  const someSelected = paginatedData.some((item) =>
    selectedRows.has(getRowKey(item, data.indexOf(item)))
  ) && !allSelected;

  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
    );
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="animate-pulse space-y-4">
        <div className="h-10 rounded-lg bg-stone-100 dark:bg-white/10" />
        <div className="h-64 rounded-xl border border-stone-200 bg-stone-50 dark:border-white/10 dark:bg-[#1C1512]" />
        <span className="sr-only">Loading table data</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>

      {(searchable || exportable || (selectable && selectedRows.size > 0)) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-4 text-sm text-stone-900 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/20 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"
                  aria-label="Search table"
                />
              </div>
            )}

          </div>

          <div className="flex items-center gap-2">
            {selectable && selectedRows.size > 0 && bulkActions && (
              <div className="flex items-center gap-2 rounded-lg border border-[#FECDD3] bg-[#FFF1F2] px-3 py-1.5 dark:border-[#881337]/50 dark:bg-[#4C0519]/40">
                <span className="text-xs font-semibold text-[#881337] dark:text-[#FBBF24]">
                  {selectedRows.size} selected
                </span>
                {Array.isArray(bulkActions) ? (
                  bulkActions.map((action, i) => (
                    <Button
                      key={i}
                      variant={action.variant || "secondary"}
                      size="sm"
                      onClick={() => {
                        const selectedItems = data.filter((item, idx) => {
                          const key = getRowKey(item, idx);
                          return selectedRows.has(key);
                        });
                        action.onClick(selectedItems);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))
                ) : (
                  bulkActions
                )}
              </div>
            )}

            {exportable && (onExport || onExportCsv) && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download />}
                onClick={onExport || onExportCsv}
              >
                Export
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:bg-[#261E1A] shadow-sm">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <caption className="sr-only">Data table</caption>
          <thead className={`${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr className="border-b border-stone-200 bg-stone-50/80 dark:border-white/10 dark:bg-white/5">
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-[#E7E0D6] ${
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="ml-[-0.25rem] inline-flex items-center gap-1.5 rounded px-1 transition-colors hover:text-[#881337] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] dark:hover:text-[#FBBF24]"
                      aria-label={`Sort by ${column.header}`}
                    >
                      <span>{column.header}</span>
                      {renderSortIcon(column.key)}
                    </button>
                  ) : (
                    <span>{column.header}</span>
                  )}
                </th>
              ))}

              {rowActions && (
                <th scope="col" className="w-16 px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 dark:divide-white/10">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    {emptyIcon || <Search className="h-12 w-12 text-stone-300 dark:text-stone-600" />}
                    <p className="text-sm font-medium text-stone-600 dark:text-[#E7E0D6]">{emptyMessage}</p>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const key = getRowKey(item, data.indexOf(item));
                const isSelected = selectedRows.has(key);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item, index)}
                    onKeyDown={(event) => {
                      if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        onRowClick(item, index);
                      }
                    }}
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-label={onRowClick ? `Open row ${index + 1}` : undefined}
                    className={`
                      ${stripedRows && index % 2 === 1 ? 'bg-stone-50/30 dark:bg-white/[0.02]' : ''}
                      ${onRowClick ? 'cursor-pointer hover:bg-stone-50 dark:hover:bg-white/5' : ''}
                      ${isSelected ? 'bg-[#FFF1F2]/60 dark:bg-[#4C0519]/30' : ''}
                      transition-colors
                    `}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(key, e.target.checked);
                          }}
                          className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 ${compactMode ? 'py-2' : 'py-3'} text-sm text-neutral-700 ${
                          column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {column.render ? column.render(item, index) : renderCellValue(getCellValue(item, column.key))}
                      </td>
                    ))}

                    {rowActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                          {rowActions(item, index)}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-neutral-600">
            Showing <span className="font-semibold">{(currentPage - 1) * effectivePageSize + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * effectivePageSize, sortedData.length)}</span> of{' '}
            <span className="font-semibold">{sortedData.length}</span> results
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft />}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight />}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}

export { DataTable };
