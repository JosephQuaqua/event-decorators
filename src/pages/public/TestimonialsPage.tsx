import { Link } from 'react-router-dom';
import { Star, Quote, Heart } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import { useTestimonials } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { formatDate } from '../../lib/utils';

// ===========================================================================
// TestimonialsPage
// ===========================================================================

export function TestimonialsPage() {
  const { data: testimonials, isLoading, isError } = useTestimonials(false);

  return (
    <>
      <PageHeader
        eyebrow="Kind Words"
        title="Testimonials"
        description="Real stories from couples, families, and organizations who trusted us with their most precious moments. We are honored by every kind word."
        bgImage={PEXEL_IMAGES.celebration}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Testimonials' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-72 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !testimonials || testimonials.length === 0 ? (
            <EmptyState
              icon={<Quote className="h-8 w-8" />}
              title="No testimonials yet"
              description="Check back soon to read what our clients have to say."
            />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <Reveal key={t.id} delay={idx * 80}>
                  <div className="relative flex h-full flex-col rounded-2xl border border-ivory-200 bg-white p-8 shadow-luxury transition-all duration-300 hover:shadow-gold">
                    <Quote className="absolute right-6 top-6 h-12 w-12 text-gold-200" />

                    {/* Stars */}
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            'h-4 w-4 ' +
                            (i < t.rating
                              ? 'fill-gold-500 text-gold-500'
                              : 'text-ivory-300')
                          }
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="flex-1 text-sm leading-relaxed text-charcoal-600">
                      "{t.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-4 border-t border-ivory-200 pt-4">
                      {t.author_photo_url ? (
                        <img
                          src={t.author_photo_url}
                          alt={t.author_name}
                          className="h-12 w-12 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-lg font-semibold text-white">
                          {t.author_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-charcoal-900">
                          {t.author_name}
                        </div>
                        {t.author_role && (
                          <div className="text-sm text-charcoal-500">
                            {t.author_role}
                          </div>
                        )}
                        {t.event_date && (
                          <div className="text-xs text-charcoal-400">
                            {formatDate(t.event_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-20">
        <div className="container-luxury text-center">
          <Reveal>
            <h2 className="font-serif text-display-md font-medium text-white">
              Join Our Happy Clients
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Let us create an experience you'll be excited to share with
              others.
            </p>
            <div className="mt-10">
              <Link to="/book" className="btn-primary">
                <Heart className="h-4 w-4" />
                Book Your Event
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default TestimonialsPage;
