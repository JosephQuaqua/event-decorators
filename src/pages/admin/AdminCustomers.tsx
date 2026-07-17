import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useCustomers } from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminTable, AdminPageHeader, type AdminColumn } from '../../components/ui/AdminTable';
import { formatDateShort } from '../../lib/utils';

// ---------------------------------------------------------------------------
// AdminCustomers
// ---------------------------------------------------------------------------

export function AdminCustomers() {
  const { data: customers = [], isLoading } = useCustomers();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );
  }, [customers, query]);

  const columns: AdminColumn[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'company', header: 'Company' },
    { key: 'city', header: 'City' },
    { key: 'joined', header: 'Joined' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="View and manage customer records."
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, company…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        renderCell={(customer, col) => {
          switch (col.key) {
            case 'name':
              return (
                <span className="font-medium text-charcoal-900">
                  {customer.full_name ?? '—'}
                </span>
              );
            case 'email':
              return customer.email;
            case 'phone':
              return customer.phone || '—';
            case 'company':
              return customer.company || '—';
            case 'city':
              return customer.city || '—';
            case 'joined':
              return formatDateShort(customer.created_at);
            default:
              return null;
          }
        }}
        emptyMessage="No customers found."
      />
    </div>
  );
}

export default AdminCustomers;
