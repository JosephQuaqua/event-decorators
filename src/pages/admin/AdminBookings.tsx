
import { useEffect, useMemo, useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { X, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  useBookings,
} from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminTable, type AdminColumn } from '../../components/ui/AdminTable';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  WEDDING_TYPE_LABELS,
  EVENT_TYPE_LABELS,
} from '../../lib/constants';
import { cn, formatDate, formatDateShort, formatTime } from '../../lib/utils';
import type {
  Booking,
  BookingStatus,
} from '../../types';

type BookingStatusHistory = {
  id: string;
  booking_id: string;
  old_status: BookingStatus | null;
  new_status: BookingStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
};


const ALLOWED_STATUS_TRANSITIONS: Record<
  BookingStatus,
  BookingStatus[]
> = {
  new: [
    "pending_review",
    "cancelled",
  ],

  pending_review: [
    "contacted",
    "rejected",
    "cancelled",
  ],

  contacted: [
    "negotiation",
    "cancelled",
  ],

  negotiation: [
    "quotation_sent",
    "cancelled",
  ],

  quotation_sent: [
    "accepted",
    "rejected",
    "cancelled",
  ],

  accepted: [
    "scheduled",
    "cancelled",
  ],

  scheduled: [
    "completed",
    "cancelled",
  ],

  completed: [],

  cancelled: [],

  rejected: [],
};

// ---------------------------------------------------------------------------
// Booking detail modal
// ---------------------------------------------------------------------------

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
}

function BookingModal({ booking, onClose }: BookingModalProps) {
  const queryClient = useQueryClient();

  const [statusOpen, setStatusOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] =
    useState<BookingStatus | null>(null);

  const {
    data: statusHistory = [],
    isLoading: isHistoryLoading,
  } = useQuery({
    queryKey: ['booking-status-history', booking?.id],
    queryFn: async () => {
      if (!booking?.id) return [];

      const { data, error } = await supabase
        .from('booking_status_history')
        .select('*')
        .eq('booking_id', booking.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as BookingStatusHistory[];
    },
    enabled: !!booking?.id,
  });

  console.log('STATUS HISTORY:', statusHistory);

  const updateStatus = useMutation({
    mutationFn: async (status: BookingStatus) => {
      if (!booking?.id) {
        throw new Error('No booking selected.');
      }

      const { data, error } = await supabase.rpc(
        'update_booking_status',
        {
          p_booking_id: booking.id,
          p_new_status: status,
        }
      );

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-bookings'],
      });

      queryClient.invalidateQueries({
        queryKey: ['booking-status-history', booking?.id],
      });

      setStatusOpen(false);
      setConfirmStatus(null);
    },
  });

  if (!booking) return null;
   

  const isWedding = (booking.event_type ?? 'wedding') === 'wedding';
  const displayNames = isWedding
    ? (booking.bride_name || booking.groom_name
        ? `${booking.bride_name ?? ''} & ${booking.groom_name ?? ''}`.trim()
        : '—')
    : (booking.client_name ?? '—');

  const typeLabel = isWedding
    ? (booking.wedding_type
        ? `${WEDDING_TYPE_LABELS[booking.wedding_type] ?? booking.wedding_type}`
        : 'Wedding')
    : (EVENT_TYPE_LABELS[booking.event_type ?? 'other'] ?? booking.event_type ?? 'Event');

  const field = (label: string, value: React.ReactNode) => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
        {label}
      </p>
      <p className="mt-1 text-charcoal-800">{value || '—'}</p>
    </div>
  );

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl">
        {/* Header */}
       <div className="sticky top-0 flex items-center justify-between border-b border-[#ECE6DA] bg-gradient-to-r from-[#FCFAF6] to-white px-8 py-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-charcoal-900">
              {displayNames}
            </h2>
           <p className="mt-1 text-base text-charcoal-500">
              {typeLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
           className="rounded-xl border border-[#ECE6DA] bg-white p-3 text-charcoal-500 shadow-sm transition-all hover:bg-[#FCFAF6] hover:shadow-md"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status dropdown */}
        <div className="border-b border-ivory-200 px-6 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
            Status
          </p>
          <div className="relative inline-block">
            <button
              type="button"
              disabled={ALLOWED_STATUS_TRANSITIONS[booking.status].length === 0}
             onClick={() => {
  if (ALLOWED_STATUS_TRANSITIONS[booking.status].length > 0) {
    setStatusOpen((v) => !v);
  }
}}
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium',
                BOOKING_STATUS_COLORS[booking.status] ??
                  'bg-ivory-100 text-charcoal-700 border-ivory-200'
              )}
            >
              {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
              <ChevronDown className="h-4 w-4" />
            </button>
            {statusOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-ivory-200 bg-white py-1 shadow-luxury">
                {ALLOWED_STATUS_TRANSITIONS[booking.status].length === 0 ? (
  <div className="px-4 py-3 text-sm text-charcoal-400">
    No further status changes available.
  </div>
) : (
  ALLOWED_STATUS_TRANSITIONS[booking.status].map((status) => (
    <button
      key={status}
      type="button"
      disabled={updateStatus.isPending}
      onClick={() => {
  setConfirmStatus(status);
  setStatusOpen(false);
}}
      className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-ivory-50"
    >
      {BOOKING_STATUS_LABELS[status]}
    </button>
  ))
)}
              </div>
            )}
          </div>
          {updateStatus.isPending && (
            <p className="mt-2 text-xs text-charcoal-400">Updating…</p>
          )}
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {isWedding
              ? field('Bride Name', booking.bride_name)
              : field('Client Name', booking.client_name)}
            {isWedding && field('Groom Name', booking.groom_name)}
            {field('Event Type', EVENT_TYPE_LABELS[booking.event_type ?? 'wedding'] ?? booking.event_type)}
            {isWedding && field('Wedding Type', booking.wedding_type ? (WEDDING_TYPE_LABELS[booking.wedding_type] ?? booking.wedding_type) : null)}
            {field('Email', booking.email)}
            {field('Phone', booking.phone)}
            {field('Event Date', formatDate(booking.event_date))}
            {field('Event Time', formatTime(booking.event_time))}
            {field('Venue', booking.venue)}
            {field('Expected Guests', booking.expected_guests)}
            {field('Budget Range', booking.budget_range)}
          </div>

          {booking.services_required && booking.services_required.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                Services Required
              </p>
              <div className="flex flex-wrap gap-2">
                {booking.services_required.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {booking.additional_notes && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                Additional Notes
              </p>
              <p className="rounded-xl border border-ivory-200 bg-ivory-50 p-4 text-charcoal-700">
                {booking.additional_notes}
              </p>
            </div>
          )}

          <div className="border-t border-ivory-200 pt-6">
  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
    Booking History
  </p>

  {isHistoryLoading ? (
    <p className="text-sm text-charcoal-400">
      Loading history...
    </p>
  ) : statusHistory.length === 0 ? (
    <p className="text-sm text-charcoal-400">
      No status changes recorded yet.
    </p>
  ) : (
    <div className="space-y-4">
      {statusHistory.map((history) => (
        <div
          key={history.id}
          className="rounded-xl border border-ivory-200 bg-ivory-50 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-charcoal-800">
                {history.old_status
                  ? `${BOOKING_STATUS_LABELS[history.old_status]} → `
                  : ''}
                {BOOKING_STATUS_LABELS[history.new_status]}
              </p>

              <p className="mt-1 text-xs text-charcoal-400">
                {formatDate(history.created_at)}
              </p>
            </div>
          </div>

          {history.note && (
            <p className="mt-2 text-sm text-charcoal-600">
              {history.note}
            </p>
          )}
        </div>
      ))}
    </div>
  )}
</div>

          <div className="border-t border-ivory-200 pt-4 text-xs text-charcoal-400">
  Created {formatDate(booking.created_at)} · Updated {formatDate(booking.updated_at)}
</div>
</div>
</div>

{/* Status Confirmation Dialog */}
{confirmStatus && (
  <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-charcoal-900/30 p-6 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl border border-[#ECE6DA] bg-white p-6 shadow-2xl">
      
      <h3 className="font-serif text-2xl font-medium text-charcoal-900">
        Change Booking Status?
      </h3>

      <p className="mt-3 text-sm leading-6 text-charcoal-500">
        You are about to change this booking from{' '}
        <span className="font-semibold text-charcoal-800">
          {BOOKING_STATUS_LABELS[booking.status]}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-gold-600">
          {BOOKING_STATUS_LABELS[confirmStatus]}
        </span>.
      </p>

      <p className="mt-3 text-xs text-charcoal-400">
        This status change will be recorded in the booking history.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setConfirmStatus(null)}
          disabled={updateStatus.isPending}
          className="rounded-xl border border-[#ECE6DA] bg-white px-5 py-2.5 text-sm font-medium text-charcoal-600 transition-colors hover:bg-[#FCFAF6] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            updateStatus.mutate(confirmStatus);
            setConfirmStatus(null);
          }}
          disabled={updateStatus.isPending}
          className="rounded-xl bg-gradient-to-r from-[#C8A54B] to-[#B68C2C] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateStatus.isPending ? 'Updating...' : 'Confirm Change'}
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminBookings
// ---------------------------------------------------------------------------

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  ...Object.entries(BOOKING_STATUS_LABELS).map(([key, label]) => ({ key, label })),
];

export function AdminBookings() {
  const { data: bookings = [], isLoading } = useBookings();
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState<Booking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, activeTab, sortBy]);

  const filtered = useMemo(() => {


  const term = searchTerm.trim().toLowerCase();

 const results = bookings.filter((booking) => {
  const matchesStatus =
    activeTab === 'all' || booking.status === activeTab;

  const searchableText = [
    booking.bride_name,
    booking.groom_name,
    booking.client_name,
    booking.email,
    booking.phone,
    booking.venue,
    booking.event_type,
    booking.wedding_type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const matchesSearch =
    term === '' || searchableText.includes(term);

  return matchesStatus && matchesSearch;
});

results.sort((a, b) => {
  switch (sortBy) {
    case 'oldest':
      return (
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
      );

    case 'event':
      return (
        new Date(a.event_date ?? 0).getTime() -
new Date(b.event_date ?? 0).getTime()
      );

    case 'client': {
      const nameA =
        a.client_name ||
        `${a.bride_name ?? ''} ${a.groom_name ?? ''}`;
      const nameB =
        b.client_name ||
        `${b.bride_name ?? ''} ${b.groom_name ?? ''}`;

      return nameA.localeCompare(nameB);
    }

    case 'venue':
      return (a.venue ?? '').localeCompare(b.venue ?? '');

    case 'newest':
    default:
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
  }
});



return results;
}, [bookings, activeTab, searchTerm, sortBy]);

const totalPages = Math.max(
  1,
  Math.ceil(filtered.length / rowsPerPage)
);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);


const paginatedBookings = filtered.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);


const pageNumbers = Array.from(
  { length: totalPages },
  (_, index) => index + 1
);


  const columns: AdminColumn[] = [
    { key: 'client', header: 'Client' },
    { key: 'type', header: 'Type' },
    { key: 'date', header: 'Date' },
    { key: 'venue', header: 'Venue' },
    { key: 'status', header: 'Status' },
    { key: 'received', header: 'Received' },
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

  <div>
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600">
      BOOKING MANAGEMENT
    </p>

    <h1 className="mt-2 font-serif text-4xl font-semibold text-charcoal-900">
      Event Bookings
    </h1>

    <p className="mt-2 max-w-2xl text-charcoal-500">
      View, manage and monitor every client booking from one premium workspace.
    </p>
  </div>

  <div className="flex gap-3">

    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3">
      <p className="text-xs uppercase tracking-wider text-emerald-700">
        Total Bookings
      </p>

      <p className="mt-1 text-2xl font-bold text-emerald-800">
        {bookings.length}
      </p>
    </div>

  </div>

</div>

    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Search bookings..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full rounded-2xl border border-[#ECE6DA] bg-white px-5 py-3 text-sm outline-none transition-all focus:border-[#C8A54B] focus:ring-4 focus:ring-[#C8A54B]/10"
    />

    
  </div>

  <div className="w-full lg:w-64">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full rounded-2xl border border-[#ECE6DA] bg-white px-5 py-3 text-sm outline-none transition-all focus:border-[#C8A54B] focus:ring-4 focus:ring-[#C8A54B]/10"
  >
    
    <option value="newest">Newest First</option>
    
    <option value="oldest">Oldest First</option>
    <option value="event">Event Date</option>
    <option value="client">Client Name (A–Z)</option>
    <option value="venue">Venue (A–Z)</option>
  </select>
</div>


</div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300',
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#C8A54B] to-[#B68C2C] text-white shadow-lg'
                : 'bg-[#FAF9F7] text-charcoal-600 border border-[#ECE6DA] hover:bg-white hover:shadow-md'
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-70">
              {tab.key === 'all'
                ? bookings.length
                : bookings.filter((b) => b.status === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <AdminTable
  columns={columns}
  data={paginatedBookings}
        onRowClick={(b) => setSelected(b)}
        renderCell={(booking, col) => {
          switch (col.key) {
            case 'client': {
              const isWedding = (booking.event_type ?? 'wedding') === 'wedding';
              const names = isWedding
                ? (booking.bride_name || booking.groom_name
                    ? `${booking.bride_name ?? ''} & ${booking.groom_name ?? ''}`.trim()
                    : '—')
                : (booking.client_name ?? '—');
              return (
                <div>
                  <p className="font-medium text-charcoal-900">{names}</p>
                  <p className="text-xs text-charcoal-400">{booking.email}</p>
                </div>
              );
            }
            case 'type': {
              const isWedding = (booking.event_type ?? 'wedding') === 'wedding';
              return isWedding
                ? (WEDDING_TYPE_LABELS[booking.wedding_type ?? 'other'] ?? 'Wedding')
                : (EVENT_TYPE_LABELS[booking.event_type ?? 'other'] ?? booking.event_type ?? 'Event');
            }
            case 'date':
              return formatDateShort(booking.event_date);
            case 'venue':
              return booking.venue || '—';
            case 'status':
              return (
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium',
                    BOOKING_STATUS_COLORS[booking.status] ??
                      'bg-ivory-100 text-charcoal-700 border-ivory-200'
                  )}
                >
                  {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                </span>
              );
            case 'received':
              return formatDateShort(booking.created_at);
            default:
              return null;
          }
        }}
      />


      <div className="flex items-center justify-between rounded-2xl border border-[#ECE6DA] bg-white px-6 py-4">

  <p className="text-sm text-charcoal-500">
    Showing{" "}
    <span className="font-semibold">{paginatedBookings.length}</span> of{" "}
    <span className="font-semibold">{filtered.length}</span> bookings
  </p>

 <div className="flex items-center gap-6">

  <div className="flex items-center gap-2">
    <span className="text-sm text-charcoal-500">
      Rows per page
    </span>

    <select
      value={rowsPerPage}
      onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="rounded-xl border border-[#ECE6DA] px-3 py-2 text-sm"
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
  </div>

    <button
      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
      disabled={currentPage === 1}
      className="rounded-xl border border-[#ECE6DA] px-4 py-2 text-sm disabled:opacity-40"
    >
      Previous
    </button>

    <div className="flex items-center gap-2">
  {pageNumbers.map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={cn(
        "h-10 w-10 rounded-xl text-sm font-medium transition-all",
        currentPage === page
          ? "bg-gradient-to-r from-[#C8A54B] to-[#B68C2C] text-white shadow-md"
          : "border border-[#ECE6DA] bg-white text-charcoal-600 hover:bg-[#FCFAF6]"
      )}
    >
      {page}
    </button>
  ))}
</div>

    <button
      onClick={() =>
        setCurrentPage((page) => Math.min(totalPages, page + 1))
      }
      disabled={currentPage === totalPages}
      className="rounded-xl border border-[#ECE6DA] px-4 py-2 text-sm disabled:opacity-40"
    >
      Next
    </button>

  </div>

</div>

      {selected && (
        <BookingModal booking={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default AdminBookings;