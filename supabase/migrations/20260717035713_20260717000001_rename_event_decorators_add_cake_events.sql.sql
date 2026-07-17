/*
# Rename to Event Decorators & Re-add Cake Service + Multi-Event Support

1. Rename company from "Even Decorators" to "Event Decorators" across all settings/content
2. Re-add the "Cakes & Pastries" service (for all ceremonies, not just weddings)
3. Re-add gallery categories/albums/media for birthdays, graduations, corporate events, cakes
4. Re-add testimonials for non-wedding events
5. Re-add/update FAQs to mention all event types and cakes
6. Update hero/about content to reflect all ceremonies
7. Rename existing "Wedding Cakes" references to "Cakes & Pastries"
*/

-- ============================================================
-- 1. RENAME COMPANY IN SITE SETTINGS
-- ============================================================
UPDATE site_settings SET value = jsonb_build_object(
  'phone', '+231 77 123 4567',
  'email', 'hello@eventdecorators.lr',
  'address', '15 Broad Street, Monrovia, Montserrado County, Liberia',
  'hours', 'Monday – Saturday: 9:00 AM – 6:00 PM'
) WHERE key = 'contact_info';

UPDATE site_settings SET value = jsonb_build_object(
  'instagram', 'https://instagram.com/eventdecorators',
  'facebook', 'https://facebook.com/eventdecorators',
  'twitter', 'https://twitter.com/eventdecorators',
  'whatsapp', 'https://wa.me/231771234567'
) WHERE key = 'social_links';

UPDATE site_settings SET value = jsonb_build_object(
  'title', 'Creating Moments, Crafting Memories',
  'subtitle', 'Luxury event decoration, catering, cakes, tailoring, and full event planning for weddings, parties, graduations, and all ceremonies — all from one dedicated team in Monrovia, Liberia.',
  'image_url', 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  'video_url', '',
  'cta_primary', 'Book Your Event',
  'cta_secondary', 'Request Quotation'
) WHERE key = 'hero_content';

UPDATE site_settings SET value = jsonb_build_object(
  'text', 'Now booking for the 2025 event season — reserve your date early.',
  'is_active', true
) WHERE key = 'announcement';

UPDATE site_settings SET value = jsonb_build_object(
  'title', 'A Family-Owned Event Atelier',
  'story', 'Event Decorators began as a small family business in Monrovia with a big vision: to bring luxury, heart, and precision to every celebration we touch. For over 15 years, we have been honored to help hundreds of clients across Liberia celebrate their most precious moments — from weddings and traditional ceremonies to birthdays, graduations, corporate galas, and church events.',
  'mission', 'To create extraordinary experiences that honor each client''s unique story, cultural heritage, and personal vision — with meticulous attention to detail and genuine care for every guest.',
  'values', jsonb_build_array(
    jsonb_build_object('title', 'Craftsmanship', 'description', 'Every floral arrangement, every draped fold, every table setting is crafted with intention and skill.'),
    jsonb_build_object('title', 'Heritage', 'description', 'We honor the traditions and cultural protocols that make each Liberian celebration uniquely meaningful.'),
    jsonb_build_object('title', 'Care', 'description', 'We treat every client and every celebration as if it were our own family''s.'),
    jsonb_build_object('title', 'Excellence', 'description', 'We hold ourselves to the highest standard, because your day deserves nothing less.')
  )
) WHERE key = 'about_content';

-- ============================================================
-- 2. RENAME STAFF EMAILS
-- ============================================================
UPDATE staff SET email = 'evelyn@eventdecorators.lr' WHERE email = 'evelyn@evendecorators.lr';
UPDATE staff SET email = 'daniel@eventdecorators.lr' WHERE email = 'daniel@evendecorators.lr';
UPDATE staff SET email = 'amara@eventdecorators.lr' WHERE email = 'amara@evendecorators.lr';

-- ============================================================
-- 3. ADD CAKES & PASTRIES SERVICE (for all ceremonies)
-- ============================================================
INSERT INTO services (slug, name, short_description, description, icon, image_url, features, display_order, is_featured) VALUES
(
  'cakes-pastries',
  'Cakes & Pastries',
  'Stunning custom cakes and pastries crafted for every celebration.',
  'Our cake service creates stunning custom cakes and pastries for weddings, birthdays, graduations, corporate events, and all ceremonies. From elegant multi-tier wedding cakes to themed birthday cakes, graduation cakes, dessert tables, cupcakes, and pastries, our pastry chef crafts each creation with premium ingredients and artistic precision. We design cakes that taste as beautiful as they look — and we accommodate dietary preferences including sugar-free options.',
  'cake',
  'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg',
  ARRAY['Custom wedding cakes','Multi-tier designs','Themed birthday cakes','Graduation cakes','Dessert tables','Cupcakes & pastries','Sugar-free options'],
  9, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- Remove any stale wedding-cakes slug if present
DELETE FROM services WHERE slug = 'wedding-cakes' AND slug <> 'cakes-pastries';

-- ============================================================
-- 4. BROADEN EXISTING SERVICE DESCRIPTIONS (not wedding-only)
-- ============================================================
UPDATE services SET
  description = 'From intimate gatherings to grand celebrations, our decoration service crafts bespoke environments that reflect your story. We handle every visual detail — floral arrangements, draping, lighting, tablescapes, and stage design — so your venue feels unmistakably yours. Whether a wedding, birthday, graduation, or corporate gala, our designers work closely with you to translate your vision into a cohesive aesthetic that leaves guests in awe.',
  short_description = 'Bespoke decor that transforms venues into breathtaking spaces.'
WHERE slug = 'wedding-decoration';

UPDATE services SET
  description = 'We specialize in traditional wedding ceremonies across Liberia''s many ethnic groups — from Kpelle, Bassa, Gio, and Kru traditions to cross-cultural celebrations. Our team understands the symbolism, protocol, and pageantry of each custom, ensuring your traditional wedding honors family heritage while running flawlessly. We coordinate attire, decor, procession, and cultural protocols with precision.',
  short_description = 'Honoring heritage with authentic ceremonial decor and coordination.'
WHERE slug = 'traditional-weddings';

UPDATE services SET
  description = 'Our catering service delivers exceptional dining experiences for weddings and events of any scale. From traditional Liberian dishes like jollof rice, cassava leaf, and palm butter to continental cuisine, our culinary team prepares dishes with premium ingredients and impeccable presentation. We accommodate dietary requirements and large guest counts without compromising on quality.',
  short_description = 'Exquisite cuisine crafted to delight every guest at your table.'
WHERE slug = 'catering-services';

UPDATE services SET
  description = 'Our tailoring service creates custom-fitted attire for your entire wedding or event party. From bridal gowns and suits to bridesmaids, groomsmen, and family outfits — including traditional Liberian lappa and country cloth designs — we craft garments that fit perfectly and photograph beautifully. We work with premium fabrics and offer both traditional and contemporary designs.',
  short_description = 'Custom-fitted attire for your entire wedding or event party.'
WHERE slug = 'tailoring';

UPDATE services SET
  description = 'Our event planning service manages every logistical detail of your celebration from concept to completion. We coordinate vendors, timelines, guest flow, and day-of execution so you can be fully present for your moments. Our planners handle budgets, contracts, contingencies, and the countless details that make the difference between a good event and an extraordinary one.',
  short_description = 'End-to-end coordination so your celebration unfolds effortlessly.'
WHERE slug = 'event-planning';

UPDATE services SET
  description = 'Our consultation service pairs you with experienced planners who help you shape your vision into a clear, achievable plan. Whether you need guidance on theme, budget, vendor selection, or cultural protocols, we provide honest, expert advice. Consultations are available in-person at our Monrovia office and virtually.',
  short_description = 'Expert guidance to shape your vision into a clear, achievable plan.'
WHERE slug = 'wedding-consultation';

-- ============================================================
-- 5. ADD GALLERY CATEGORIES FOR NEW EVENT TYPES
-- ============================================================
INSERT INTO gallery_categories (slug, name, description, display_order) VALUES
('birthdays', 'Birthday Parties', 'Birthday celebrations for all ages.', 6),
('graduations', 'Graduations', 'Graduation parties and celebrations.', 7),
('corporate-events', 'Corporate Events', 'Corporate gatherings, conferences, and galas.', 8),
('cakes', 'Cakes & Pastries', 'Custom cakes and dessert creations.', 9)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ============================================================
-- 6. ADD GALLERY ALBUMS FOR NEW EVENT TYPES
-- ============================================================
INSERT INTO gallery_albums (category_id, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
SELECT gc.id, v.title, v.slug, v.description, v.cover_image_url, v.event_date::date, v.venue, v.is_featured::boolean, v.display_order::int
FROM gallery_categories gc
JOIN (VALUES
  ('birthdays', 'Princess First Birthday', 'princess-first-birthday', 'A magical first birthday celebration with princess-themed decor and a stunning cake.', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', '2024-11-30', 'Monrovia, Montserrado County', 'true', '7'),
  ('graduations', 'Class of 2024 Graduation Gala', 'class-of-2024-graduation', 'An elegant graduation celebration honoring the achievements of Liberian students.', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', '2024-12-15', 'Monrovia, Montserrado County', 'true', '8'),
  ('corporate-events', 'Annual Corporate Gala', 'annual-corporate-gala', 'A sophisticated corporate gala with full event styling and catering.', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', '2024-10-05', 'Monrovia, Montserrado County', 'false', '9'),
  ('cakes', 'Signature Cake Collection', 'signature-cake-collection', 'A showcase of our finest custom cakes for weddings, birthdays, and celebrations.', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', '2024-09-01', 'Our Monrovia Studio', 'true', '10')
) AS v(category_slug, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
ON gc.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url;

-- ============================================================
-- 7. ADD GALLERY MEDIA FOR NEW ALBUMS
-- ============================================================
INSERT INTO gallery_media (album_id, media_type, url, thumbnail_url, title, caption, display_order)
SELECT ga.id, v.media_type::media_type, v.url, v.thumbnail_url, v.title, v.caption, v.display_order::int
FROM gallery_albums ga
JOIN (VALUES
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Princess Cake', 'Custom princess-themed birthday cake.', '1'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Party Decor', 'Birthday party decoration with balloons and streamers.', '2'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'Table Setting', 'Themed table settings for young guests.', '3'),
  ('princess-first-birthday', 'image', 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', 'Celebration', 'The birthday celebration in full swing.', '4'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Gala Setup', 'Elegant graduation gala setup.', '1'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'Award Ceremony', 'The celebration stage for award presentations.', '2'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Graduation Cake', 'Custom graduation cake with school colors.', '3'),
  ('class-of-2024-graduation', 'image', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'Reception', 'Reception decor for graduates and families.', '4'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', 'Gala Entrance', 'Sophisticated entrance decor for corporate guests.', '1'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', 'Stage Design', 'Corporate stage with branded backdrop.', '2'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', 'Dining Setup', 'Formal dining arrangement for gala guests.', '3'),
  ('annual-corporate-gala', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Gala Cake', 'Corporate-branded celebration cake.', '4'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Wedding Cake', 'Elegant multi-tier wedding cake with floral details.', '1'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Birthday Cake', 'Themed birthday cake with custom topper.', '2'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Dessert Table', 'Full dessert table with cupcakes and pastries.', '3'),
  ('signature-cake-collection', 'image', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', 'Graduation Cake', 'Custom graduation cake with school colors.', '4')
) AS v(album_slug, media_type, url, thumbnail_url, title, caption, display_order)
ON ga.slug = v.album_slug
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. ADD TESTIMONIALS FOR NON-WEDDING EVENTS
-- ============================================================
INSERT INTO testimonials (author_name, author_role, author_photo_url, content, rating, event_date, event_type, is_featured, display_order) VALUES
(
  'Mrs. Sarah Dennis',
  'Birthday Party',
  'https://images.pexels.com/photos/18656817/pexels-photo-18656817.jpeg',
  'Event Decorators made my daughter''s first birthday unforgettable. The princess-themed decor was magical, and the cake was absolutely stunning. They handled everything from setup to cleanup. We will definitely use them again for every family celebration.',
  5, '2024-11-30', 'Birthday Party', true, 7
),
(
  'Mr. Augustine Pewu',
  'Graduation Gala',
  'https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg',
  'We hired Event Decorators for our university graduation gala and they exceeded all expectations. The stage design, the catering, the cake — everything was first class. They made our graduates feel celebrated and honored.',
  5, '2024-12-15', 'Graduation', true, 8
),
(
  'Ms. Josephine Karnga',
  'Corporate Event',
  'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg',
  'Our annual corporate gala was handled flawlessly by Event Decorators. From the branded stage backdrop to the formal dining setup, every detail was professional and elegant. Our guests were thoroughly impressed. Highly recommended for corporate events.',
  5, '2024-10-05', 'Corporate Event', true, 9
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. UPDATE FAQS — Mention all event types and cakes
-- ============================================================
UPDATE faqs SET question = 'How do I book Event Decorators for my event?' WHERE question = 'How do I book Even Decorators for my wedding?';

UPDATE faqs SET answer = 'You can submit a booking request through our website by filling out the booking form on the Booking Request page. We handle all types of events — weddings, birthday parties, graduations, corporate events, anniversaries, church events, and more. Alternatively, you can request a quotation first, and our team will contact you to discuss your needs.' WHERE question = 'How do I book Event Decorators for my event?';

UPDATE faqs SET question = 'Do you only do weddings, or other events too?' WHERE question = 'Do you handle both traditional and white weddings?';

UPDATE faqs SET answer = 'We do it all! While weddings are our specialty, we also handle birthday parties, graduation celebrations, corporate events, anniversies, baby showers, church events, funeral receptions, and any occasion worth celebrating. Our services — decoration, catering, cakes, tailoring, rentals, and planning — are available for any event type.' WHERE question = 'Do you only do weddings, or other events too?';

UPDATE faqs SET answer = 'Yes. We offer full catering services as part of our packages or as a standalone service. Our culinary team prepares traditional Liberian dishes — jollof rice, cassava leaf, palm butter, potato greens, pepper soup — as well as continental cuisine. We can accommodate dietary requirements, cultural preferences, and large guest counts.' WHERE question = 'Do you offer catering services?';

UPDATE faqs SET answer = 'Yes. Our tailoring service creates custom-fitted attire for the bride, groom, and entire wedding or event party. We work with premium fabrics including traditional Liberian lappa and country cloth, and offer both traditional and contemporary designs. We recommend booking tailoring well in advance to allow for multiple fittings.' WHERE question = 'Do you provide tailoring services for the wedding party?';

-- Add new FAQ about cakes
INSERT INTO faqs (question, answer, category, display_order) VALUES
(
  'Do you make custom cakes?',
  'Yes! Our pastry chef creates stunning custom cakes for any occasion — multi-tier wedding cakes, themed birthday cakes, graduation cakes, dessert tables, cupcakes, and pastries. We also offer sugar-free options. Each cake is designed to match your event theme and can be ordered as part of a package or separately.',
  'Services', 11
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. UPDATE SITE STATS
-- ============================================================
UPDATE site_stats SET value = '750+', label = 'Events Managed' WHERE label = 'Events Managed';
UPDATE site_stats SET value = '500+', label = 'Weddings Planned' WHERE label = 'Weddings Planned';
