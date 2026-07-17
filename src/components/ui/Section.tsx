import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

// ---------------------------------------------------------------------------
// SectionHeading
// ---------------------------------------------------------------------------

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3',
            align === 'center' && 'justify-center'
          )}
        >
          <span className="h-px w-8 bg-gold-500" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gold-500" />
        </div>
      )}
      <h2 className="font-serif text-display-md font-medium text-charcoal-900">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-charcoal-500">
          {description}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <div
      className={cn('animate-fade-in-up opacity-0', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'h-10 w-10 animate-spin rounded-full border-2 border-ivory-300 border-t-gold-500',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

// ---------------------------------------------------------------------------
// SkeletonCard
// ---------------------------------------------------------------------------

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn('skeleton h-64 w-full', className)} aria-hidden="true" />
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ivory-200 text-gold-500">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-2xl font-medium text-charcoal-800">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-md text-charcoal-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ErrorState
// ---------------------------------------------------------------------------

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.007M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 0 0-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3Z"
          />
        </svg>
      </div>
      <h3 className="font-serif text-2xl font-medium text-charcoal-800">
        Something went wrong
      </h3>
      <p className="mt-2 max-w-md text-charcoal-500">
        {message ?? 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary mt-6"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
