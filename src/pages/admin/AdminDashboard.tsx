import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CalendarDays,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  Package,
  Image as ImageIcon,
  TrendingUp,
} from 'lucide-react';
import { Spinner } from '../../components/ui/Section';
import { AdminPageHeader } from '../../components/ui/AdminTable';
import { useBookings, useCustomers, useRentalItems } from '../../lib/hooks';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
} from '../../lib/constants';
import {
  cn,
  formatDateShort,
  formatRelativeTime,
  getAvailability,
} from '../../lib/utils';
import type { Booking } from '../../types';

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string;
  value: string;
  icon: typeof CalendarDays;
  accent?: 'gold' | 'emerald' | 'blue' | 'rose';
}

const ACCENT_CLASSES: Record<NonNullable<KpiCardProps['accent']>, string> = {
  gold: 'bg-gold-50 text-gold-600',
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
};

function KpiCard({ label, value, icon: Icon, accent = 'gold' }: KpiCardProps) {
  return (
    <div className="card-luxury p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-charcoal-500">
            {label}
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold text-charcoal-900">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            ACCENT_CLASSES[accent]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Monthly bookings chart data
// ---------------------------------------------------------------------------

const STATUS_PIE_COLORS: Record<string, string> = {
  new: '#3b82f6',
  pending_review: '#f59e0b',
  contacted: '#06b6d4',
  negotiation: '#a855f7',
  quotation_sent: '#6366f1',
  accepted: '#10b981',
  scheduled: '#14b8a6',
  completed: '#22c55e',
  cancelled: '#f43f5e',
  rejected: '#ef4444',
};

function buildMonthlyData(bookings: Booking[]) {
  const months: { label: string; key: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      key: `${d.getFullYear()}-${d.getMonth()}`,
    });
  }
  return months.map((m) => {
    const count = bookings.filter((b) => {
      const d = new Date(b.created_at);
      return `${d.getFullYear()}-${d.getMonth()}` === m.key;
    }).length;
    return { month: m.label, bookings: count };
  });
}

function buildStatusData(bookings: Booking[]) {
  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    counts[b.status] = (counts[b.status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([status, value]) => ({
    name: BOOKING_STATUS_LABELS[status] ?? status,
    value,
    status,
  }));
}

// ---------------------------------------------------------------------------
// AdminDashboard
// ---------------------------------------------------------------------------

export function AdminDashboard() {
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: customers = [] } = useCustomers();
  const { data: rentalItems = [] } = useRentalItems();

  const monthlyData = useMemo(() => buildMonthlyData(bookings), [bookings]);
  const statusData = useMemo(() => buildStatusData(bookings), [bookings]);

  const pendingCount = useMemo(
    () =>
      bookings.filter((b) =>
        ['new', 'pending_review', 'contacted', 'negotiation', 'quotation_sent'].includes(
          b.status
        )
      ).length,
    [bookings]
  );

  const acceptedCount = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === 'accepted' || b.status === 'scheduled' || b.status === 'completed'
      ).length,
    [bookings]
  );

  const lowStockItems = useMemo(
    () =>
      rentalItems
        .map((item) => ({ item, ...getAvailability(item.stock, item.reserved_quantity) }))
        .filter((x) => x.status !== 'in-stock'),
    [rentalItems]
  );

  const recentBookings = useMemo(() => bookings.slice(0, 6), [bookings]);

  const quickActions = [
    { label: 'New Booking', to: '/admin/bookings', icon: Plus, accent: 'text-gold-600' },
    { label: 'Create Quotation', to: '/admin/quotations', icon: FileText, accent: 'text-emerald-700' },
    { label: 'Manage Inventory', to: '/admin/rentals', icon: Package, accent: 'text-blue-600' },
    { label: 'Upload Gallery', to: '/admin/gallery', icon: ImageIcon, accent: 'text-purple-600' },
  ];

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of bookings, revenue, and inventory at Event Decorators."
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Bookings"
          value={String(bookings.length)}
          icon={CalendarDays}
          accent="gold"
        />
        <KpiCard
          label="Pending Action"
          value={String(pendingCount)}
          icon={Clock}
          accent="rose"
        />
        <KpiCard
          label="Customers"
          value={String(customers.length)}
          icon={Users}
          accent="blue"
        />
        <KpiCard
          label="Accepted Bookings"
          value={String(acceptedCount)}
          icon={DollarSign}
          accent="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bookings area chart */}
        <div className="card-luxury p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-charcoal-900">
              Bookings Over Time
            </h2>
            <TrendingUp className="h-5 w-5 text-gold-500" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A227" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EBE0" />
                <XAxis dataKey="month" stroke="#818181" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#818181" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #F1EBE0',
                    borderRadius: '0.75rem',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#C9A227"
                  strokeWidth={2}
                  fill="url(#bookingsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status pie chart */}
        <div className="card-luxury p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-charcoal-900">
            Status Distribution
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_PIE_COLORS[entry.status] ?? '#C9A227'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #F1EBE0',
                    borderRadius: '0.75rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {statusData.map((entry) => (
              <div key={entry.status} className="flex items-center gap-1.5 text-xs text-charcoal-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_PIE_COLORS[entry.status] ?? '#C9A227' }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings + Inventory alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent bookings */}
        <div className="card-luxury p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-charcoal-900">
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-sm font-semibold text-gold-600 hover:text-gold-700"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-ivory-200">
            {recentBookings.length === 0 ? (
              <p className="py-8 text-center text-charcoal-400">No bookings yet.</p>
            ) : (
              recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  to="/admin/bookings"
                  className="flex items-center justify-between py-3 transition-colors hover:bg-ivory-50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-charcoal-900">
                      {(booking.event_type ?? 'wedding') === 'wedding'
                        ? (booking.bride_name || booking.groom_name
                            ? `${booking.bride_name ?? ''} & ${booking.groom_name ?? ''}`.trim()
                            : '—')
                        : (booking.client_name ?? '—')}
                    </p>
                    <p className="text-sm text-charcoal-500">
                      {booking.event_date ? formatDateShort(booking.event_date) : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium',
                        BOOKING_STATUS_COLORS[booking.status] ??
                          'bg-ivory-100 text-charcoal-700 border-ivory-200'
                      )}
                    >
                      {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                    </span>
                    <span className="hidden text-xs text-charcoal-400 sm:inline">
                      {formatRelativeTime(booking.created_at)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Inventory alerts */}
        <div className="card-luxury p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-serif text-xl font-medium text-charcoal-900">
              Inventory Alerts
            </h2>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="py-8 text-center text-charcoal-400">
              All items are well stocked.
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.slice(0, 6).map(({ item, available, status }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-ivory-200 bg-ivory-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-charcoal-900">{item.name}</p>
                    <p className="text-xs text-charcoal-500">
                      {available} available · {item.stock} stock
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      status === 'out-of-stock'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    )}
                  >
                    {status === 'out-of-stock' ? 'Out' : 'Low'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium text-charcoal-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="card-luxury flex flex-col items-center justify-center gap-3 p-6 transition-all hover:shadow-gold"
              >
                <Icon className={cn('h-8 w-8', action.accent)} />
                <span className="text-sm font-semibold text-charcoal-800">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
