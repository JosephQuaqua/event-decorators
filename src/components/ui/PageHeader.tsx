import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// PageHeader
// ---------------------------------------------------------------------------

interface Breadcrumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  bgImage?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  bgImage,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'relative flex min-h-[50vh] flex-col justify-end overflow-hidden pt-20',
        className
      )}
    >
      {/* Background */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-hero-overlay" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-800 to-charcoal-900" />
      )}

      {/* Content */}
      <div className="container-luxury relative z-10 pb-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ivory-200"
          >
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={idx} className="flex items-center gap-1.5">
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="transition-colors hover:text-gold-300"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && 'text-gold-300')}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <ChevronRight className="h-4 w-4 text-ivory-300/60" />
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {eyebrow && (
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
              {eyebrow}
            </span>
          </div>
        )}

        <h1 className="max-w-4xl font-serif text-display-lg font-medium text-white text-shadow-luxury">
          {title}
        </h1>

        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory-100">
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}

export default PageHeader;
