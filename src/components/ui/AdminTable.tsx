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
    'overflow-hidden rounded-3xl border border-[#ECE6DA] bg-white shadow-xl',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
           <tr className="border-b border-[#ECE6DA] bg-gradient-to-r from-[#FCFAF6] to-[#F7F2E9]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
  'whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8B7A5A]',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EEE5] bg-white">
            {data.length === 0 ? (
              <tr>
               <td
  colSpan={columns.length}
  className="px-8 py-20 text-center"
>
                 <div className="flex flex-col items-center">
  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F4EC]">
    📂
  </div>

  <h3 className="text-lg font-semibold text-charcoal-800">
    Nothing here yet
  </h3>

  <p className="mt-1 text-sm text-charcoal-500">
    {emptyMessage}
  </p>
</div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
  'transition-all duration-300 hover:bg-[#FCFAF6] hover:shadow-sm',
  onRowClick && 'cursor-pointer'
)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
  'whitespace-nowrap px-6 py-5 text-[15px] text-charcoal-700',
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
