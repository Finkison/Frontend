/**
 * DataTable Component - Enterprise-grade table with sorting, filtering, pagination
 * Replaces duplicate table implementations across School, Teacher, Admin views
 * Fully accessible with keyboard navigation and screen reader support
 */

import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Button from './Button';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface BulkActionItem<T> {
  label: string;
  onClick: (rows: T[]) => void;
  variant?: any;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (item: T, index: number) => string | number;
  searchKey?: string;
  
  // Features
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  onExportCsv?: () => void;
  
  // Pagination
  paginated?: boolean;
  pageSize?: number;
  
  // Row actions
  onRowClick?: (item: T, index: number) => void;
  rowActions?: (item: T, index: number) => React.ReactNode;
  
  // Bulk actions
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  bulkActions?: React.ReactNode | BulkActionItem<T>[];
  
  // Empty state
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  
  // Loading state
  isLoading?: boolean;
  
  // Styling
  stickyHeader?: boolean;
  stripedRows?: boolean;
  compactMode?: boolean;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  searchable = false,
  searchPlaceholder = 'Search...',
  filterable = false,
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

  // Search functionality
  const searchedData = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchable]);

  // Sort functionality
  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;

    const sorted = [...searchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      // Handle null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
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

  // Pagination
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
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
      const allKeys = paginatedData.map((item, idx) => keyExtractor(item, idx));
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
        newSelected.has(keyExtractor(item, idx))
      );
      onSelectionChange(selectedItems);
    }
  };

  const allSelected = paginatedData.length > 0 && 
    paginatedData.every((item, idx) => selectedRows.has(keyExtractor(item, idx)));
  
  const someSelected = paginatedData.some((item, idx) => 
    selectedRows.has(keyExtractor(item, idx))
  ) && !allSelected;

  // Render functions
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
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-neutral-100 rounded-lg" />
        <div className="h-64 bg-neutral-50 rounded-xl border border-neutral-200" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      {(searchable || filterable || exportable || (selectable && selectedRows.size > 0)) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  aria-label="Search table"
                />
              </div>
            )}
            
            {filterable && (
              <Button variant="secondary" size="sm" leftIcon={<Filter />}>
                Filter
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectable && selectedRows.size > 0 && bulkActions && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-xs font-semibold text-emerald-900">
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
                          const key = keyExtractor ? keyExtractor(item, idx) : (item.id ?? idx);
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

            {exportable && (
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

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className={`${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr className="bg-neutral-50/80 border-b border-neutral-200">
              {selectable && (
                <th className="w-12 px-4 py-3">
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
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 ${
                    column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 -ml-1"
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
                <th className="w-16 px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    {emptyIcon || <Search className="w-12 h-12 text-neutral-300" />}
                    <p className="text-sm font-medium text-neutral-600">{emptyMessage}</p>
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
                const key = keyExtractor(item, index);
                const isSelected = selectedRows.has(key);
                
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item, index)}
                    className={`
                      ${stripedRows && index % 2 === 1 ? 'bg-neutral-50/30' : ''}
                      ${onRowClick ? 'cursor-pointer hover:bg-neutral-50' : ''}
                      ${isSelected ? 'bg-emerald-50/50' : ''}
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
                        {column.render ? column.render(item, index) : item[column.key]}
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

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-neutral-600">
            Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
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
        </div>
      )}
    </div>
  );
}

export { DataTable };

