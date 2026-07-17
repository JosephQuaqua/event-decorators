import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2, Star, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  useTestimonials,
  useFAQs,
  useStaff,
  useServices,
  useBookings,
  useRentalItems,
  useSiteSettings,
} from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminPageHeader } from '../../components/ui/AdminTable';
import { BOOKING_STATUS_LABELS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import type { Testimonial, FAQ } from '../../types';

// ===========================================================================
// Shared modal shell
// ===========================================================================

function ModalShell({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-luxury">
        <div className="sticky top-0 flex items-center justify-between border-b border-ivory-200 bg-white px-6 py-4">
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-ivory-200 bg-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// AdminTestimonials
// ===========================================================================

function AddTestimonialModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [eventType, setEventType] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('testimonials').insert({
        author_name: authorName,
        author_role: authorRole || null,
        rating,
        content,
        event_type: eventType || null,
        is_featured: isFeatured,
        is_active: true,
        display_order: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      onClose();
    },
  });

  return (
    <ModalShell
      title="Add Testimonial"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            disabled={createMutation.isPending || !authorName.trim() || !content.trim()}
            onClick={() => createMutation.mutate()}
            className="btn-primary"
          >
            {createMutation.isPending ? 'Adding…' : 'Add Testimonial'}
          </button>
        </>
      }
    >
      <div>
        <label className="label-field" htmlFor="t-author">
          Author Name
        </label>
        <input
          id="t-author"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="t-title">
          Author Role
        </label>
        <input
          id="t-title"
          type="text"
          value={authorRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="t-rating">
          Rating (1–5)
        </label>
        <input
          id="t-rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="t-quote">
          Content
        </label>
        <textarea
          id="t-quote"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="t-event">
          Event Type
        </label>
        <input
          id="t-event"
          type="text"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="input-field"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal-700">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-ivory-300 text-gold-500 focus:ring-gold-500"
        />
        Featured
      </label>
    </ModalShell>
  );
}

export function AdminTestimonials() {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

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
        title="Testimonials"
        description="Manage client testimonials."
        action={
          <button type="button" onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t: Testimonial) => (
          <div key={t.id} className="card-luxury group relative p-5">
            <button
              type="button"
              onClick={() => deleteMutation.mutate(t.id)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-charcoal-400 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
              aria-label="Delete testimonial"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < t.rating ? 'fill-gold-500 text-gold-500' : 'text-ivory-300'
                  )}
                />
              ))}
            </div>
            <p className="font-serif text-lg italic text-charcoal-700">“{t.content}”</p>
            <div className="mt-4">
              <p className="font-medium text-charcoal-900">{t.author_name}</p>
              {t.author_role && (
                <p className="text-sm text-charcoal-500">{t.author_role}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddTestimonialModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ===========================================================================
// AdminFAQs
// ===========================================================================

function AddFaqModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('faqs').insert({
        question,
        answer,
        category: category || null,
        is_active: true,
        display_order: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      onClose();
    },
  });

  return (
    <ModalShell
      title="Add FAQ"
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            disabled={createMutation.isPending || !question.trim() || !answer.trim()}
            onClick={() => createMutation.mutate()}
            className="btn-primary"
          >
            {createMutation.isPending ? 'Adding…' : 'Add FAQ'}
          </button>
        </>
      }
    >
      <div>
        <label className="label-field" htmlFor="faq-q">
          Question
        </label>
        <input
          id="faq-q"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="faq-a">
          Answer
        </label>
        <textarea
          id="faq-a"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="faq-cat">
          Category
        </label>
        <input
          id="faq-cat"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field"
        />
      </div>
    </ModalShell>
  );
}

export function AdminFAQs() {
  const { data: faqs = [], isLoading } = useFAQs();
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faqs').update({ is_active: false }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

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
        title="FAQs"
        description="Manage frequently asked questions."
        action={
          <button type="button" onClick={() => setShowAdd(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        }
      />
      <div className="space-y-3">
        {faqs.map((faq: FAQ) => (
          <div key={faq.id} className="card-luxury group flex items-start justify-between gap-4 p-5">
            <div>
              <p className="font-medium text-charcoal-900">{faq.question}</p>
              <p className="mt-1 text-sm text-charcoal-600">{faq.answer}</p>
              {faq.category && (
                <span className="mt-2 inline-block rounded-full bg-ivory-100 px-2.5 py-0.5 text-xs text-charcoal-500">
                  {faq.category}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => deleteMutation.mutate(faq.id)}
              className="flex-shrink-0 rounded-lg p-2 text-charcoal-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Delete FAQ"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {showAdd && <AddFaqModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ===========================================================================
// AdminStaff
// ===========================================================================

export function AdminStaff() {
  const { data: staff = [], isLoading } = useStaff();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Staff" description="View your team members." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <div key={member.id} className="card-luxury flex items-center gap-4 p-5">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 text-xl font-semibold text-gold-700">
                {member.full_name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-charcoal-900">{member.full_name}</p>
              <p className="truncate text-sm text-charcoal-500">{member.position ?? '—'}</p>
              {member.role && (
                <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {member.role.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// AdminServices
// ===========================================================================

export function AdminServices() {
  const { data: services = [], isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Services" description="View and manage offered services." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="card-luxury p-5">
            <div className="mb-2 flex items-center gap-3">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <h3 className="font-serif text-lg font-medium text-charcoal-900">
                {service.name}
              </h3>
            </div>
            {service.short_description && (
              <p className="text-sm text-charcoal-600">{service.short_description}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-ivory-100 px-2.5 py-0.5 text-xs text-charcoal-500">
                /{service.slug}
              </span>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  service.is_active
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                )}
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// AdminReports
// ===========================================================================

export function AdminReports() {
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: rentalItems = [] } = useRentalItems();

  const stats = useMemo(() => {
    const total = bookings.length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
    const accepted = bookings.filter((b) =>
      ['accepted', 'scheduled', 'completed'].includes(b.status)
    ).length;
    const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, completed, cancelled, conversionRate };
  }, [bookings]);

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
    });
    return Object.entries(BOOKING_STATUS_LABELS).map(([key, label]) => ({
      key,
      label,
      count: counts[key] ?? 0,
      pct: bookings.length > 0 ? Math.round(((counts[key] ?? 0) / bookings.length) * 100) : 0,
    }));
  }, [bookings]);

  const inventorySummary = useMemo(() => {
    const total = rentalItems.length;
    const lowStock = rentalItems.filter((i) => i.stock - i.reserved_quantity <= Math.max(1, Math.ceil(i.stock * 0.2))).length;
    const outOfStock = rentalItems.filter((i) => i.stock - i.reserved_quantity <= 0).length;
    return { total, lowStock, outOfStock };
  }, [rentalItems]);

  const exportCsv = () => {
    const headers = [
      'Bride Name',
      'Groom Name',
      'Email',
      'Phone',
      'Wedding Type',
      'Event Date',
      'Venue',
      'Status',
      'Estimated Budget',
      'Created At',
    ];
    const rows = bookings.map((b) => [
      b.bride_name ?? '',
      b.groom_name ?? '',
      b.email,
      b.phone ?? '',
      b.wedding_type ?? '',
      b.event_date ?? '',
      b.venue ?? '',
      b.status,
      String(b.budget_range ?? ''),
      b.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `even-decorators-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const reportCards = [
    { label: 'Total Bookings', value: String(stats.total) },
    { label: 'Completed', value: String(stats.completed) },
    { label: 'Cancelled', value: String(stats.cancelled) },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%` },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Booking analytics and inventory summary."
        action={
          <button type="button" onClick={exportCsv} className="btn-outline">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      {/* Report cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {reportCards.map((card) => (
          <div key={card.label} className="card-luxury p-5">
            <p className="text-sm font-medium uppercase tracking-wider text-charcoal-500">
              {card.label}
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold text-charcoal-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status distribution */}
      <div className="card-luxury p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-charcoal-900">
          Status Distribution
        </h2>
        <div className="space-y-3">
          {statusDistribution.map((s) => (
            <div key={s.key} className="flex items-center gap-4">
              <span className="w-32 flex-shrink-0 text-sm text-charcoal-600">{s.label}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-ivory-200">
                <div
                  className="h-full rounded-full bg-gold-500"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="w-16 flex-shrink-0 text-right text-sm text-charcoal-500">
                {s.count} ({s.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory summary */}
      <div className="card-luxury p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-charcoal-900">
          Inventory Summary
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-serif text-2xl font-semibold text-charcoal-900">
              {inventorySummary.total}
            </p>
            <p className="text-sm text-charcoal-500">Total Items</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-amber-600">
              {inventorySummary.lowStock}
            </p>
            <p className="text-sm text-charcoal-500">Low Stock</p>
          </div>
          <div>
            <p className="font-serif text-2xl font-semibold text-rose-600">
              {inventorySummary.outOfStock}
            </p>
            <p className="text-sm text-charcoal-500">Out of Stock</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// AdminSettings
// ===========================================================================

export function AdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Initialize form when settings load
  if (!initialized && settings) {
    setPhone((settings.phone as string) ?? '');
    setEmail((settings.email as string) ?? '');
    setAddress((settings.address as string) ?? '');
    setAnnouncement((settings.announcement as string) ?? '');
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = [
        { key: 'phone', value: phone },
        { key: 'email', value: email },
        { key: 'address', value: address },
        { key: 'announcement', value: announcement },
      ];
      for (const { key, value } of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Manage site-wide settings." />
      <div className="card-luxury max-w-2xl space-y-5 p-6">
        <h2 className="font-serif text-xl font-medium text-charcoal-900">Contact Information</h2>
        <div>
          <label className="label-field" htmlFor="settings-phone">
            Phone
          </label>
          <input
            id="settings-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="settings-email">
            Email
          </label>
          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="settings-address">
            Address
          </label>
          <textarea
            id="settings-address"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
          />
        </div>

        <h2 className="pt-4 font-serif text-xl font-medium text-charcoal-900">
          Announcement
        </h2>
        <div>
          <label className="label-field" htmlFor="settings-announcement">
            Announcement Banner Text
          </label>
          <textarea
            id="settings-announcement"
            rows={3}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="input-field"
          />
        </div>

        {saveMutation.isError && (
          <p className="text-sm text-rose-600">
            Error: {(saveMutation.error as Error)?.message}
          </p>
        )}
        {saveMutation.isSuccess && (
          <p className="text-sm text-emerald-600">Settings saved successfully.</p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            className="btn-primary"
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
