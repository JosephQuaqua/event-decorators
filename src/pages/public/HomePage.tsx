import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Calendar,
  Phone,
} from 'lucide-react';
import {
  SectionHeading,
  Reveal,
  Spinner,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import {
  useServices,
  usePackages,
  useFeaturedGallery,
  useTestimonials,
  useStaff,
  useFAQs,
  useSiteStats,
  useSiteSettings,
} from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { cn, formatCurrency } from '../../lib/utils';

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

// ---------------------------------------------------------------------------
// Stat icon mapping
// ---------------------------------------------------------------------------
const STAT_ICON_MAP: Record<string, typeof Heart> = {
  heart: Heart,
  calendar: Calendar,
  smile: Sparkles,
  sparkles: Sparkles,
};

// ===========================================================================
// HomePage
// ===========================================================================

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <AboutPreview />
      <PackagesSection />
      <GalleryPreview />
      <TestimonialsSlider />
      <TeamSection />
      <FAQPreview />
      <CTASection />
    </>
  );
}

// ---------------------------------------------------------------------------
// Hero Section
// ---------------------------------------------------------------------------

function HeroSection() {
  const { data: settings } = useSiteSettings();
  const heroContent = settings?.hero_content as
    | {
        title?: string;
        subtitle?: string;
        image_url?: string;
        cta_primary?: string;
        cta_secondary?: string;
      }
    | undefined;
  const announcement = settings?.announcement as
    | { text?: string; is_active?: boolean }
    | undefined;

  const title = heroContent?.title ?? 'Creating Moments, Crafting Memories';
  const subtitle =
    heroContent?.subtitle ??
    'Luxury event decoration, catering, cakes, tailoring, and full event planning for weddings, parties, graduations, and all ceremonies — all from one dedicated team in Monrovia, Liberia.';
  const heroImage = heroContent?.image_url ?? PEXEL_IMAGES.hero;
  const ctaPrimary = heroContent?.cta_primary ?? 'Book Your Event';
  const ctaSecondary = heroContent?.cta_secondary ?? 'Request Quotation';

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* Announcement banner */}
      {announcement?.is_active && announcement.text && (
        <div className="absolute inset-x-0 top-20 z-20 bg-gold-500/95 py-2.5 text-center backdrop-blur-sm">
          <p className="text-sm font-medium text-charcoal-900">
            {announcement.text}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="container-luxury relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gold-300">
              Event Decorators · Monrovia, Liberia
            </span>
            <span className="h-px w-12 bg-gold-400" />
          </div>

          <h1 className="font-serif text-display-xl font-medium text-white text-shadow-luxury">
            {title}
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ivory-100 md:text-xl">
            {subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/book" className="btn-primary">
              <Heart className="h-4 w-4" />
              {ctaPrimary}
            </Link>
            <Link to="/quote" className="btn-outline border-ivory-300 text-ivory-100 hover:bg-ivory-100 hover:text-charcoal-900">
              {ctaSecondary}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-ivory-300/50 p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold-400" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stats Section
// ---------------------------------------------------------------------------

function StatsSection() {
  const { data: stats, isLoading, isError } = useSiteStats();

  if (isLoading) {
    return (
      <section className="bg-emerald-700 py-16">
        <div className="container-luxury flex justify-center">
          <Spinner className="border-ivory-300 border-t-gold-400" />
        </div>
      </section>
    );
  }

  if (isError || !stats || stats.length === 0) return null;

  return (
    <section className="bg-emerald-700 py-16">
      <div className="container-luxury">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => {
            const Icon = STAT_ICON_MAP[stat.icon ?? ''] ?? Sparkles;
            return (
              <Reveal key={stat.id} delay={idx * 100}>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/50">
                    <Icon className="h-6 w-6 text-gold-300" />
                  </div>
                  <div className="font-serif text-4xl font-semibold text-white md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium uppercase tracking-wider text-ivory-200">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Services Section
// ---------------------------------------------------------------------------

function ServicesSection() {
  const { data: services, isLoading, isError } = useServices();

  return (
    <section className="section-padding bg-ivory-100">
      <div className="container-luxury">
        <Reveal>
          <SectionHeading
            eyebrow="What We Do"
            title="Our Services"
            description="From intimate gatherings to grand celebrations, we offer a full suite of event services — decoration, catering, cakes, tailoring, rentals, and planning — to make your special day unforgettable."
          />
        </Reveal>

        {isLoading ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="mt-16" />
        ) : !services || services.length === 0 ? (
          <EmptyState className="mt-16" title="No services available" />
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <Reveal key={service.id} delay={idx * 80}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury transition-all duration-300 hover:shadow-gold"
                >
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
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-600">
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/services" className="btn-outline">
            View All Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About Preview
// ---------------------------------------------------------------------------

function AboutPreview() {
  const { data: settings } = useSiteSettings();
  const aboutContent = settings?.about_content as
    | {
        title?: string;
        story?: string;
        mission?: string;
      }
    | undefined;

  const title = aboutContent?.title ?? 'A Family-Owned Event Atelier';
  const story =
    aboutContent?.story ??
    'Event Decorators began as a small family business in Monrovia with a big vision: to bring luxury, heart, and precision to every celebration we touch. For over 15 years, we have been honored to help hundreds of clients across Liberia celebrate their most precious moments — from weddings and traditional ceremonies to birthdays, graduations, and corporate galas.';

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-luxury">
                <img
                  src={PEXEL_IMAGES.about}
                  alt="Event Decorators team"
                  className="h-[480px] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-emerald-700 px-8 py-6 text-white shadow-luxury md:block">
                <div className="font-serif text-3xl font-semibold">15+</div>
                <div className="text-sm text-ivory-200">Years of Excellence</div>
              </div>
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={150}>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                  About Us
                </span>
              </div>
              <h2 className="font-serif text-display-md font-medium text-charcoal-900">
                {title}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-charcoal-500">
                {story}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-charcoal-500">
                We approach every celebration with the same dedication,
                craftsmanship, and care that has defined our family for
                generations.
              </p>
              <div className="mt-8">
                <Link to="/about" className="btn-primary">
                  Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Packages Section
// ---------------------------------------------------------------------------

function PackagesSection() {
  const { data: packages, isLoading, isError } = usePackages();

  return (
    <section className="section-padding bg-ivory-100">
      <div className="container-luxury">
        <Reveal>
          <SectionHeading
            eyebrow="Event Packages"
            title="Curated Packages"
            description="Thoughtfully curated packages for every budget — from intimate ceremonies to grand celebrations."
          />
        </Reveal>

        {isLoading ? (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-96 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="mt-16" />
        ) : !packages || packages.length === 0 ? (
          <EmptyState className="mt-16" title="No packages available" />
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {packages.slice(0, 3).map((pkg, idx) => (
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
                    <span className="text-sm text-charcoal-500">Starting from</span>
                    <div className="font-serif text-3xl font-semibold text-gold-600">
                      {pkg.price_range ?? (pkg.price_from ? formatCurrency(Number(pkg.price_from)) : 'Custom')}
                    </div>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features?.slice(0, 6).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-charcoal-600">
                        <span className="mt-1 text-gold-500">✦</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className={cn('w-full', pkg.is_featured ? 'btn-primary' : 'btn-outline')}
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

        <div className="mt-12 text-center">
          <Link to="/packages" className="btn-outline">
            View All Packages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Gallery Preview
// ---------------------------------------------------------------------------

function GalleryPreview() {
  const { data: albums, isLoading, isError } = useFeaturedGallery(6);

  return (
    <section className="section-padding bg-charcoal-900">
      <div className="container-luxury">
        <Reveal>
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                Recent Work
              </span>
              <span className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-display-md font-medium text-white">
              Gallery Highlights
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-300">
              A glimpse into the celebrations we've had the honor of crafting.
            </p>
          </div>
        </Reveal>

        {isLoading ? (
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-16 text-center text-ivory-300">
            Unable to load gallery at this time.
          </div>
        ) : !albums || albums.length === 0 ? (
          <div className="mt-16 text-center text-ivory-300">
            No featured albums yet.
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
            {albums.map((album, idx) => (
              <Reveal key={album.id} delay={idx * 80}>
                <Link
                  to="/gallery"
                  className="group relative block overflow-hidden rounded-xl"
                >
                  {album.cover_image_url ? (
                    <img
                      src={album.cover_image_url}
                      alt={album.title}
                      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-charcoal-800 text-ivory-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg font-semibold text-white">
                      {album.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/gallery" className="btn-outline border-ivory-300 text-ivory-100 hover:bg-ivory-100 hover:text-charcoal-900">
            View Full Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials Slider
// ---------------------------------------------------------------------------

function TestimonialsSlider() {
  const { data: testimonials, isLoading, isError } = useTestimonials(true);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = testimonials ?? [];

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % Math.max(1, items.length));
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused, items.length]);

  if (isLoading) {
    return (
      <section className="section-padding bg-ivory-100">
        <div className="container-luxury flex justify-center">
          <Spinner />
        </div>
      </section>
    );
  }

  if (isError || items.length === 0) return null;

  const active = items[current] ?? items[0];

  return (
    <section className="section-padding bg-ivory-100">
      <div className="container-luxury">
        <Reveal>
          <SectionHeading
            eyebrow="Kind Words"
            title="What Our Clients Say"
            description="Real stories from clients who trusted us with their most precious celebrations."
          />
        </Reveal>

        <div
          className="relative mx-auto mt-16 max-w-4xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-luxury md:p-12">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-gold-200" />

            <div key={active.id} className="animate-fade-in">
              {/* Stars */}
              <div className="mb-6 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < active.rating
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-ivory-300'
                    )}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-xl italic leading-relaxed text-charcoal-700 md:text-2xl">
                "{active.content}"
              </blockquote>

              {/* Author */}
              <div className="mt-8 flex items-center gap-4">
                {active.author_photo_url ? (
                  <img
                    src={active.author_photo_url}
                    alt={active.author_name}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-lg font-semibold text-white">
                    {active.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-charcoal-900">
                    {active.author_name}
                  </div>
                  {active.author_role && (
                    <div className="text-sm text-charcoal-500">
                      {active.author_role}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nav buttons */}
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory-100 p-2 text-charcoal-600 transition-colors hover:bg-gold-500 hover:text-white md:left-4"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory-100 p-2 text-charcoal-600 transition-colors hover:bg-gold-500 hover:text-white md:right-4"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === current
                      ? 'w-8 bg-gold-500'
                      : 'w-2 bg-ivory-300 hover:bg-ivory-400'
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Team Section
// ---------------------------------------------------------------------------

function TeamSection() {
  const { data: staff, isLoading, isError } = useStaff();

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <Reveal>
          <SectionHeading
            eyebrow="The Team"
            title="Meet Our Family"
            description="The dedicated artisans, planners, and coordinators who bring your celebration to life."
          />
        </Reveal>

        {isLoading ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState className="mt-16" />
        ) : !staff || staff.length === 0 ? (
          <EmptyState className="mt-16" title="No team members yet" />
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {staff.slice(0, 4).map((member, idx) => (
              <Reveal key={member.id} delay={idx * 100}>
                <div className="group overflow-hidden rounded-2xl border border-ivory-200 bg-white shadow-luxury transition-all duration-300 hover:shadow-gold">
                  <div className="relative h-72 overflow-hidden">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-700 text-3xl font-semibold text-white">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                      {member.full_name}
                    </h3>
                    {member.position && (
                      <p className="mt-1 text-sm font-medium text-gold-600">
                        {member.position}
                      </p>
                    )}
                    {member.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ Preview
// ---------------------------------------------------------------------------

function FAQPreview() {
  const { data: faqs, isLoading, isError } = useFAQs();

  if (isLoading) {
    return (
      <section className="section-padding bg-ivory-100">
        <div className="container-luxury flex justify-center">
          <Spinner />
        </div>
      </section>
    );
  }

  if (isError || !faqs || faqs.length === 0) return null;

  const previewFaqs = faqs.slice(0, 4);

  return (
    <section className="section-padding bg-ivory-100">
      <div className="container-luxury">
        <Reveal>
          <SectionHeading
            eyebrow="Good to Know"
            title="Frequently Asked Questions"
            description="Quick answers to the questions we hear most often."
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {previewFaqs.map((faq, idx) => (
            <Reveal key={faq.id} delay={idx * 80}>
              <div className="h-full rounded-2xl border border-ivory-200 bg-white p-6 shadow-luxury">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                  {faq.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/faqs" className="btn-outline">
            View All FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA Section
// ---------------------------------------------------------------------------

function CTASection() {
  return (
    <section className="bg-emerald-700 py-20">
      <div className="container-luxury text-center">
        <Reveal>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/50">
            <Heart className="h-8 w-8 text-gold-300" />
          </div>
          <h2 className="font-serif text-display-md font-medium text-white">
            Let's Create Your Perfect Event
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
            Our team is ready to bring your vision to life with
            elegance, precision, and heart — for weddings, parties,
            graduations, and every celebration in between.
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
          <div className="mt-8 flex items-center justify-center gap-2 text-ivory-200">
            <Phone className="h-4 w-4" />
            <span>Or call us: +231 77 123 4567</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default HomePage;
