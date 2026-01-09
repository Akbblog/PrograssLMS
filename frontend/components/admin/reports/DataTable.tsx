'use client';

import * as React from 'react';
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from '@/components/ui/lumina-card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Table2, FileX } from 'lucide-react';

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyText?: string;
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  className?: string;
  maxHeight?: string;
}

export function DataTable<T>({
  columns,
  rows,
  emptyText,
  title,
  searchable = false,
  searchPlaceholder = 'Search...',
  loading = false,
  className,
  maxHeight = '300px',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredRows = React.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const value = col.render(row);
        return String(value).toLowerCase().includes(query);
      })
    );
  }, [rows, searchQuery, columns]);

  if (loading) {
    return (
      <div className={cn('w-full', className)}>
        {title && (
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            {searchable && <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />}
          </div>
        )}
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="bg-muted/30 h-10 flex items-center px-3 gap-4 border-b border-border">
            {columns.map((_, i) => (
              <div key={i} className="h-3 w-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 flex items-center px-3 gap-4 border-b border-border last:border-0">
              {columns.map((_, j) => (
                <div key={j} className="h-3 w-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tableContent = (
    <div
      className="overflow-x-auto overflow-y-auto rounded-xl border border-border bg-card"
      style={{ maxHeight }}
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/30 sticky top-0">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground border-b border-border"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filteredRows.length === 0 ? (
            <tr>
              <td className="px-4 py-12 text-center" colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                    <FileX className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm font-medium">{emptyText || 'No data available'}</p>
                  {searchQuery && (
                    <p className="text-xs mt-1">
                      No results for "{searchQuery}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            filteredRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-muted/30 transition-colors duration-150"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle text-foreground">
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // If title or searchable, wrap in header
  if (title || searchable) {
    return (
      <div className={cn('w-full space-y-3', className)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {title && (
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Table2 className="w-4 h-4 text-primary" />
              {title}
            </h4>
          )}
          {searchable && (
            <div className="relative w-full sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
        {tableContent}
      </div>
    );
  }

  return <div className={cn('w-full', className)}>{tableContent}</div>;
}
