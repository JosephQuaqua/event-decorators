import { Link } from 'react-router-dom';
import { Sparkles, Heart, ArrowRight, Shield, Award } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal, SectionHeading } from '../../components/ui/Section';
import { useSiteSettings } from '../../lib/hooks';
import { PEXEL_IMAGES, COMPANY } from '../../lib/constants';

// ---------------------------------------------------------------------------
// AboutContent type
// ---------------------------------------------------------------------------
interface AboutContent {
  title?: string;
  story?: string;
  mission?: string;
  values?: Array<{ title: string; description: string }>;
}

const VALUE_ICONS = [Award, Shield, Heart, Sparkles];

// ===========================================================================
// AboutPage
// ===========================================================================

export function AboutPage() {
  const { data: settings } = useSiteSettings();
  const about = settings?.about_content as AboutContent | undefined;

  const title = about?.title ?? 'A Family-Owned Event Atelier';
  const story =
    about?.story ??
    'Event Decorators began as a small family business in Monrovia with a big vision: to bring luxury, heart, and precision to every celebration we touch. For over 15 years, we have been honored to help hundreds of clients across Liberia celebrate their most precious moments — from weddings and traditional ceremonies to birthdays, graduations, and corporate galas.';
  const mission =
    about?.mission ??
    'To create extraordinary experiences that honor each client\u2019s unique story, cultural heritage, and personal vision — with meticulous attention to detail and genuine care for every guest.';
  const values = about?.values ?? [
    { title: 'Craftsmanship', description: 'Every floral arrangement, every draped fold, every table setting is crafted with intention and skill.' },
    { title: 'Heritage', description: 'We honor the traditions and cultural protocols that make each Liberian celebration uniquely meaningful.' },
    { title: 'Care', description: 'We treat every client and every celebration as if it were our own family\u2019s.' },
    { title: 'Excellence', description: 'We hold ourselves to the highest standard, because your day deserves nothing less.' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About Event Decorators"
        description="A family-owned atelier bringing luxury, heritage, and heart to celebrations across Liberia."
        bgImage={PEXEL_IMAGES.about}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-2xl shadow-luxury">
                <img
                  src={PEXEL_IMAGES.about}
                  alt="Event Decorators"
                  className="h-[520px] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Our Story
                  </span>
                </div>
                <h2 className="font-serif text-display-md font-medium text-charcoal-900">
                  {title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-charcoal-500">
                  {story}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-charcoal-500">
                  From traditional weddings that honor our rich Liberian heritage
                  to white weddings, birthday parties, graduation galas, and
                  corporate events, we approach every celebration with the same
                  dedication, craftsmanship, and care that has defined our
                  family for generations.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <div className="font-serif text-4xl font-semibold text-gold-600">15+</div>
                    <div className="text-sm text-charcoal-500">Years of Experience</div>
                  </div>
                  <div>
                    <div className="font-serif text-4xl font-semibold text-gold-600">750+</div>
                    <div className="text-sm text-charcoal-500">Events Managed</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-emerald-700 px-8 py-16 text-center shadow-luxury md:px-16">
              <div className="absolute -right-8 -top-8 opacity-10">
                <Sparkles className="h-48 w-48 text-gold-300" />
              </div>
              <div className="relative">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/50">
                  <Sparkles className="h-8 w-8 text-gold-300" />
                </div>
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-gold-400" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                    Our Mission
                  </span>
                  <span className="h-px w-8 bg-gold-400" />
                </div>
                <p className="mx-auto max-w-3xl font-serif text-2xl italic leading-relaxed text-white md:text-3xl">
                  {mission}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <Reveal>
            <SectionHeading
              eyebrow="What Drives Us"
              title="Our Core Values"
              description="The principles that guide every decision, every design, and every celebration we touch."
            />
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => {
              const Icon = VALUE_ICONS[idx] ?? Heart;
              return (
                <Reveal key={idx} delay={idx * 100}>
                  <div className="h-full rounded-2xl border border-ivory-200 bg-ivory-50 p-8 text-center shadow-luxury transition-all duration-300 hover:shadow-gold">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                      <Icon className="h-7 w-7 text-gold-300" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-20">
        <div className="container-luxury text-center">
          <Reveal>
            <h2 className="font-serif text-display-md font-medium text-white">
              Ready to Celebrate?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Let {COMPANY.name} bring the same dedication and craftsmanship to
              your special day.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/book" className="btn-primary">
                <Heart className="h-4 w-4" />
                Book Your Event
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

export default AboutPage;
