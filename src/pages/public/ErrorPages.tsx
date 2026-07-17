import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Heart, AlertTriangle } from 'lucide-react';

// ===========================================================================
// NotFoundPage (404)
// ===========================================================================

export function NotFoundPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory-100">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-100" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="container-luxury relative z-10 px-4 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-700 shadow-luxury">
          <span className="font-serif text-3xl font-semibold text-gold-300">404</span>
        </div>

        <h1 className="font-serif text-display-lg font-medium text-charcoal-900">
          Page Not Found
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal-500">
          We're sorry, but the page you're looking for doesn't exist or has been
          moved. Let us help you find your way back.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/contact" className="btn-outline">
            <ArrowLeft className="h-4 w-4" />
            Contact Us
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-charcoal-400">
            Or explore our popular pages:
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/services"
              className="rounded-full border border-ivory-300 bg-white px-5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-gold-500 hover:text-gold-600"
            >
              Services
            </Link>
            <Link
              to="/packages"
              className="rounded-full border border-ivory-300 bg-white px-5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-gold-500 hover:text-gold-600"
            >
              Packages
            </Link>
            <Link
              to="/gallery"
              className="rounded-full border border-ivory-300 bg-white px-5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-gold-500 hover:text-gold-600"
            >
              Gallery
            </Link>
            <Link
              to="/book"
              className="rounded-full border border-ivory-300 bg-white px-5 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:border-gold-500 hover:text-gold-600"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===========================================================================
// ServerErrorPage (500)
// ===========================================================================

export function ServerErrorPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory-100">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-100" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="container-luxury relative z-10 px-4 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 shadow-luxury">
          <AlertTriangle className="h-10 w-10 text-rose-600" />
        </div>

        <h1 className="font-serif text-display-lg font-medium text-charcoal-900">
          Something Went Wrong
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal-500">
          We're experiencing a technical issue on our end. Our team has been
          notified and we're working to fix it. Please try again in a moment.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link to="/contact" className="btn-outline">
            <Heart className="h-4 w-4" />
            Contact Support
          </Link>
        </div>

        <div className="mt-12 rounded-xl border border-ivory-200 bg-white p-6 shadow-luxury">
          <p className="text-sm text-charcoal-500">
            If the problem persists, please reach out to us:
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:gap-6">
            <a
              href="mailto:hello@eventdecorators.lr"
              className="font-semibold text-gold-600 hover:text-gold-700"
            >
              hello@eventdecorators.lr
            </a>
            <a
              href="tel:+231771234567"
              className="font-semibold text-gold-600 hover:text-gold-700"
            >
              +231 77 123 4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { NotFoundPage as default };
