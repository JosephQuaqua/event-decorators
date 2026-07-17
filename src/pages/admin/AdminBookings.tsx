import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  useBookings,
} from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminTable, AdminPageHeader, type AdminColumn } from '../../components/ui/AdminTable';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  WEDDING_TYPE_LABELS,
  EVENT_TYPE_LABELS,
} from '../../lib/constants';
import { cn, formatDate, formatDateShort, formatTime } from '../../lib/utils';
import type { Booking, BookingStatus } from '../../types';

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

  const updateStatus = useMutation({
    mutationFn: async (status: BookingStatus) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', booking!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      setStatusOpen(false);
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-luxury">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-ivory-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-charcoal-900">
              {displayNames}
            </h2>
            <p className="text-sm text-charcoal-500">
              {typeLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
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
              onClick={() => setStatusOpen((v) => !v)}
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
                {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutate(value as BookingStatus)}
                    className={cn(
                      'block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-ivory-50',
                      value === booking.status && 'font-semibold text-gold-600'
                    )}
                  >
                    {label}
                  </button>
                ))}
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

          <div className="border-t border-ivory-200 pt-4 text-xs text-charcoal-400">
            Created {formatDate(booking.created_at)} · Updated {formatDate(booking.updated_at)}
          </div>
        </div>
      </div>
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

  const filtered = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

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
      <AdminPageHeader
        title="Bookings"
        description="Manage all event bookings."
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-gold-500 text-white'
                : 'bg-white text-charcoal-600 border border-ivory-200 hover:bg-ivory-50'
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
        data={filtered}
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

      {selected && (
        <BookingModal booking={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default AdminBookings;
