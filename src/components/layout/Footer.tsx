import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { useSiteSettings } from '../../lib/hooks';
import { COMPANY } from '../../lib/constants';

const EXPLORE_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Packages', to: '/packages' },
  { label: 'Rental Inventory', to: '/rentals' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQs', to: '/faqs' },
];

const GET_STARTED_LINKS = [
  { label: 'Book an Event', to: '/book' },
  { label: 'Request a Quote', to: '/quote' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Our Team', to: '/about#team' },
];

const DEFAULT_PHONE = '+231 77 123 4567';
const DEFAULT_EMAIL = 'hello@eventdecorators.lr';
const DEFAULT_ADDRESS =
  '15 Broad Street, Monrovia, Montserrado County, Liberia';

export function Footer() {
  const { data: settings } = useSiteSettings();

  const phone =
    (settings?.phone as string | undefined) ?? DEFAULT_PHONE;
  const email =
    (settings?.email as string | undefined) ?? DEFAULT_EMAIL;
  const address =
    (settings?.address as string | undefined) ?? DEFAULT_ADDRESS;
  const hours =
    (settings?.business_hours as string | undefined) ??
    'Mon - Sat: 8:00 AM - 6:00 PM';

  const phoneHref = `tel:${phone.replace(/\s+/g, '')}`;
  const emailHref = `mailto:${email}`;

  return (
    <footer className="bg-charcoal-900 text-ivory-200">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 text-gold-400"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.39 7.36H22l-6.19 4.5L18.2 21 12 16.5 5.8 21l2.39-7.14L2 9.36h7.61L12 2z" />
                </svg>
              </span>
              <span className="font-serif text-xl font-semibold text-white">
                {COMPANY.name}
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory-300">
              {COMPANY.tagline} {COMPANY.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-800 text-ivory-300 transition-colors hover:bg-gold-500 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-800 text-ivory-300 transition-colors hover:bg-gold-500 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-800 text-ivory-300 transition-colors hover:bg-gold-500 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore column */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ivory-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started column */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Get Started
            </h3>
            <ul className="mt-5 space-y-3">
              {GET_STARTED_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ivory-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                <span className="text-sm text-ivory-300">{address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                <a
                  href={phoneHref}
                  className="text-sm text-ivory-300 transition-colors hover:text-gold-400"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                <a
                  href={emailHref}
                  className="text-sm text-ivory-300 transition-colors hover:text-gold-400"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                <span className="text-sm text-ivory-300">{hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-800">
        <div className="container-luxury flex flex-col items-center justify-between gap-2 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-ivory-400">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-sm text-ivory-400">{COMPANY.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
