// ============================================================================
// Event Decorators — TypeScript Type Definitions
// Matches the Supabase database schema.
// ============================================================================

// ---------------------------------------------------------------------------
// Union Types
// ---------------------------------------------------------------------------

export type BookingStatus =
  | 'new'
  | 'pending_review'
  | 'contacted'
  | 'negotiation'
  | 'quotation_sent'
  | 'accepted'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type WeddingType = 'traditional' | 'white' | 'both' | 'engagement' | 'other';

export type EventType =
  | 'wedding'
  | 'birthday'
  | 'graduation'
  | 'corporate'
  | 'anniversary'
  | 'engagement'
  | 'baby_shower'
  | 'funeral_reception'
  | 'church_event'
  | 'other';

export type MediaType = 'image' | 'video';

export type StaffRoleType =
  | 'admin'
  | 'manager'
  | 'planner'
  | 'decorator'
  | 'caterer'
  | 'photographer'
  | 'coordinator'
  | 'staff';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export interface Service {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  features: string[] | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Wedding Package
// ---------------------------------------------------------------------------

export interface WeddingPackage {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_from: number | null;
  price_range: string | null;
  features: string[] | null;
  inclusions: string | null;
  exclusions: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Rental Categories & Items
// ---------------------------------------------------------------------------

export interface RentalCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface RentalItem {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  stock: number;
  reserved_quantity: number;
  condition: string;
  storage_location: string | null;
  price_per_unit: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: RentalCategory | null;
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------

export interface GalleryCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryAlbum {
  id: string;
  category_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string | null;
  venue: string | null;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: GalleryCategory | null;
}

export interface GalleryMedia {
  id: string;
  album_id: string | null;
  media_type: MediaType;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  caption: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  album?: GalleryAlbum | null;
}

// ---------------------------------------------------------------------------
// Testimonials & FAQ
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  author_photo_url: string | null;
  content: string;
  rating: number;
  event_type: string | null;
  event_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------

export interface Customer {
  id: string;
  user_id: string | null;
  email: string;
  phone: string | null;
  full_name: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Booking
// ---------------------------------------------------------------------------

export interface Booking {
  id: string;
  customer_id: string | null;
  bride_name: string | null;
  groom_name: string | null;
  client_name: string | null;
  email: string;
  phone: string;
  wedding_type: WeddingType;
  event_type: EventType;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  expected_guests: number | null;
  services_required: string[] | null;
  rental_requirements: string[] | null;
  budget_range: string | null;
  additional_notes: string | null;
  attachment_urls: string[] | null;
  status: BookingStatus;
  is_quotation_request: boolean;
  created_at: string;
  updated_at: string;
  customer?: Customer | null;
}

// ---------------------------------------------------------------------------
// Quotation
// ---------------------------------------------------------------------------

export interface QuotationItem {
  id: string;
  quotation_id: string;
  service_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  unit: string | null;
  discount: number | null;
  total: number;
  notes: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  booking_id: string | null;
  customer_id: string | null;
  quotation_number: string;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  subtotal: number;
  discount: number | null;
  tax: number | null;
  total: number;
  currency: string;
  notes: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
  items?: QuotationItem[];
  booking?: Booking | null;
  customer?: Customer | null;
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export interface StaffRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  user_id: string | null;
  role_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: StaffRole | null;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Site Statistics & Settings
// ---------------------------------------------------------------------------

export interface SiteStat {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: Record<string, unknown> | null;
  updated_at: string;
}
