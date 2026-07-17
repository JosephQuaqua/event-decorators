import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBookings, useQuotations } from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminTable, AdminPageHeader, type AdminColumn } from '../../components/ui/AdminTable';
import { cn, formatCurrency, formatDateShort } from '../../lib/utils';
import type { Booking, Quotation, QuotationItem } from '../../types';

// ---------------------------------------------------------------------------
// Quotation detail modal
// ---------------------------------------------------------------------------

function QuotationDetailModal({
  quotation,
  onClose,
}: {
  quotation: Quotation | null;
  onClose: () => void;
}) {
  if (!quotation) return null;

  const items = quotation.items ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-luxury">
        <div className="sticky top-0 flex items-center justify-between border-b border-ivory-200 bg-white px-6 py-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-charcoal-900">
              {quotation.quotation_number}
            </h2>
            <p className="text-sm text-charcoal-500">
              Status: <span className="font-medium">{quotation.status}</span>
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

        <div className="space-y-6 px-6 py-6">
          {/* Booking info */}
          {quotation.booking && (
            <div className="rounded-xl border border-ivory-200 bg-ivory-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                Linked Booking
              </p>
              <p className="mt-1 font-medium text-charcoal-900">
                {quotation.booking.bride_name || quotation.booking.groom_name
                  ? `${quotation.booking.bride_name ?? ''} & ${quotation.booking.groom_name ?? ''}`.trim()
                  : '—'}
              </p>
              <p className="text-sm text-charcoal-500">
                {quotation.booking.event_date ? formatDateShort(quotation.booking.event_date) : ''}
              </p>
            </div>
          )}

          {/* Line items */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
              Line Items
            </p>
            <div className="overflow-hidden rounded-xl border border-ivory-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-ivory-50">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-charcoal-600">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-charcoal-600">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-charcoal-600">Unit Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-charcoal-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-charcoal-400">
                        No line items.
                      </td>
                    </tr>
                  ) : (
                    items.map((item: QuotationItem) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-charcoal-800">{item.description}</td>
                        <td className="px-4 py-3 text-right text-charcoal-700">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-charcoal-700">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-charcoal-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="ml-auto w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal</span>
              <span>{formatCurrency(quotation.subtotal)}</span>
            </div>
            {quotation.discount ? (
              <div className="flex justify-between text-charcoal-600">
                <span>Discount</span>
                <span>-{formatCurrency(quotation.discount)}</span>
              </div>
            ) : null}
            {quotation.tax ? (
              <div className="flex justify-between text-charcoal-600">
                <span>Tax</span>
                <span>{formatCurrency(quotation.tax)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-ivory-200 pt-2 font-serif text-lg font-semibold text-charcoal-900">
              <span>Total</span>
              <span>{formatCurrency(quotation.total)}</span>
            </div>
          </div>

          {quotation.notes && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                Notes
              </p>
              <p className="rounded-xl border border-ivory-200 bg-ivory-50 p-4 text-charcoal-700">
                {quotation.notes}
              </p>
            </div>
          )}

          <div className="text-xs text-charcoal-400">
            Issued {formatDateShort(quotation.issue_date)} · Expires{' '}
            {formatDateShort(quotation.expiry_date)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create quotation modal
// ---------------------------------------------------------------------------

interface DraftItem {
  description: string;
  quantity: number;
  unit_price: number;
  unit: string;
}

function CreateQuotationModal({
  bookings,
  onClose,
}: {
  bookings: Booking[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [bookingId, setBookingId] = useState<string>('');
  const [items, setItems] = useState<DraftItem[]>([
    { description: '', quantity: 1, unit_price: 0, unit: 'each' },
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [validUntil, setValidUntil] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0),
    [items]
  );
  const total = Math.max(0, subtotal - discount);

  const createMutation = useMutation({
    mutationFn: async () => {
      const booking = bookings.find((b) => b.id === bookingId);
      const quotationNumber = `QT-${Date.now().toString().slice(-8)}`;
      const { data: quotation, error } = await supabase
        .from('quotations')
        .insert({
          booking_id: bookingId || null,
          customer_id: booking?.customer_id ?? null,
          quotation_number: quotationNumber,
          status: 'draft',
          issue_date: new Date().toISOString(),
          expiry_date: validUntil || null,
          subtotal,
          discount,
          tax: null,
          total,
          currency: 'LRD',
          notes: notes || null,
        })
        .select('id')
        .single();
      if (error) throw error;

      if (items.length > 0 && quotation) {
        const itemRows = items
          .filter((i) => i.description.trim() !== '')
          .map((i, idx) => ({
            quotation_id: quotation.id,
            description: i.description,
            quantity: i.quantity,
            unit_price: i.unit_price,
            unit: i.unit,
            total: i.quantity * i.unit_price,
            display_order: idx,
          }));
        if (itemRows.length > 0) {
          const { error: itemError } = await supabase
            .from('quotation_items')
            .insert(itemRows);
          if (itemError) throw itemError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quotations'] });
      onClose();
    },
  });

  const updateItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const addItem = () =>
    setItems((prev) => [...prev, { description: '', quantity: 1, unit_price: 0, unit: 'each' }]);

  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-luxury">
        <div className="sticky top-0 flex items-center justify-between border-b border-ivory-200 bg-white px-6 py-4">
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">
            Create Quotation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* Booking selector */}
          <div>
            <label className="label-field" htmlFor="booking-select">
              Linked Booking
            </label>
            <select
              id="booking-select"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="input-field"
            >
              <option value="">— No linked booking —</option>
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bride_name || b.groom_name
                    ? `${b.bride_name ?? ''} & ${b.groom_name ?? ''}`.trim()
                    : '—'}
                  {b.event_date ? ` · ${formatDateShort(b.event_date)}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Line items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label-field mb-0">Line Items</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                <Plus className="h-4 w-4" /> Add item
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-ivory-200 bg-ivory-50 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-charcoal-500">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, { quantity: Number(e.target.value) })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-charcoal-500">Unit Price (LRD)</label>
                      <input
                        type="number"
                        min={0}
                        value={item.unit_price}
                        onChange={(e) =>
                          updateItem(idx, { unit_price: Number(e.target.value) })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-charcoal-500">Unit</label>
                      <input
                        type="text"
                        placeholder="each"
                        value={item.unit}
                        onChange={(e) => updateItem(idx, { unit: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount + valid until */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="discount">
                Discount (LRD)
              </label>
              <input
                id="discount"
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field" htmlFor="valid-until">
                Valid Until
              </label>
              <input
                id="valid-until"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label-field" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Totals */}
          <div className="ml-auto w-full max-w-xs space-y-2 rounded-xl border border-ivory-200 bg-ivory-50 p-4 text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between border-t border-ivory-200 pt-2 font-serif text-lg font-semibold text-charcoal-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {createMutation.isError && (
            <p className="text-sm text-rose-600">
              Error: {(createMutation.error as Error)?.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => createMutation.mutate()}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Creating…' : 'Create Quotation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminQuotations
// ---------------------------------------------------------------------------

export function AdminQuotations() {
  const { data: quotations = [], isLoading } = useQuotations();
  const { data: bookings = [] } = useBookings();
  const [selected, setSelected] = useState<Quotation | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const columns: AdminColumn[] = [
    { key: 'number', header: 'Quotation #' },
    { key: 'client', header: 'Client' },
    { key: 'event', header: 'Event' },
    { key: 'total', header: 'Total (LRD)' },
    { key: 'status', header: 'Status' },
    { key: 'created', header: 'Created' },
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
        title="Quotations"
        description="Create and manage quotations for events."
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> New Quotation
          </button>
        }
      />

      <AdminTable
        columns={columns}
        data={quotations}
        onRowClick={(q) => setSelected(q)}
        renderCell={(quotation, col) => {
          switch (col.key) {
            case 'number':
              return (
                <span className="font-medium text-charcoal-900">
                  {quotation.quotation_number}
                </span>
              );
            case 'client':
              return quotation.booking?.bride_name || quotation.booking?.groom_name
                ? `${quotation.booking.bride_name ?? ''} & ${quotation.booking.groom_name ?? ''}`.trim()
                : quotation.customer?.full_name ?? '—';
            case 'event':
              return quotation.booking?.event_date ? formatDateShort(quotation.booking.event_date) : '—';
            case 'total':
              return (
                <span className="font-medium text-charcoal-900">
                  {formatCurrency(quotation.total)}
                </span>
              );
            case 'status':
              return (
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs font-medium',
                    quotation.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : quotation.status === 'rejected'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : 'bg-ivory-100 text-charcoal-700 border-ivory-200'
                  )}
                >
                  {quotation.status}
                </span>
              );
            case 'created':
              return formatDateShort(quotation.created_at);
            default:
              return null;
          }
        }}
      />

      {selected && (
        <QuotationDetailModal quotation={selected} onClose={() => setSelected(null)} />
      )}

      {showCreate && (
        <CreateQuotationModal bookings={bookings} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

export default AdminQuotations;
