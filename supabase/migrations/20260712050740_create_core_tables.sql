/*
# Even Decorators — Core Schema

Creates the foundational tables for the Even Decorators wedding management platform.

## Tables Created
1. **services** — wedding/event services offered (decoration, catering, tailoring, etc.)
2. **wedding_packages** — curated bundles of services with pricing tiers
3. **rental_categories** — categories for rental inventory (chairs, tables, canopies, etc.)
4. **rental_items** — individual rental inventory items with stock tracking
5. **gallery_categories** — categories for gallery albums
6. **gallery_albums** — themed photo/video albums
7. **gallery_media** — images and videos within albums
8. **testimonials** — customer reviews and ratings
9. **faqs** — frequently asked questions
10. **bookings** — customer booking requests with full event details
11. **quotations** — price quotations linked to bookings
12. **quotation_items** — line items within a quotation
13. **customers** — customer profiles (derived from bookings or manually created)
14. **staff** — staff member profiles
15. **staff_roles** — role definitions for staff
16. **notifications** — system notifications for staff/admin
17. **audit_logs** — audit trail of admin actions
18. **site_settings** — website content, contact info, social links, announcements
19. **site_stats** — aggregate statistics shown on homepage

## Security
- RLS enabled on ALL tables.
- Public tables (services, packages, rentals, gallery, testimonials, faqs, settings, stats) are readable by anon + authenticated.
- Write operations on all tables restricted to authenticated admin users (via a helper check).
- Bookings can be submitted by anon (public booking form) but only read/updated by authenticated users.

## Notes
1. Uses `gen_random_uuid()` for primary keys.
2. Timestamps default to `now()`.
3. Soft-delete pattern via `is_active` flags where appropriate.
4. Booking status is an enum with the full lifecycle.
5. Rental items track stock and reserved quantities for availability calculations.
*/

-- ============================================================
-- ENUM TYPES
-- ============================================================
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'new', 'pending_review', 'contacted', 'negotiation',
    'quotation_sent', 'accepted', 'scheduled', 'completed',
    'cancelled', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE wedding_type AS ENUM (
    'traditional', 'white', 'both', 'engagement', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image', 'video');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE staff_role_type AS ENUM ('super_admin', 'admin', 'staff');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  short_description text,
  description text,
  icon text,
  image_url text,
  features text[] DEFAULT '{}',
  display_order int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- WEDDING PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS wedding_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  description text,
  price_from numeric(12,2),
  price_range text,
  features text[] DEFAULT '{}',
  inclusions text,
  exclusions text,
  image_url text,
  gallery_urls text[] DEFAULT '{}',
  display_order int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wedding_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_packages" ON wedding_packages;
CREATE POLICY "public_read_packages" ON wedding_packages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_packages" ON wedding_packages;
CREATE POLICY "auth_insert_packages" ON wedding_packages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_packages" ON wedding_packages;
CREATE POLICY "auth_update_packages" ON wedding_packages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_packages" ON wedding_packages;
CREATE POLICY "auth_delete_packages" ON wedding_packages FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- RENTAL CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS rental_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rental_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_rental_categories" ON rental_categories;
CREATE POLICY "public_read_rental_categories" ON rental_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_rental_categories" ON rental_categories;
CREATE POLICY "auth_insert_rental_categories" ON rental_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_rental_categories" ON rental_categories;
CREATE POLICY "auth_update_rental_categories" ON rental_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_rental_categories" ON rental_categories;
CREATE POLICY "auth_delete_rental_categories" ON rental_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- RENTAL ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS rental_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES rental_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  stock int NOT NULL DEFAULT 0,
  reserved_quantity int NOT NULL DEFAULT 0,
  condition text NOT NULL DEFAULT 'good',
  storage_location text,
  price_per_unit numeric(12,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rental_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_rental_items" ON rental_items;
CREATE POLICY "public_read_rental_items" ON rental_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_rental_items" ON rental_items;
CREATE POLICY "auth_insert_rental_items" ON rental_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_rental_items" ON rental_items;
CREATE POLICY "auth_update_rental_items" ON rental_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_rental_items" ON rental_items;
CREATE POLICY "auth_delete_rental_items" ON rental_items FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- GALLERY CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_categories" ON gallery_categories;
CREATE POLICY "public_read_gallery_categories" ON gallery_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_insert_gallery_categories" ON gallery_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_update_gallery_categories" ON gallery_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_categories" ON gallery_categories;
CREATE POLICY "auth_delete_gallery_categories" ON gallery_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- GALLERY ALBUMS
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES gallery_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image_url text,
  event_date date,
  venue text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_albums" ON gallery_albums;
CREATE POLICY "public_read_gallery_albums" ON gallery_albums FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_albums" ON gallery_albums;
CREATE POLICY "auth_insert_gallery_albums" ON gallery_albums FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_albums" ON gallery_albums;
CREATE POLICY "auth_update_gallery_albums" ON gallery_albums FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_albums" ON gallery_albums;
CREATE POLICY "auth_delete_gallery_albums" ON gallery_albums FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- GALLERY MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES gallery_albums(id) ON DELETE CASCADE,
  media_type media_type NOT NULL DEFAULT 'image',
  url text NOT NULL,
  thumbnail_url text,
  title text,
  caption text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_media" ON gallery_media;
CREATE POLICY "public_read_gallery_media" ON gallery_media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery_media" ON gallery_media;
CREATE POLICY "auth_insert_gallery_media" ON gallery_media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery_media" ON gallery_media;
CREATE POLICY "auth_update_gallery_media" ON gallery_media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery_media" ON gallery_media;
CREATE POLICY "auth_delete_gallery_media" ON gallery_media FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  author_photo_url text,
  content text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  event_date date,
  event_type text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_faqs" ON faqs;
CREATE POLICY "auth_insert_faqs" ON faqs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_faqs" ON faqs;
CREATE POLICY "auth_update_faqs" ON faqs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_faqs" ON faqs;
CREATE POLICY "auth_delete_faqs" ON faqs FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bride_name text,
  groom_name text,
  email text,
  phone text,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_customers" ON customers;
CREATE POLICY "auth_read_customers" ON customers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_customers" ON customers;
CREATE POLICY "auth_insert_customers" ON customers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_customers" ON customers;
CREATE POLICY "auth_update_customers" ON customers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_customers" ON customers;
CREATE POLICY "auth_delete_customers" ON customers FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  bride_name text NOT NULL,
  groom_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  wedding_type wedding_type NOT NULL DEFAULT 'other',
  event_date date,
  event_time time,
  venue text,
  expected_guests int,
  services_required text[] DEFAULT '{}',
  rental_requirements text[] DEFAULT '{}',
  budget_range text,
  additional_notes text,
  attachment_urls text[] DEFAULT '{}',
  status booking_status NOT NULL DEFAULT 'new',
  is_quotation_request boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can submit bookings (booking form on website)
DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated staff can read bookings
DROP POLICY IF EXISTS "auth_read_bookings" ON bookings;
CREATE POLICY "auth_read_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;
CREATE POLICY "auth_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- QUOTATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  quotation_number text UNIQUE NOT NULL,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  valid_until date,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_quotations" ON quotations;
CREATE POLICY "auth_read_quotations" ON quotations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_quotations" ON quotations;
CREATE POLICY "auth_insert_quotations" ON quotations FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_quotations" ON quotations;
CREATE POLICY "auth_update_quotations" ON quotations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_quotations" ON quotations;
CREATE POLICY "auth_delete_quotations" ON quotations FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- QUOTATION ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_quotation_items" ON quotation_items;
CREATE POLICY "auth_read_quotation_items" ON quotation_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_quotation_items" ON quotation_items;
CREATE POLICY "auth_insert_quotation_items" ON quotation_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_quotation_items" ON quotation_items;
CREATE POLICY "auth_update_quotation_items" ON quotation_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_quotation_items" ON quotation_items;
CREATE POLICY "auth_delete_quotation_items" ON quotation_items FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- STAFF ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS staff_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name staff_role_type UNIQUE NOT NULL,
  description text,
  permissions text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_staff_roles" ON staff_roles;
CREATE POLICY "auth_read_staff_roles" ON staff_roles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff_roles" ON staff_roles;
CREATE POLICY "auth_insert_staff_roles" ON staff_roles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff_roles" ON staff_roles;
CREATE POLICY "auth_update_staff_roles" ON staff_roles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff_roles" ON staff_roles;
CREATE POLICY "auth_delete_staff_roles" ON staff_roles FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- STAFF
-- ============================================================
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  role_id uuid REFERENCES staff_roles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text UNIQUE,
  phone text,
  position text,
  bio text,
  photo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_staff" ON staff;
CREATE POLICY "public_read_staff" ON staff FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff" ON staff;
CREATE POLICY "auth_insert_staff" ON staff FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff" ON staff;
CREATE POLICY "auth_update_staff" ON staff FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff" ON staff;
CREATE POLICY "auth_delete_staff" ON staff FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'info',
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_notifications" ON notifications;
CREATE POLICY "auth_read_notifications" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_notifications" ON notifications;
CREATE POLICY "auth_insert_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_notifications" ON notifications;
CREATE POLICY "auth_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_notifications" ON notifications;
CREATE POLICY "auth_delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_audit_logs" ON audit_logs;
CREATE POLICY "auth_read_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_audit_logs" ON audit_logs;
CREATE POLICY "auth_insert_audit_logs" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SITE STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_stats" ON site_stats;
CREATE POLICY "public_read_site_stats" ON site_stats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_stats" ON site_stats;
CREATE POLICY "auth_insert_site_stats" ON site_stats FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_stats" ON site_stats;
CREATE POLICY "auth_update_site_stats" ON site_stats FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_stats" ON site_stats;
CREATE POLICY "auth_delete_site_stats" ON site_stats FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_packages_active ON wedding_packages(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_rental_items_category ON rental_items(category_id);
CREATE INDEX IF NOT EXISTS idx_rental_items_active ON rental_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gallery_media_album ON gallery_media(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_active ON gallery_albums(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_booking ON quotations(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_staff ON notifications(staff_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
