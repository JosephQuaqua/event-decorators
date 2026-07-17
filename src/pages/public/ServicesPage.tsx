import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Heart, Phone, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  SectionHeading,
  Spinner,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import { useServices } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';

// ---------------------------------------------------------------------------
// Icon mapping for service icons
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, string> = {
  flower2: '🌸',
  crown: '👑',
  church: '⛪',
  utensils: '🍽️',
  scissors: '✂️',
  'clipboard-list': '📋',
  package: '📦',
  'message-circle': '💬',
  cake: '🎂',
};

// ===========================================================================
// ServicesPage
// ===========================================================================

export function ServicesPage() {
  const { data: services, isLoading, isError } = useServices();

  return (
    <>
      <PageHeader
        eyebrow="What We Offer"
        title="Our Services"
        description="A full suite of event services — from planning and decor to catering, cakes, rentals, and coordination. We handle every detail so you can enjoy every moment."
        bgImage={PEXEL_IMAGES.decor}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="skeleton h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !services || services.length === 0 ? (
            <EmptyState title="No services available" />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <Reveal key={service.id} delay={idx * 80}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury transition-all duration-300 hover:shadow-gold">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-ivory-200 text-5xl">
                          {ICON_MAP[service.icon ?? ''] ?? '✨'}
                        </div>
                      )}
                      <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-2xl shadow-md backdrop-blur-sm">
                        {ICON_MAP[service.icon ?? ''] ?? '✨'}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                        {service.name}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-500">
                        {service.short_description ?? service.description ?? ''}
                      </p>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {service.features.slice(0, 4).map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-charcoal-600"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-6">
                        <Link
                          to={`/services/${service.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700"
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
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
              Ready to Plan Your Event?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Mix and match our services to create the perfect celebration
              package.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/book" className="btn-primary">
                <Heart className="h-4 w-4" />
                Book Your Event
              </Link>
              <Link
                to="/quote"
                className="btn-outline border-ivory-300 text-ivory-100 hover:bg-ivory-100 hover:text-charcoal-900"
              >
                Request a Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ===========================================================================
// ServiceDetailPage
// ===========================================================================

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: services, isLoading, isError } = useServices();
  const service = services?.find((s) => s.slug === slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="pt-20">
        <EmptyState
          title="Service Not Found"
          description="The service you're looking for doesn't exist or has been removed."
          action={
            <Link to="/services" className="btn-primary">
              Back to Services
            </Link>
          }
        />
      </div>
    );
  }

  const otherServices = (services ?? []).filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title={service.name}
        description={service.short_description ?? service.description ?? ''}
        bgImage={service.image_url ?? PEXEL_IMAGES.decor}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.name },
        ]}
      />

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory-200 text-3xl">
                    {ICON_MAP[service.icon ?? ''] ?? '✨'}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Service Overview
                  </span>
                </div>

                <h2 className="font-serif text-display-md font-medium text-charcoal-900">
                  About {service.name}
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-charcoal-500">
                  {service.description ?? service.short_description ?? ''}
                </p>
              </Reveal>

              {/* Features grid */}
              {service.features && service.features.length > 0 && (
                <Reveal delay={150}>
                  <div className="mt-12">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                      What's Included
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {service.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-ivory-200 bg-ivory-50 p-4"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-charcoal-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <Reveal delay={200}>
                <div className="sticky top-28 rounded-2xl bg-emerald-700 p-8 text-white shadow-luxury">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/50">
                    <Sparkles className="h-6 w-6 text-gold-300" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold">
                    Interested in this service?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory-200">
                    Include it in your booking or request a custom quotation
                    tailored to your event needs.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Link to="/book" className="btn-primary w-full">
                      <Heart className="h-4 w-4" />
                      Book This Service
                    </Link>
                    <Link
                      to="/quote"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ivory-300 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ivory-100 transition-all hover:bg-ivory-100 hover:text-charcoal-900"
                    >
                      Request a Quote
                    </Link>
                  </div>
                  <div className="mt-6 border-t border-emerald-600 pt-6">
                    <div className="flex items-center gap-2 text-sm text-ivory-200">
                      <Phone className="h-4 w-4 text-gold-300" />
                      +231 77 123 4567
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Other services */}
      {otherServices.length > 0 && (
        <section className="section-padding bg-ivory-100">
          <div className="container-luxury">
            <Reveal>
              <SectionHeading
                eyebrow="Explore More"
                title="Other Services"
              />
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {otherServices.map((s, idx) => (
                <Reveal key={s.id} delay={idx * 100}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury transition-all duration-300 hover:shadow-gold"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {s.image_url ? (
                        <img
                          src={s.image_url}
                          alt={s.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-ivory-200 text-4xl">
                          {ICON_MAP[s.icon ?? ''] ?? '✨'}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                        {s.name}
                      </h3>
                      <p className="mt-2 text-sm text-charcoal-500 line-clamp-2">
                        {s.short_description ?? s.description ?? ''}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-gold-600">
                        Learn More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ServicesPage;
