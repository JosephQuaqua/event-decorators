import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Heart,
  CheckCircle2,
  Calendar,
  Users,
  Phone,
  Mail,
  Info,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal } from '../../components/ui/Section';
import { supabase } from '../../lib/supabase';
import {
  SERVICES,
  EVENT_TYPE_LABELS,
  WEDDING_TYPE_LABELS,
  BUDGET_RANGES,
  PEXEL_IMAGES,
} from '../../lib/constants';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
const bookingSchema = z.object({
  event_type: z.string().default('wedding'),
  client_name: z.string().optional(),
  bride_name: z.string().optional(),
  groom_name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  wedding_type: z.string().optional(),
  event_date: z.string().optional(),
  event_time: z.string().optional(),
  venue: z.string().optional(),
  expected_guests: z.string().optional(),
  services_required: z.array(z.string()).default([]),
  budget_range: z.string().optional(),
  additional_notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.event_type === 'wedding') {
    if (!data.bride_name?.trim() && !data.groom_name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter at least the bride or groom name',
        path: ['bride_name'],
      });
    }
  } else {
    if (!data.client_name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter the client or celebrant name',
        path: ['client_name'],
      });
    }
  }
});

type BookingFormData = z.infer<typeof bookingSchema>;

// ===========================================================================
// BookingPage
// ===========================================================================

interface BookingPageProps {
  isQuotation?: boolean;
}

export function BookingPage({ isQuotation = false }: BookingPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema) as never,
    defaultValues: {
      services_required: [],
      event_type: 'wedding',
      wedding_type: 'other',
    },
  });

  const selectedServices = watch('services_required') ?? [];
  const selectedEventType = watch('event_type') ?? 'wedding';
  const isWedding = selectedEventType === 'wedding';

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        event_type: data.event_type || 'wedding',
        client_name: data.client_name || null,
        bride_name: isWedding ? (data.bride_name || null) : null,
        groom_name: isWedding ? (data.groom_name || null) : null,
        email: data.email,
        phone: data.phone,
        wedding_type: isWedding ? (data.wedding_type || 'other') : 'other',
        event_date: data.event_date || null,
        event_time: data.event_time || null,
        venue: data.venue || null,
        expected_guests: data.expected_guests ? parseInt(data.expected_guests, 10) : null,
        services_required: data.services_required ?? [],
        budget_range: data.budget_range || null,
        additional_notes: data.additional_notes || null,
        is_quotation_request: isQuotation,
        status: 'new',
      };

      const { error } = await supabase.from('bookings').insert(payload);

      if (error) throw error;

      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow={isQuotation ? 'Quotation Request' : 'Booking Request'}
          title={isQuotation ? 'Request a Quote' : 'Book Your Event'}
          bgImage={PEXEL_IMAGES.celebration}
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: isQuotation ? 'Quote' : 'Book' },
          ]}
        />
        <section className="section-padding bg-ivory-100">
          <div className="container-luxury">
            <Reveal>
              <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-12 text-center shadow-luxury">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
                  Thank You!
                </h2>
                <p className="mt-4 text-lg text-charcoal-500">
                  Your {isQuotation ? 'quotation request' : 'booking request'} has
                  been submitted successfully. Our team will review the details
                  and contact you within 24 hours.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError(null);
                    }}
                    className="btn-outline"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={isQuotation ? 'Quotation Request' : 'Booking Request'}
        title={isQuotation ? 'Request a Quote' : 'Book Your Event'}
        description={
          isQuotation
            ? "Tell us about your event and we'll prepare a custom quotation tailored to your needs and budget."
            : "Fill out the form below to start the booking process. We'll get back to you within 24 hours to confirm details."
        }
        bgImage={PEXEL_IMAGES.celebration}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: isQuotation ? 'Quote' : 'Book' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <div className="mx-auto max-w-3xl">
            {/* No online payments note */}
            <Reveal>
              <div className="mb-8 flex items-start gap-3 rounded-xl border border-gold-200 bg-gold-50 p-4">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-600" />
                <p className="text-sm text-charcoal-700">
                  <span className="font-semibold">Please note:</span> We do not
                  process online payments. After submitting your request, our
                  team will contact you to discuss details, finalize pricing, and
                  arrange payment directly.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-luxury md:p-10"
              >
                {/* Event Type */}
                <div className="mb-6">
                  <label className="label-field" htmlFor="event_type">
                    Event Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="event_type"
                    className="input-field"
                    {...register('event_type')}
                  >
                    {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Client names — conditional on event type */}
                {isWedding ? (
                  <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="label-field" htmlFor="bride_name">
                        Bride's Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="bride_name"
                        type="text"
                        className="input-field"
                        placeholder="Bride's full name"
                        {...register('bride_name')}
                      />
                      {errors.bride_name && (
                        <p className="mt-1 text-sm text-rose-500">
                          {errors.bride_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label-field" htmlFor="groom_name">
                        Groom's Name
                      </label>
                      <input
                        id="groom_name"
                        type="text"
                        className="input-field"
                        placeholder="Groom's full name"
                        {...register('groom_name')}
                      />
                      {errors.groom_name && (
                        <p className="mt-1 text-sm text-rose-500">
                          {errors.groom_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="label-field" htmlFor="client_name">
                      Client / Celebrant Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="client_name"
                      type="text"
                      className="input-field"
                      placeholder="e.g. Person being celebrated or contact name"
                      {...register('client_name')}
                    />
                    {errors.client_name && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.client_name.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Wedding type — only for weddings */}
                {isWedding && (
                  <div className="mb-6">
                    <label className="label-field" htmlFor="wedding_type">
                      Wedding Type
                    </label>
                    <select
                      id="wedding_type"
                      className="input-field"
                      {...register('wedding_type')}
                    >
                      {Object.entries(WEDDING_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Email & Phone */}
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label-field" htmlFor="email">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-field" htmlFor="phone">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="input-field"
                      placeholder="+231 ..."
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-rose-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Event Date & Time */}
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label-field" htmlFor="event_date">
                      <Calendar className="mr-1 inline h-4 w-4" />
                      Event Date
                    </label>
                    <input
                      id="event_date"
                      type="date"
                      className="input-field"
                      {...register('event_date')}
                    />
                  </div>
                  <div>
                    <label className="label-field" htmlFor="event_time">
                      Event Time
                    </label>
                    <input
                      id="event_time"
                      type="time"
                      className="input-field"
                      {...register('event_time')}
                    />
                  </div>
                </div>

                {/* Venue & Guests */}
                <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label-field" htmlFor="venue">
                      Venue / Location
                    </label>
                    <input
                      id="venue"
                      type="text"
                      className="input-field"
                      placeholder="Event venue or address"
                      {...register('venue')}
                    />
                  </div>
                  <div>
                    <label className="label-field" htmlFor="expected_guests">
                      <Users className="mr-1 inline h-4 w-4" />
                      Expected Guests
                    </label>
                    <input
                      id="expected_guests"
                      type="number"
                      min="1"
                      className="input-field"
                      placeholder="e.g. 150"
                      {...register('expected_guests')}
                    />
                  </div>
                </div>

                {/* Services Required — checkbox grid */}
                <div className="mb-6">
                  <label className="label-field">
                    Services Required
                  </label>
                  <p className="mb-3 text-sm text-charcoal-400">
                    Select all services you're interested in.
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {SERVICES.map((service) => {
                      const isChecked = selectedServices.includes(service.id);
                      return (
                        <label
                          key={service.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
                            isChecked
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-ivory-200 bg-white hover:border-gold-300'
                          )}
                        >
                          <input
                            type="checkbox"
                            value={service.id}
                            className="h-4 w-4 rounded border-ivory-300 text-gold-500 focus:ring-gold-500"
                            {...register('services_required')}
                          />
                          <span className="text-sm text-charcoal-700">
                            {service.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <label className="label-field" htmlFor="budget_range">
                    Budget Range
                  </label>
                  <select
                    id="budget_range"
                    className="input-field"
                    {...register('budget_range')}
                  >
                    <option value="">Select a range (optional)</option>
                    {BUDGET_RANGES.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="mb-8">
                  <label className="label-field" htmlFor="additional_notes">
                    Additional Notes
                  </label>
                  <textarea
                    id="additional_notes"
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Tell us more about your event vision, specific requirements, or questions..."
                    {...register('additional_notes')}
                  />
                </div>

                {/* Error message */}
                {submitError && (
                  <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm text-rose-700">{submitError}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" />
                      {isQuotation ? 'Request Quotation' : 'Submit Booking'}
                    </>
                  )}
                </button>

                {/* Contact info */}
                <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-ivory-200 pt-6 text-sm text-charcoal-500 sm:flex-row">
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gold-500" />
                    +231 77 123 4567
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gold-500" />
                    hello@eventdecorators.lr
                  </span>
                </div>
              </form>
            </Reveal>

            {/* Alternative CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-charcoal-500">
                Prefer to talk first?{' '}
                <Link
                  to="/contact"
                  className="font-semibold text-gold-600 hover:text-gold-700"
                >
                  Contact us directly
                  <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BookingPage;
