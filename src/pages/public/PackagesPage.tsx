import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  X,
  Heart,
  Phone,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  Spinner,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import { usePackages } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { cn, formatCurrency } from '../../lib/utils';

// ===========================================================================
// PackagesPage
// ===========================================================================

export function PackagesPage() {
  const { data: packages, isLoading, isError } = usePackages();

  return (
    <>
      <PageHeader
        eyebrow="Event Packages"
        title="Our Packages"
        description="Thoughtfully curated packages for every budget — from intimate ceremonies to grand celebrations. Each can be customized to suit your unique vision."
        bgImage={PEXEL_IMAGES.celebration}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Packages' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !packages || packages.length === 0 ? (
            <EmptyState title="No packages available" />
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {packages.map((pkg, idx) => (
                <Reveal key={pkg.id} delay={idx * 100}>
                  <div
                    className={cn(
                      'flex h-full flex-col rounded-2xl border bg-white p-8 shadow-luxury transition-all duration-300 hover:shadow-gold',
                      pkg.is_featured
                        ? 'border-gold-500 ring-2 ring-gold-500/20'
                        : 'border-ivory-200'
                    )}
                  >
                    {pkg.is_featured && (
                      <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </div>
                    )}
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                      {pkg.name}
                    </h3>
                    {pkg.tagline && (
                      <p className="mt-2 text-sm italic text-charcoal-500">
                        {pkg.tagline}
                      </p>
                    )}
                    <div className="mt-4">
                      <span className="text-sm text-charcoal-500">Price Range</span>
                      <div className="font-serif text-2xl font-semibold text-gold-600">
                        {pkg.price_range ??
                          (pkg.price_from
                            ? `From ${formatCurrency(Number(pkg.price_from))}`
                            : 'Custom Quote')}
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="mt-4 text-sm leading-relaxed text-charcoal-500">
                        {pkg.description}
                      </p>
                    )}

                    <ul className="mt-6 flex-1 space-y-3">
                      {pkg.features?.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-charcoal-600"
                        >
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link
                        to={`/packages/${pkg.slug}`}
                        className={cn(
                          'w-full',
                          pkg.is_featured ? 'btn-primary' : 'btn-outline'
                        )}
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
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
              Need a Custom Package?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Every celebration is unique. Contact us to build a bespoke package
              tailored to your specific needs and budget.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/quote" className="btn-primary">
                <Heart className="h-4 w-4" />
                Request a Custom Quote
              </Link>
              <Link
                to="/contact"
                className="btn-outline border-ivory-300 text-ivory-100 hover:bg-ivory-100 hover:text-charcoal-900"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ===========================================================================
// PackageDetailPage
// ===========================================================================

export function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: packages, isLoading, isError } = usePackages();
  const pkg = packages?.find((p) => p.slug === slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="pt-20">
        <EmptyState
          title="Package Not Found"
          description="The package you're looking for doesn't exist or has been removed."
          action={
            <Link to="/packages" className="btn-primary">
              Back to Packages
            </Link>
          }
        />
      </div>
    );
  }

  const galleryImages = pkg.gallery_urls ?? (pkg.image_url ? [pkg.image_url] : []);

  return (
    <>
      <PageHeader
        eyebrow="Event Packages"
        title={pkg.name}
        description={pkg.tagline ?? pkg.description ?? ''}
        bgImage={pkg.image_url ?? PEXEL_IMAGES.celebration}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Packages', to: '/packages' },
          { label: pkg.name },
        ]}
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm">
          <span className="text-sm text-ivory-200">Starting from</span>
          <span className="font-serif text-2xl font-semibold text-gold-300">
            {pkg.price_range ??
              (pkg.price_from ? formatCurrency(Number(pkg.price_from)) : 'Custom')}
          </span>
        </div>
      </PageHeader>

      {/* Overview */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Package Overview
                  </span>
                </div>
                <h2 className="font-serif text-display-md font-medium text-charcoal-900">
                  About {pkg.name}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-charcoal-500">
                  {pkg.description ?? ''}
                </p>
              </Reveal>

              {/* Features */}
              {pkg.features && pkg.features.length > 0 && (
                <Reveal delay={150}>
                  <div className="mt-12">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                      Package Features
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {pkg.features.map((feature, idx) => (
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

              {/* Inclusions & Exclusions */}
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                {pkg.inclusions && (
                  <Reveal>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                      <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-emerald-800">
                        <Check className="h-5 w-5" />
                        What's Included
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-emerald-700">
                        {pkg.inclusions}
                      </p>
                    </div>
                  </Reveal>
                )}
                {pkg.exclusions && (
                  <Reveal delay={100}>
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
                      <h3 className="flex items-center gap-2 font-serif text-xl font-semibold text-rose-800">
                        <X className="h-5 w-5" />
                        Not Included
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-rose-700">
                        {pkg.exclusions}
                      </p>
                    </div>
                  </Reveal>
                )}
              </div>

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <Reveal delay={200}>
                  <div className="mt-12">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-900">
                      Package Gallery
                    </h3>
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="overflow-hidden rounded-xl shadow-luxury"
                        >
                          <img
                            src={img}
                            alt={`${pkg.name} ${idx + 1}`}
                            className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
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
                    {pkg.name}
                  </h3>
                  <div className="mt-4 border-t border-emerald-600 pt-4">
                    <div className="text-sm text-ivory-200">Price Range</div>
                    <div className="font-serif text-3xl font-semibold text-gold-300">
                      {pkg.price_range ??
                        (pkg.price_from
                          ? formatCurrency(Number(pkg.price_from))
                          : 'Custom')}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ivory-200">
                    Ready to make this package yours? Book now or request a
                    custom quotation.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Link to="/book" className="btn-primary w-full">
                      <Heart className="h-4 w-4" />
                      Book This Package
                    </Link>
                    <Link
                      to="/quote"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ivory-300 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-ivory-100 transition-all hover:bg-ivory-100 hover:text-charcoal-900"
                    >
                      Request a Quote
                    </Link>
                  </div>
                  <div className="mt-6 space-y-3 border-t border-emerald-600 pt-6">
                    <div className="flex items-center gap-2 text-sm text-ivory-200">
                      <Phone className="h-4 w-4 text-gold-300" />
                      +231 77 123 4567
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ivory-200">
                      <Calendar className="h-4 w-4 text-gold-300" />
                      Mon \u2013 Sat: 9AM \u2013 6PM
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PackagesPage;
