// ============================================================================
// Event Decorators — Application Constants
// ============================================================================

/**
 * Services offered by Event Decorators.
 */
export const SERVICES = [
  { id: 'wedding-planning', label: 'Wedding Planning' },
  { id: 'event-decor', label: 'Event Decoration' },
  { id: 'catering', label: 'Catering Services' },
  { id: 'cakes-pastries', label: 'Cakes & Pastries' },
  { id: 'tailoring', label: 'Tailoring' },
  { id: 'venue-sourcing', label: 'Venue Sourcing' },
  { id: 'photography', label: 'Photography & Videography' },
  { id: 'floral-design', label: 'Floral Design' },
  { id: 'rentals', label: 'Equipment Rentals' },
  { id: 'coordination', label: 'Day-of Coordination' },
] as const;

/**
 * Booking status labels.
 */
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  pending_review: 'Pending Review',
  contacted: 'Contacted',
  negotiation: 'Negotiation',
  quotation_sent: 'Quotation Sent',
  accepted: 'Accepted',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
};

/**
 * Tailwind color classes for each booking status.
 */
export const BOOKING_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  pending_review: 'bg-amber-100 text-amber-800 border-amber-200',
  contacted: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  negotiation: 'bg-purple-100 text-purple-800 border-purple-200',
  quotation_sent: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  scheduled: 'bg-teal-100 text-teal-800 border-teal-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

/**
 * Event type labels.
 */
export const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  birthday: 'Birthday Party',
  graduation: 'Graduation',
  corporate: 'Corporate Event',
  anniversary: 'Anniversary',
  engagement: 'Engagement Ceremony',
  baby_shower: 'Baby Shower',
  funeral_reception: 'Funeral Reception',
  church_event: 'Church Event',
  other: 'Other',
};

/**
 * Wedding type labels (used when event_type is 'wedding').
 */
export const WEDDING_TYPE_LABELS: Record<string, string> = {
  traditional: 'Traditional Wedding',
  white: 'White Wedding',
  both: 'Traditional & White Wedding',
  engagement: 'Engagement Ceremony',
  other: 'Other',
};

/**
 * Budget ranges in Liberian Dollars (LRD).
 */
export const BUDGET_RANGES = [
  { id: 'under-50000', label: 'Under 50,000 LRD', min: 0, max: 50000 },
  { id: '50000-150000', label: '50,000 - 150,000 LRD', min: 50000, max: 150000 },
  { id: '150000-350000', label: '150,000 - 350,000 LRD', min: 150000, max: 350000 },
  { id: '350000-750000', label: '350,000 - 750,000 LRD', min: 350000, max: 750000 },
  { id: '750000-1500000', label: '750,000 - 1,500,000 LRD', min: 750000, max: 1500000 },
  { id: 'above-1500000', label: '1,500,000 LRD and above', min: 1500000, max: Infinity },
] as const;

/**
 * Company information.
 */
export const COMPANY = {
  name: 'Event Decorators',
  tagline: 'Creating Moments, Crafting Memories.',
  description:
    'Event Decorators is a luxury event management company based in Liberia, dedicated to creating unforgettable experiences. We specialize in elegant weddings, parties, graduations, corporate galas, and all ceremonies across Liberia, blending timeless sophistication with authentic Liberian charm.',
} as const;

/**
 * Pexels stock images featuring African wedding and celebration themes.
 */
export const PEXEL_IMAGES = {
  hero: 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  traditional: 'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg',
  white: 'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg',
  catering: 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg',
  decor: 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg',
  celebration: 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg',
  planning: 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg',
  about: 'https://images.pexels.com/photos/18656817/pexels-photo-18656817.jpeg',
  contact: 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg',
} as const;
