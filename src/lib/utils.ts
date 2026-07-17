import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names conditionally.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date as "Month DD, YYYY". Returns "—" for null/undefined/invalid.
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a date as "Mon DD, YYYY". Returns "—" for null/undefined/invalid.
 */
export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a time string ("HH:MM" or Date) as "H:MM AM/PM".
 */
export function formatTime(time: string | Date | null | undefined): string {
  if (!time) return '—';
  let d: Date;
  if (typeof time === 'string') {
    // Handle "HH:MM" format strings
    if (/^\d{1,2}:\d{2}/.test(time)) {
      const [hours, minutes] = time.split(':');
      d = new Date();
      d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      d = new Date(time);
    }
  } else {
    d = time;
  }
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a number as Liberian Dollar (LRD) using the en-LR locale.
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'L$0.00';
  return new Intl.NumberFormat('en-LR', {
    style: 'currency',
    currency: 'LRD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date as a relative time string:
 * "Just now", "Xm ago", "Xh ago", "Xd ago", or formatDateShort.
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDateShort(d);
}

/**
 * Truncate text to max characters, appending "..." if truncated.
 */
export function truncate(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '...';
}

/**
 * Convert a string to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate availability based on stock and reserved counts.
 */
export function getAvailability(
  stock: number,
  reserved: number
): { available: number; status: 'in-stock' | 'low-stock' | 'out-of-stock' } {
  const available = Math.max(0, (stock ?? 0) - (reserved ?? 0));
  let status: 'in-stock' | 'low-stock' | 'out-of-stock';

  if (available <= 0) {
    status = 'out-of-stock';
  } else if (available <= Math.max(1, Math.ceil((stock ?? 0) * 0.2))) {
    status = 'low-stock';
  } else {
    status = 'in-stock';
  }

  return { available, status };
}
