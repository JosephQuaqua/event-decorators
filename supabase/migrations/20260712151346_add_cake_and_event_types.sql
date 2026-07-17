/*
# Even Decorators — Add Cake Service & Broaden Event Types

Updates the platform to support all event types (not just weddings) and adds a wedding cake service.

## Changes
1. **bookings table**: Add `event_type` column to support birthdays, graduations, corporate events, etc.
   - Make `bride_name` and `groom_name` nullable (not all events have couples)
   - Add `client_name` column for non-wedding events
2. **services table**: Add "Wedding Cakes & Pastries" service
3. **gallery_categories**: Add new categories for birthdays, graduations, corporate events
4. **gallery_albums**: Add sample albums for new event types
5. **gallery_media**: Add sample media for new albums
6. **testimonials**: Add testimonials for non-wedding events
7. **faqs**: Update to mention all event types
8. **site_stats**: Update stats to reflect all events

## Notes
- All changes are additive — no data is lost
- bride_name/groom_name made nullable to support non-wedding events
- event_type defaults to 'wedding' for backward compatibility
*/

-- ============================================================
-- ADD EVENT_TYPE TO BOOKINGS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE event_type AS ENUM (
    'wedding', 'birthday', 'graduation', 'corporate', 'anniversary',
    'engagement', 'baby_shower', 'funeral_reception', 'church_event', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS event_type event_type NOT NULL DEFAULT 'wedding';
ALTER TABLE bookings ALTER COLUMN bride_name DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN groom_name DROP NOT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_name text;

-- ============================================================
-- ADD WEDDING CAKES SERVICE
-- ============================================================
INSERT INTO services (slug, name, short_description, description, icon, image_url, features, display_order, is_featured) VALUES
(
  'wedding-cakes',
  'Wedding Cakes & Pastries',
  'Stunning custom cakes and pastries crafted for your celebration.',
  'Our cake service creates stunning custom cakes and pastries for weddings, birthdays, graduations, and all celebrations. From elegant multi-tier wedding cakes to themed birthday cakes and dessert tables, our pastry chef crafts each creation with premium ingredients and artistic precision. We design cakes that taste as beautiful as they look — and we accommodate dietary preferences including sugar-free options.',
  'cake',
  'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg',
  ARRAY['Custom wedding cakes','Multi-tier designs','Themed birthday cakes','Dessert tables','Cupcakes & pastries','Sugar-free options'],
  9, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- ============================================================
-- ADD GALLERY CATEGORIES FOR NEW EVENT TYPES
-- ============================================================
INSERT INTO gallery_categories (slug, name, description, display_order) VALUES
('birthdays', 'Birthday Parties', 'Birthday celebrations for all ages.', 6),
('graduations', 'Graduations', 'Graduation parties and celebrations.', 7),
('corporate-events', 'Corporate Events', 'Corporate gatherings, conferences, and galas.', 8),
('cakes', 'Cakes & Pastries', 'Custom cakes and dessert creations.', 9)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ============================================================
-- ADD GALLERY ALBUMS FOR NEW EVENT TYPES
-- ============================================================
INSERT INTO gallery_albums (category_id, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
SELECT gc.id, v.title, v.slug, v.description, v.cover_image_url, v.event_date::date, v.venue, v.is_featured::boolean, v.display_order::int
FROM gallery_categories gc
JOIN (VALUES
  ('birthdays', 'Princess First Birthday', 'princess-first-birthday', 'A magical first birthday celebration with princess-themed decor and a stunning cake.', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', '2024-11-30', 'Monrovia, Montserrado County', 'true', '7'),
  ('graduations', 'Class of 2024 Graduation Gala', 'class-of-2024-graduation', 'A elegant graduation celebration honoring the achievements of Liberian students.', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', '2024-12-15', 'Monrovia, Montserrado County', 'true', '8'),
  ('corporate-events', 'Annual Corporate Gala', 'annual-corporate-gala', 'A sophisticated corporate gala with full event styling and catering.', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', '2024-10-05', 'Monrovia, Montserrado County', 'false', '9'),
  ('cakes', 'Signature Cake Collection', 'signature-cake-collection', 'A showcase of our finest custom cakes for weddings, birthdays, and celebrations.', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', '2024-09-01', 'Our Monrovia Studio', 'true', '10')
) AS v(category_slug, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
ON gc.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url;

-- ============================================================
-- ADD GALLERY MEDIA FOR NEW ALBUMS
-- ============================================================
INSERT INTO gallery_media (album_id, media_type, url, thumbnail_url, title, caption, display_order)
SELECT ga.id, v.media_type::media_type, v.url, v.thumbnail_url, v.title, v.caption, v.display_order::int
FROM gallery_albums ga
JOIN (VALUES
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Princess Cake', 'Custom princess-themed birthday cake.', '1'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Party Decor', 'Birthday party decoration with balloons and streamers.', '2'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'Table Setting', 'Themed table settings for young guests.', '3'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', 'Celebration', 'The birthday celebration in full swing.', '4'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Gala Setup', 'Elegant graduation gala setup.', '1'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Award Ceremony', 'The celebration stage for award presentations.', '2'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Graduation Cake', 'Custom graduation cake with school colors.', '3'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'Reception', 'Reception decor for graduates and families.', '4'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'Gala Entrance', 'Sophisticated entrance decor for corporate guests.', '1'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'Stage Design', 'Corporate stage with branded backdrop.', '2'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Dining Setup', 'Formal dining arrangement for gala guests.', '3'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Gala Cake', 'Corporate-branded celebration cake.', '4'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Wedding Cake', 'Elegant multi-tier wedding cake with floral details.', '1'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Birthday Cake', 'Themed birthday cake with custom topper.', '2'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Dessert Table', 'Full dessert table with cupcakes and pastries.', '3'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Graduation Cake', 'Custom graduation cake with school colors.', '4')
) AS v(album_slug, media_type, url, thumbnail_url, title, caption, display_order)
ON ga.slug = v.album_slug
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD TESTIMONIALS FOR NON-WEDDING EVENTS
-- ============================================================
INSERT INTO testimonials (author_name, author_role, author_photo_url, content, rating, event_date, event_type, is_featured, display_order) VALUES
(
  'Mrs. Sarah Dennis',
  'Birthday Party',
  'https://images.pexels.com/photos/18656817/pexels-photo-18656817.jpeg',
  'Even Decorators made my daughter''s first birthday unforgettable. The princess-themed decor was magical, and the cake was absolutely stunning. They handled everything from setup to cleanup. We will definitely use them again for every family celebration.',
  5, '2024-11-30', 'Birthday Party', true, 7
),
(
  'Mr. Augustine Pewu',
  'Graduation Gala',
  'https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg',
  'We hired Even Decorators for our university graduation gala and they exceeded all expectations. The stage design, the catering, the cake — everything was first class. They made our graduates feel celebrated and honored.',
  5, '2024-12-15', 'Graduation', true, 8
),
(
  'Ms. Josephine Karnga',
  'Corporate Event',
  'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg',
  'Our annual corporate gala was handled flawlessly by Even Decorators. From the branded stage backdrop to the formal dining setup, every detail was professional and elegant. Our guests were thoroughly impressed. Highly recommended for corporate events.',
  5, '2024-10-05', 'Corporate Event', true, 9
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATE FAQS — Mention all event types
-- ============================================================
UPDATE faqs SET answer = 'You can submit a booking request through our website by filling out the booking form on the Booking Request page. We handle all types of events — weddings, birthday parties, graduations, corporate events, anniversaries, church events, and more. Alternatively, you can request a quotation first, and our team will contact you to discuss your needs.' WHERE question = 'How do I book Even Decorators for my wedding?';

UPDATE faqs SET question = 'Do you only do weddings, or other events too?' WHERE question = 'Do you handle both traditional and white weddings?';

UPDATE faqs SET answer = 'We do it all! While weddings are our specialty, we also handle birthday parties, graduation celebrations, corporate events, anniversaries, baby showers, church events, funeral receptions, and any occasion worth celebrating. Our services — decoration, catering, cakes, tailoring, rentals, and planning — are available for any event type.' WHERE question = 'Do you only do weddings, or other events too?';

-- Add new FAQ about cakes
INSERT INTO faqs (question, answer, category, display_order) VALUES
(
  'Do you make custom cakes?',
  'Yes! Our pastry chef creates stunning custom cakes for any occasion — multi-tier wedding cakes, themed birthday cakes, graduation cakes, dessert tables, cupcakes, and pastries. We also offer sugar-free options. Each cake is designed to match your event theme and can be ordered as part of a package or separately.',
  'Services', 11
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATE SITE STATS
-- ============================================================
UPDATE site_stats SET value = '750+', label = 'Events Managed' WHERE label = 'Events Managed';
UPDATE site_stats SET value = '500+', label = 'Weddings Planned' WHERE label = 'Weddings Planned';
