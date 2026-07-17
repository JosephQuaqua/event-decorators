import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  ArrowRight,
  Send,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal } from '../../components/ui/Section';
import { useSiteSettings } from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';

// ---------------------------------------------------------------------------
// Default contact info
// ---------------------------------------------------------------------------
const DEFAULT_PHONE = '+231 77 123 4567';
const DEFAULT_EMAIL = 'hello@eventdecorators.lr';
const DEFAULT_ADDRESS = '15 Broad Street, Monrovia, Montserrado County, Liberia';
const DEFAULT_HOURS = 'Monday \u2013 Saturday: 9:00 AM \u2013 6:00 PM';

// ===========================================================================
// ContactPage
// ===========================================================================

export function ContactPage() {
  const { data: settings } = useSiteSettings();

  const contactInfo = settings?.contact_info as
    | {
        phone?: string;
        email?: string;
        address?: string;
        hours?: string;
      }
    | undefined;

  const socialLinks = settings?.social_links as
    | {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        whatsapp?: string;
      }
    | undefined;

  const phone = contactInfo?.phone ?? DEFAULT_PHONE;
  const email = contactInfo?.email ?? DEFAULT_EMAIL;
  const address = contactInfo?.address ?? DEFAULT_ADDRESS;
  const hours = contactInfo?.hours ?? DEFAULT_HOURS;

  const phoneHref = `tel:${phone.replace(/\s+/g, '')}`;
  const emailHref = `mailto:${email}`;

  // OpenStreetMap embed centered on Monrovia, Liberia
  const osmSrc =
    'https://www.openstreetmap.org/export/embed.html?bbox=-10.85%2C6.27%2C-10.75%2C6.37&layer=mapnik&marker=6.3205%2C-10.7969';

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Have a question or ready to start planning? We'd love to hear from you. Reach out and let's start creating something beautiful together."
        bgImage={PEXEL_IMAGES.contact}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact' },
        ]}
      />

      {/* Contact info cards */}
      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            <Reveal>
              <div className="h-full rounded-2xl border border-ivory-200 bg-white p-8 text-center shadow-luxury">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                  <MapPin className="h-7 w-7 text-gold-300" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  Visit Us
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                  {address}
                </p>
              </div>
            </Reveal>

            {/* Phone */}
            <Reveal delay={80}>
              <div className="h-full rounded-2xl border border-ivory-200 bg-white p-8 text-center shadow-luxury">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                  <Phone className="h-7 w-7 text-gold-300" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  Call Us
                </h3>
                <a
                  href={phoneHref}
                  className="mt-3 block text-sm leading-relaxed text-charcoal-500 transition-colors hover:text-gold-600"
                >
                  {phone}
                </a>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal delay={160}>
              <div className="h-full rounded-2xl border border-ivory-200 bg-white p-8 text-center shadow-luxury">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                  <Mail className="h-7 w-7 text-gold-300" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  Email Us
                </h3>
                <a
                  href={emailHref}
                  className="mt-3 block break-all text-sm leading-relaxed text-charcoal-500 transition-colors hover:text-gold-600"
                >
                  {email}
                </a>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal delay={240}>
              <div className="h-full rounded-2xl border border-ivory-200 bg-white p-8 text-center shadow-luxury">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700">
                  <Clock className="h-7 w-7 text-gold-300" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                  Business Hours
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
                  {hours}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map + Social */}
      <section className="bg-white pb-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Map */}
            <Reveal>
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Find Us
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                  Our Location
                </h2>
                <p className="mt-3 text-charcoal-500">
                  We're conveniently located in the heart of Monrovia. Visit our
                  studio to discuss your event in person.
                </p>
                <div className="mt-6 overflow-hidden rounded-2xl shadow-luxury">
                  <iframe
                    src={osmSrc}
                    title="Event Decorators location in Monrovia, Liberia"
                    className="h-80 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-charcoal-500">
                  <MapPin className="h-4 w-4 text-gold-500" />
                  {address}
                </div>
              </div>
            </Reveal>

            {/* Social + Quick Links */}
            <Reveal delay={150}>
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-8 bg-gold-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                    Connect
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-charcoal-900">
                  Follow Our Journey
                </h2>
                <p className="mt-3 text-charcoal-500">
                  Stay up to date with our latest events, behind-the-scenes
                  moments, and celebration inspiration.
                </p>

                <div className="mt-6 space-y-3">
                  {socialLinks?.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-ivory-200 bg-ivory-50 p-4 transition-all hover:border-gold-500 hover:shadow-gold"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-900">Instagram</div>
                        <div className="text-sm text-charcoal-500">@eventdecorators</div>
                      </div>
                    </a>
                  )}
                  {socialLinks?.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-ivory-200 bg-ivory-50 p-4 transition-all hover:border-gold-500 hover:shadow-gold"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white">
                        <Facebook className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-900">Facebook</div>
                        <div className="text-sm text-charcoal-500">Event Decorators</div>
                      </div>
                    </a>
                  )}
                  {socialLinks?.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-ivory-200 bg-ivory-50 p-4 transition-all hover:border-gold-500 hover:shadow-gold"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white">
                        <Twitter className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-900">Twitter</div>
                        <div className="text-sm text-charcoal-500">@eventdecorators</div>
                      </div>
                    </a>
                  )}
                  {/* Always show WhatsApp */}
                  <a
                    href={socialLinks?.whatsapp ?? 'https://wa.me/231771234567'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-ivory-200 bg-ivory-50 p-4 transition-all hover:border-gold-500 hover:shadow-gold"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Send className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-charcoal-900">WhatsApp</div>
                      <div className="text-sm text-charcoal-500">{phone}</div>
                    </div>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 py-20">
        <div className="container-luxury text-center">
          <Reveal>
            <h2 className="font-serif text-display-md font-medium text-white">
              Ready to Start Planning?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Book your event or request a quotation — our team is ready to bring
              your vision to life.
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
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
