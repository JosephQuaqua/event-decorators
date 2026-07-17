/*
# Even Decorators — Update to Liberia / African Context

Updates all seed data to reflect:
1. Liberia-based business (Monrovia locations, Liberian phone, LRD currency)
2. African wedding photography (Pexels photos featuring Black couples)
3. Authentic client testimonials from Liberian couples
4. Liberian staff names and context
5. Liberian-specific FAQs

## Changes
- services: updated image_url to African wedding photos
- wedding_packages: updated image_url and gallery_urls to African photos, prices in LRD
- rental_items: updated image_url to African decor photos, prices in LRD
- gallery_albums: updated cover_image_url to African wedding photos, Liberian venues
- gallery_media: updated all image URLs to African wedding photos
- testimonials: replaced with authentic Liberian couple testimonials, African photos
- staff: updated to Liberian names and African portraits
- site_settings: updated contact_info, hero_content for Liberia
- faqs: updated to Liberia-specific context
*/

-- ============================================================
-- UPDATE SERVICES — African images
-- ============================================================
UPDATE services SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg' WHERE slug = 'wedding-decoration';
UPDATE services SET image_url = 'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg' WHERE slug = 'traditional-weddings';
UPDATE services SET image_url = 'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg' WHERE slug = 'white-weddings';
UPDATE services SET image_url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg' WHERE slug = 'catering-services';
UPDATE services SET image_url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg' WHERE slug = 'tailoring';
UPDATE services SET image_url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg' WHERE slug = 'event-planning';
UPDATE services SET image_url = 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg' WHERE slug = 'rental-equipment';
UPDATE services SET image_url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg' WHERE slug = 'wedding-consultation';

-- Update service descriptions for Liberia context
UPDATE services SET
  description = 'From intimate gatherings to grand celebrations, our wedding decoration service crafts bespoke environments that reflect your love story. We handle every visual detail — floral arrangements, draping, lighting, tablescapes, and stage design — so your venue feels unmistakably yours. Whether in Monrovia or beyond, our designers work closely with you to translate your vision into a cohesive aesthetic that leaves guests in awe.',
  short_description = 'Bespoke decor that transforms venues into breathtaking spaces.'
WHERE slug = 'wedding-decoration';

UPDATE services SET
  description = 'We specialize in traditional wedding ceremonies across Liberia''s many ethnic groups — from Kpelle, Bassa, Gio, and Kru traditions to cross-cultural celebrations. Our team understands the symbolism, protocol, and pageantry of each custom, ensuring your traditional wedding honors family heritage while running flawlessly. We coordinate attire, decor, procession, and cultural protocols with precision.',
  short_description = 'Honoring heritage with authentic ceremonial decor and coordination.'
WHERE slug = 'traditional-weddings';

UPDATE services SET
  description = 'Our white wedding service brings timeless elegance to your church ceremony and reception. We design refined, romantic settings — from aisle decor and altar arrangements to reception styling, centerpieces, and ambient lighting. Every element is curated to create a sophisticated backdrop for your vows and an unforgettable celebration afterward.',
  short_description = 'Timeless elegance for your church and reception celebration.'
WHERE slug = 'white-weddings';

UPDATE services SET
  description = 'Our catering service delivers exceptional dining experiences for weddings and events of any scale. From traditional Liberian dishes like jollof rice, cassava leaf, and palm butter to continental cuisine, our culinary team prepares dishes with premium ingredients and impeccable presentation. We accommodate dietary requirements and large guest counts without compromising on quality.',
  short_description = 'Exquisite cuisine crafted to delight every guest at your table.'
WHERE slug = 'catering-services';

UPDATE services SET
  description = 'Our tailoring service creates custom-fitted attire for your entire wedding party. From the bride''s gown and the groom''s suit to bridesmaids, groomsmen, and family outfits — including traditional Liberian lappa and country cloth designs — we craft garments that fit perfectly and photograph beautifully. We work with premium fabrics and offer both traditional and contemporary designs.',
  short_description = 'Custom-fitted attire for the bride, groom, and entire wedding party.'
WHERE slug = 'tailoring';

UPDATE services SET
  description = 'Our event planning service manages every logistical detail of your celebration from concept to completion. We coordinate vendors, timelines, guest flow, and day-of execution so you can be fully present for your moments. Our planners handle budgets, contracts, contingencies, and the countless details that make the difference between a good event and an extraordinary one.',
  short_description = 'End-to-end coordination so your celebration unfolds effortlessly.'
WHERE slug = 'event-planning';

UPDATE services SET
  description = 'Our rental inventory includes everything needed to outfit your venue: chairs, tables, canopies, lighting, wedding arches, dance floors, stages, decor pieces, centerpieces, sound equipment, table covers, and backdrops. Every item is maintained to the highest standard and available for individual rental or as part of a complete package.',
  short_description = 'Quality event rentals — chairs, tables, canopies, lighting, and more.'
WHERE slug = 'rental-equipment';

UPDATE services SET
  description = 'Our wedding consultation service pairs you with experienced planners who help you shape your vision into a clear, achievable plan. Whether you need guidance on theme, budget, vendor selection, or cultural protocols, we provide honest, expert advice. Consultations are available in-person at our Monrovia office and virtually.',
  short_description = 'Expert guidance to shape your vision into a clear, achievable plan.'
WHERE slug = 'wedding-consultation';

-- ============================================================
-- UPDATE WEDDING PACKAGES — African images, LRD pricing
-- ============================================================
UPDATE wedding_packages SET
  price_from = 75000,
  price_range = '75,000 – 150,000 LRD',
  image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  gallery_urls = ARRAY[
    'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
    'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg'
  ]
WHERE slug = 'classic-celebration';

UPDATE wedding_packages SET
  price_from = 200000,
  price_range = '200,000 – 400,000 LRD',
  image_url = 'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg',
  gallery_urls = ARRAY[
    'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg',
    'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg'
  ]
WHERE slug = 'royal-heritage';

UPDATE wedding_packages SET
  price_from = 500000,
  price_range = '500,000 LRD and above',
  image_url = 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg',
  gallery_urls = ARRAY[
    'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg',
    'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg',
    'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg'
  ]
WHERE slug = 'imperial-experience';

-- ============================================================
-- UPDATE RENTAL ITEMS — African decor images, LRD pricing
-- ============================================================
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', price_per_unit = 300 WHERE slug = 'chiavari-chair';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', price_per_unit = 200 WHERE slug = 'banquet-chair';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg', price_per_unit = 500 WHERE slug = 'round-banquet-table-60';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', price_per_unit = 400 WHERE slug = 'cocktail-table';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', price_per_unit = 7000 WHERE slug = 'white-event-canopy-20x40';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', price_per_unit = 2500 WHERE slug = 'bridal-bouquet';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', price_per_unit = 1000 WHERE slug = 'fairy-light-string-50m';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', price_per_unit = 9000 WHERE slug = 'floral-wedding-arch';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', price_per_unit = 5000 WHERE slug = 'parquet-dance-floor-4x4';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', price_per_unit = 6000 WHERE slug = 'elevated-stage-4x3';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', price_per_unit = 700 WHERE slug = 'crystal-candelabra-centerpiece';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', price_per_unit = 5600 WHERE slug = 'professional-pa-system';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', price_per_unit = 300 WHERE slug = 'satin-tablecloth-round';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', price_per_unit = 150 WHERE slug = 'chair-cover-with-sash';
UPDATE rental_items SET image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', price_per_unit = 7600 WHERE slug = 'floral-photo-backdrop';

-- ============================================================
-- UPDATE GALLERY ALBUMS — African images, Liberian venues
-- ============================================================
UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/35139905/pexels-photo-35139905.jpeg',
  venue = 'Monrovia, Montserrado County',
  description = 'A vibrant Liberian traditional wedding with rich cultural pageantry and elegant decor.'
WHERE slug = 'adaeze-chidi-traditional';

UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg',
  venue = 'Monrovia, Montserrado County',
  description = 'A timeless white wedding ceremony and reception with romantic floral styling.'
WHERE slug = 'grace-david-white-wedding';

UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  venue = 'Various venues across Monrovia',
  description = 'A collection of our most striking venue decor and stage designs from celebrations across Liberia.'
WHERE slug = 'signature-venue-transformations';

UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg',
  venue = 'Various venues across Monrovia',
  description = 'Catering and table settings from our premium events — featuring Liberian and continental cuisine.'
WHERE slug = 'exquisite-dining-experiences';

UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg',
  venue = 'Various venues across Liberia',
  description = 'Dance, laughter, and celebration from our couples and their guests across Liberia.'
WHERE slug = 'moments-of-joy';

UPDATE gallery_albums SET
  cover_image_url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg',
  venue = 'Gbarnga, Bong County',
  description = 'A beautiful traditional Liberian wedding with cultural elegance and warmth.'
WHERE slug = 'fatima-ibrahim-northern';

-- ============================================================
-- UPDATE GALLERY MEDIA — African wedding photos
-- ============================================================
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35139905/pexels-photo-35139905.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35139905/pexels-photo-35139905.jpeg' WHERE title = 'Bridal Entrance';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg' WHERE title = 'Floral Arch';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg' WHERE title = 'Family Blessing';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg' WHERE title = 'Reception Setup';

UPDATE gallery_media SET url = 'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg', thumbnail_url = 'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg' WHERE title = 'Church Ceremony';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg' WHERE title = 'Altar Florals';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg' WHERE title = 'Reception Hall';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/4426403/pexels-photo-4426403.jpeg', thumbnail_url = 'https://images.pexels.com/photos/4426403/pexels-photo-4426403.jpeg' WHERE title = 'First Dance';

UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg' WHERE title = 'Mandap Design';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg' WHERE title = 'Stage Styling';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35146501/pexels-photo-35146501.jpeg' WHERE title = 'Tablescapes';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35532990/pexels-photo-35532990.jpeg' WHERE title = 'Outdoor Canopy';

UPDATE gallery_media SET url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', thumbnail_url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg' WHERE title = 'Plated Service';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', thumbnail_url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg' WHERE title = 'Dessert Display';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg' WHERE title = 'Cocktail Hour';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg', thumbnail_url = 'https://images.pexels.com/photos/18541972/pexels-photo-18541972.jpeg' WHERE title = 'Buffet Setup';

UPDATE gallery_media SET url = 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg', thumbnail_url = 'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg' WHERE title = 'Dance Floor';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35367892/pexels-photo-35367892.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35367892/pexels-photo-35367892.jpeg' WHERE title = 'Couple Portrait';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg' WHERE title = 'Guest Celebration';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/4426403/pexels-photo-4426403.jpeg', thumbnail_url = 'https://images.pexels.com/photos/4426403/pexels-photo-4426403.jpeg' WHERE title = 'Sparkler Exit';

UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg' WHERE title = 'Northern Elegance';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg' WHERE title = 'Floral Installation';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35532988/pexels-photo-35532988.jpeg' WHERE title = 'Reception Decor';
UPDATE gallery_media SET url = 'https://images.pexels.com/photos/35798522/pexels-photo-35798522.jpeg', thumbnail_url = 'https://images.pexels.com/photos/35798522/pexels-photo-35798522.jpeg' WHERE title = 'Family Portrait';

-- ============================================================
-- UPDATE TESTIMONIALS — Authentic Liberian client testimonials
-- ============================================================
DELETE FROM testimonials;

INSERT INTO testimonials (author_name, author_role, author_photo_url, content, rating, event_date, event_type, is_featured, display_order) VALUES
(
  'Mary & James Konah',
  'Traditional & White Wedding',
  'https://images.pexels.com/photos/35486225/pexels-photo-35486225.jpeg',
  'Even Decorators made our wedding the talk of Monrovia. From the traditional ceremony in Gbarnga to the white wedding in Monrovia, everything was perfect. The decor was so beautiful that our guests were taking pictures before the ceremony even started. Mama Evelyn and her team treated us like family.',
  5, '2024-12-07', 'Traditional & White', true, 1
),
(
  'Grace & Daniel Toe',
  'White Wedding',
  'https://images.pexels.com/photos/20485940/pexels-photo-20485940.jpeg',
  'We were stressed about planning our wedding from abroad, but Even Decorators handled everything. When we arrived in Monrovia, the church decoration took our breath away. The reception was elegant and the catering — the jollof rice and cassava leaf were perfect. Our families are still talking about it.',
  5, '2024-11-23', 'White Wedding', true, 2
),
(
  'Fatu & Mohammed Massaquoi',
  'Traditional Wedding',
  'https://images.pexels.com/photos/35486226/pexels-photo-35486226.jpeg',
  'The team respected every Vai and Kpelle tradition while making the celebration feel modern and beautiful. The decor was stunning, the catering was exceptional, and the coordination was seamless. They understood our culture and made it shine. Highly recommended for any Liberian couple.',
  5, '2024-10-15', 'Traditional Wedding', true, 3
),
(
  'Patience & Emmanuel Sumo',
  'Royal Heritage Package',
  'https://images.pexels.com/photos/11360201/pexels-photo-11360201.jpeg',
  'The Royal Heritage package was worth every dollar. From the traditional ceremony to the grand reception at the resort, everything was handled with such care and professionalism. We felt like royalty on our day. Even Decorators is the best in Liberia, hands down.',
  5, '2024-09-20', 'Traditional & White', true, 4
),
(
  'Louise & Anthony Brown',
  'Classic Celebration Package',
  'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  'Even Decorators made our intimate wedding feel luxurious without breaking the bank. The Classic Celebration package covered everything we needed and the team was so responsive. They made our day special and stress-free. Thank you to the whole team.',
  5, '2024-08-10', 'White Wedding', true, 5
),
(
  'Ruth & Prince Cooper',
  'Imperial Experience Package',
  'https://images.pexels.com/photos/35516007/pexels-photo-35516007.jpeg',
  'We chose the Imperial Experience for our three-day celebration and it exceeded every expectation. The level of detail, the quality of the decor, the catering, the coordination — everything was world-class. Guests came from all over Liberia and abroad and everyone was impressed. Even Decorators is simply the best.',
  5, '2024-07-05', 'Traditional & White', true, 6
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- UPDATE STAFF — Liberian names, African portraits
-- ============================================================
UPDATE staff SET
  full_name = 'Mrs. Evelyn Konah',
  email = 'evelyn@evendecorators.lr',
  phone = '+231 77 123 4567',
  position = 'Founder & Creative Director',
  bio = 'Evelyn founded Even Decorators in Monrovia with a vision to bring luxury wedding experiences to families across Liberia. With over 15 years of event design experience, she personally oversees every project to ensure it meets the standard our clients expect.',
  photo_url = 'https://images.pexels.com/photos/18656817/pexels-photo-18656817.jpeg'
WHERE email = 'evelyn@evendecorators.com' OR full_name = 'Mrs. Evelyn Adeyemi';

UPDATE staff SET
  full_name = 'Mr. Daniel Toe',
  email = 'daniel@evendecorators.lr',
  phone = '+231 88 234 5678',
  position = 'Operations Manager',
  bio = 'Daniel leads our operations team, ensuring every event runs seamlessly from setup to teardown. His attention to logistics and vendor coordination keeps our celebrations flawless across all fifteen counties of Liberia.',
  photo_url = 'https://images.pexels.com/photos/19379640/pexels-photo-19379640.jpeg'
WHERE email = 'daniel@evendecorators.com' OR full_name = 'Mr. Daniel Okonkwo';

UPDATE staff SET
  full_name = 'Ms. Amara Massaquoi',
  email = 'amara@evendecorators.lr',
  phone = '+231 77 345 6789',
  position = 'Lead Floral Designer',
  bio = 'Amara brings our floral visions to life. Her expertise in both fresh and preserved floral design has made her one of the most sought-after wedding florists in Monrovia and beyond.',
  photo_url = 'https://images.pexels.com/photos/29852895/pexels-photo-29852895.jpeg'
WHERE email = 'amara@evendecorators.com' OR full_name = 'Ms. Amara Ibrahim';

-- ============================================================
-- UPDATE FAQS — Liberia context
-- ============================================================
UPDATE faqs SET answer = 'You can submit a booking request through our website by filling out the booking form on the Booking Request page. Alternatively, you can request a quotation first, and our team will contact you to discuss your needs. Once we understand your requirements, we will prepare a tailored quotation for your review.' WHERE question = 'How do I book Even Decorators for my wedding?';

UPDATE faqs SET answer = 'Yes. We specialize in both traditional and white weddings, and we frequently coordinate multi-day celebrations that include both. Our team is experienced with the cultural protocols and traditions of Liberia''s many ethnic groups — Kpelle, Bassa, Gio, Kru, Vai, and more — and can ensure your ceremony honors your heritage.' WHERE question = 'Do you handle both traditional and white weddings?';

UPDATE faqs SET answer = 'Yes. We offer full catering services as part of our packages or as a standalone service. Our culinary team prepares traditional Liberian dishes — jollof rice, cassava leaf, palm butter, potato greens, pepper soup — as well as continental cuisine. We can accommodate dietary requirements, cultural preferences, and large guest counts.' WHERE question = 'Do you offer catering services?';

UPDATE faqs SET answer = 'Yes. Our tailoring service creates custom-fitted attire for the bride, groom, and entire wedding party. We work with premium fabrics including traditional Liberian lappa and country cloth, and offer both traditional and contemporary designs. We recommend booking tailoring well in advance to allow for multiple fittings.' WHERE question = 'Do you provide tailoring services for the wedding party?';

UPDATE faqs SET answer = 'We are based in Monrovia and serve clients across all fifteen counties of Liberia. For destination weddings or events outside our primary service area, travel and accommodation costs may apply. Contact us with your venue location and we will confirm service availability.' WHERE question = 'What areas do you serve?';

UPDATE faqs SET answer = 'Pricing is determined after we understand your specific needs. We do not process payments online. You submit a booking request or quotation request, and our team manually prepares a tailored quote based on your requirements. All payments are handled offline through agreed-upon methods. Prices are quoted in Liberian Dollars (LRD).' WHERE question = 'How does pricing work?';

-- ============================================================
-- UPDATE SITE SETTINGS — Liberia contact info
-- ============================================================
UPDATE site_settings SET value = jsonb_build_object(
  'phone', '+231 77 123 4567',
  'email', 'hello@evendecorators.lr',
  'address', '15 Broad Street, Monrovia, Montserrado County, Liberia',
  'hours', 'Monday – Saturday: 9:00 AM – 6:00 PM'
) WHERE key = 'contact_info';

UPDATE site_settings SET value = jsonb_build_object(
  'instagram', 'https://instagram.com/evendecorators',
  'facebook', 'https://facebook.com/evendecorators',
  'twitter', 'https://twitter.com/evendecorators',
  'whatsapp', 'https://wa.me/231771234567'
) WHERE key = 'social_links';

UPDATE site_settings SET value = jsonb_build_object(
  'title', 'Creating Moments, Crafting Memories',
  'subtitle', 'Luxury wedding decoration, traditional and white weddings, catering, tailoring, and full event planning — all from one dedicated team in Monrovia, Liberia.',
  'image_url', 'https://images.pexels.com/photos/35406007/pexels-photo-35406007.jpeg',
  'video_url', '',
  'cta_primary', 'Book Your Wedding',
  'cta_secondary', 'Request Quotation'
) WHERE key = 'hero_content';

UPDATE site_settings SET value = jsonb_build_object(
  'text', 'Now booking for the 2025 wedding season — reserve your date early.',
  'is_active', true
) WHERE key = 'announcement';

UPDATE site_settings SET value = jsonb_build_object(
  'title', 'A Family-Owned Wedding Atelier',
  'story', 'Even Decorators began as a small family business in Monrovia with a big vision: to bring luxury, heart, and precision to every wedding we touch. For over 15 years, we have been honored to help hundreds of couples across Liberia celebrate their love with celebrations that are as beautiful as they are meaningful. From traditional ceremonies that honor our rich heritage to white weddings that embody timeless elegance, we approach every event as if it were our own family''s.',
  'mission', 'To create extraordinary wedding experiences that honor each couple''s unique love story, cultural heritage, and personal vision — with meticulous attention to detail and genuine care for every guest.',
  'values', jsonb_build_array(
    jsonb_build_object('title', 'Craftsmanship', 'description', 'Every floral arrangement, every draped fold, every table setting is crafted with intention and skill.'),
    jsonb_build_object('title', 'Heritage', 'description', 'We honor the traditions and cultural protocols that make each Liberian wedding uniquely meaningful.'),
    jsonb_build_object('title', 'Care', 'description', 'We treat every couple and every celebration as if it were our own family''s.'),
    jsonb_build_object('title', 'Excellence', 'description', 'We hold ourselves to the highest standard, because your day deserves nothing less.')
  )
) WHERE key = 'about_content';
