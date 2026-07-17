import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';
import { COMPANY } from '../../lib/constants';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/packages', label: 'Packages' },
  { to: '/rentals', label: 'Rentals' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'bg-ivory-100/95 shadow-luxury backdrop-blur-md' : 'bg-transparent'
        )}
      >
        <div className="container-luxury">
          <nav className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 shadow-md">
                <svg viewBox="0 0 32 32" className="h-7 w-7" fill="#C9A227">
                  <path d="M16 7L19 13L25 14L20.5 18.5L22 25L16 21.5L10 25L11.5 18.5L7 14L13 13Z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className={cn('font-serif text-xl font-semibold tracking-tight', scrolled ? 'text-charcoal-900' : 'text-white')}>
                  {COMPANY.name}
                </span>
                <span className={cn('text-[10px] uppercase tracking-[0.2em]', scrolled ? 'text-gold-600' : 'text-gold-300')}>
                  Wedding & Event
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      scrolled
                        ? isActive
                          ? 'bg-gold-500/15 text-gold-700'
                          : 'text-charcoal-700 hover:text-gold-700'
                        : isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:text-white'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <Link to="/book" className="btn-primary text-xs">
                Book Now
              </Link>
              <Link to="/quote" className="btn-outline text-xs">
                Get Quote
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'rounded-lg p-2 transition-colors lg:hidden',
                scrolled ? 'text-charcoal-800' : 'text-white'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-charcoal-900/40 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-80 max-w-[85%] bg-ivory-100 shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-ivory-200 px-6">
            <span className="font-serif text-lg font-semibold text-charcoal-900">{COMPANY.name}</span>
            <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-charcoal-600" aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-1 px-4 py-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'bg-gold-500/15 text-gold-700' : 'text-charcoal-700 hover:bg-ivory-200'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/booking" className="btn-primary w-full">
                Book Now
              </Link>
              <Link to="/quotation" className="btn-outline w-full">
                Get Quote
              </Link>
            </div>
            <a href="tel:+231771234567" className="mt-6 flex items-center gap-2 text-sm text-charcoal-600">
              <Phone className="h-4 w-4 text-gold-600" />
              +231 77 123 4567
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
