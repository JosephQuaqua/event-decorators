import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// AdminTable
// ---------------------------------------------------------------------------

export interface AdminColumn {
  key: string;
  header: string;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: AdminColumn[];
  data: T[];
  renderCell: (item: T, column: AdminColumn) => ReactNode;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  renderCell,
  onRowClick,
  emptyMessage = 'No records found.',
  className,
}: AdminTableProps<T>) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ivory-200 bg-ivory-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap px-5 py-4 font-semibold uppercase tracking-wider text-charcoal-500',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-charcoal-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors hover:bg-ivory-50',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'whitespace-nowrap px-5 py-4 text-charcoal-700',
                        column.className
                      )}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminPageHeader
// ---------------------------------------------------------------------------

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  action,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>
        <h1 className="font-serif text-3xl font-medium text-charcoal-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-charcoal-500">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
