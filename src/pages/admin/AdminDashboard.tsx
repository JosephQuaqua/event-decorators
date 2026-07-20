import { useAuth } from "../../contexts/AuthContext";
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  PieChart,
  PieChart as RePieChart,
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
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  ArrowRight,
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
    <div className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-gold-100/20 blur-3xl transition-all duration-300 group-hover:bg-gold-200/30"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-charcoal-500">
            {label}
          </p>
          <p className="mt-3 font-serif text-4xl font-bold text-charcoal-900">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
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
  const { profile } = useAuth();
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

  const upcomingEvents = useMemo(
  () =>
    bookings.filter((booking) => {
      if (!booking.event_date) return false;

      return (
        new Date(booking.event_date) >= new Date() &&
        booking.status !== "cancelled" &&
        booking.status !== "rejected"
      );
    }).length,
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
    { label: 'Manage Inventory', to: '/admin/inventory', icon: Package, accent: 'text-blue-600' },
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

    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F5132] via-[#145A32] to-[#0B3D2E] px-6 py-7 shadow-2xl">

  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"></div>

  <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
<div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
  
  
  
  <div className="max-w-3xl">
  <p className="mb-3 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-300">
  Event Decorators Admin Dashboard
</p>

 <h2 className="font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
  Welcome back,
  <span className="ml-2 text-yellow-300">
    {profile?.full_name?.split(" ")[0] ?? "Administrator"}
  </span>
</h2>

<p className="mt-5 max-w-2xl text-[16px] leading-8 text-emerald-100/90">
 Manage bookings, quotations, clients, staff, inventory, and wedding operations from one beautifully crafted workspace designed for Event Decorators..
</p>  </div>

 <div className="flex flex-col gap-3">

  <Link
    to="/admin/bookings"
    className="group flex w-64 items-center justify-between rounded-2xl bg-white px-5 py-3 text-emerald-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <div className="flex items-center gap-3">
  <Plus className="h-5 w-5" />
  <span className="font-semibold">New Booking</span>
</div>

<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
  </Link>

  <Link
    to="/admin/quotations"
   className="group flex w-64 items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-1"
  >
    <FileText className="h-5 w-5" />
    <span>Create Quote</span>

    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </Link>

</div>
</div>
</div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Bookings"
          value={String(bookings.length)}
          icon={CalendarDays}
          accent="gold"
        />
        <KpiCard
          label="Pending Bookings"
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
  label="Upcoming Events"
  value={String(upcomingEvents)}
  icon={CalendarDays}
  accent="emerald"
/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Bookings area chart */}
       <div className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-2xl lg:col-span-2">
          
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold-100/20 blur-3xl"></div>

         <div className="relative z-10 mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
              Bookings Over Time
            </h2>
           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50">
    <TrendingUp className="h-6 w-6 text-gold-600" />
</div>
          </div>
         <div className="relative z-10 h-80 w-full">
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
        <div className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-2xl">
          <div className="relative z-10 mb-6 flex items-center justify-between">
  <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
    Booking Status
  </h2>

  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
    <PieChart className="h-6 w-6 text-emerald-600" />
  </div>
</div>
          <div className="relative z-10 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
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
              </RePieChart>
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent bookings */}
        <div className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-2xl lg:col-span-2">
          
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/20 blur-3xl"></div>

          <div className="relative z-10 mb-6 flex items-center justify-between">
            <div>
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
        LIVE BOOKINGS
    </p>

    <h2 className="mt-1 font-serif text-2xl font-semibold text-charcoal-900">
        Recent Bookings
    </h2>
</div>
            <Link
              to="/admin/bookings"
              className="text-sm font-semibold text-gold-600 hover:text-gold-700"
            >
              <div className="flex items-center gap-2">
    <span>View all</span>
    <ArrowRight className="h-4 w-4" />
</div>
            </Link>
          </div>
          <div className="divide-y divide-ivory-200">
            {recentBookings.length === 0 ? (
              <p className="py-6 text-center text-charcoal-400">No bookings yet.</p>
            ) : (
              recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  to="/admin/bookings"
                  className="flex items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 hover:bg-[#FAF8F4]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-charcoal-900">
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
        <div className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-2xl">
         <div className="absolute left-0 top-0 h-36 w-36 rounded-full bg-emerald-100/30 blur-3xl"></div>
          <div className="relative z-10 mb-6 flex items-center justify-between">
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
                  className="flex items-center justify-between rounded-2xl border border-[#EFE7D8] bg-[#FCFBF8] px-5 py-4 transition-all duration-300 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-charcoal-900">{item.name}</p>
                    <p className="mt-1 text-sm text-charcoal-500">
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
  <div className="mb-6 flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
        SHORTCUTS
      </p>

      <h2 className="mt-1 font-serif text-3xl font-semibold text-charcoal-900">
        Quick Actions
      </h2>
    </div>

    <div className="h-px w-24 bg-gradient-to-r from-gold-500 to-transparent"></div>
  </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="group relative overflow-hidden rounded-3xl border border-[#E8E2D5] bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F6F2] transition-all duration-300 group-hover:scale-110">
  <Icon className={cn("h-7 w-7", action.accent)} />
</div>
                <span className="mt-5 block text-base font-semibold text-charcoal-900">
                  {action.label}
                </span>

                <p className="mt-2 text-sm text-charcoal-500">
                Open module
            </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
