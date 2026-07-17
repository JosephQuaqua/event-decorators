/*
# Even Decorators — Initial Seed Data

Populates the database with real content for the Even Decorators platform.
See create_core_tables migration for schema details.
*/

-- ============================================================
-- SERVICES
-- ============================================================
INSERT INTO services (slug, name, short_description, description, icon, image_url, features, display_order, is_featured) VALUES
(
  'wedding-decoration',
  'Wedding Decoration',
  'Bespoke decor that transforms venues into breathtaking spaces.',
  'From intimate gatherings to grand celebrations, our wedding decoration service crafts bespoke environments that reflect your love story. We handle every visual detail — floral arrangements, draping, lighting, tablescapes, and stage design — so your venue feels unmistakably yours.',
  'flower2',
  'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg',
  ARRAY['Floral arrangements','Stage & mandap design','Draping & backdrops','Lighting design','Tablescapes','Venue transformation'],
  1, true
),
(
  'traditional-weddings',
  'Traditional Weddings',
  'Honoring heritage with authentic ceremonial decor and coordination.',
  'We specialize in traditional wedding ceremonies across cultures — from Yoruba, Igbo, and Hausa traditions to cross-cultural celebrations. Our team understands the symbolism, protocol, and pageantry of each custom, ensuring your traditional wedding honors family heritage while running flawlessly.',
  'crown',
  'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg',
  ARRAY['Cultural ceremony coordination','Traditional attire guidance','Bridal procession','Family protocol management','Authentic decor elements','Vendor coordination'],
  2, true
),
(
  'white-weddings',
  'White Weddings',
  'Timeless elegance for your church and reception celebration.',
  'Our white wedding service brings timeless elegance to your church ceremony and reception. We design refined, romantic settings — from aisle decor and altar arrangements to reception styling, centerpieces, and ambient lighting.',
  'church',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  ARRAY['Church ceremony decor','Aisle & altar styling','Reception design','Centerpieces & bouquets','Ambient lighting','Guest experience curation'],
  3, true
),
(
  'catering-services',
  'Catering Services',
  'Exquisite cuisine crafted to delight every guest at your table.',
  'Our catering service delivers exceptional dining experiences for weddings and events of any scale. From traditional feasts to contemporary menus, our culinary team prepares dishes with premium ingredients and impeccable presentation.',
  'utensils',
  'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg',
  ARRAY['Custom menu planning','Traditional & continental cuisine','Dietary accommodations','Live cooking stations','Professional service staff','Premium presentation'],
  4, true
),
(
  'tailoring',
  'Tailoring',
  'Custom-fitted attire for the bride, groom, and entire wedding party.',
  'Our tailoring service creates custom-fitted attire for your entire wedding party. From the bride''s gown and the groom''s suit to bridesmaids, groomsmen, and family outfits, we craft garments that fit perfectly and photograph beautifully.',
  'scissors',
  'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
  ARRAY['Bride & groom attire','Wedding party outfits','Traditional & modern designs','Premium fabric selection','Multiple fittings','Alterations & adjustments'],
  5, true
),
(
  'event-planning',
  'Event Planning',
  'End-to-end coordination so your celebration unfolds effortlessly.',
  'Our event planning service manages every logistical detail of your celebration from concept to completion. We coordinate vendors, timelines, guest flow, and day-of execution so you can be fully present for your moments.',
  'clipboard-list',
  'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',
  ARRAY['Full event coordination','Vendor management','Timeline & schedule','Budget planning','Day-of execution','Contingency planning'],
  6, true
),
(
  'rental-equipment',
  'Rental Equipment',
  'Quality event rentals — chairs, tables, canopies, lighting, and more.',
  'Our rental inventory includes everything needed to outfit your venue: chairs, tables, canopies, lighting, wedding arches, dance floors, stages, decor pieces, centerpieces, sound equipment, table covers, and backdrops.',
  'package',
  'https://images.pexels.com/photos/256737/pexels-photo-256737.jpeg',
  ARRAY['Chairs & tables','Canopies & tents','Lighting & sound','Wedding arches','Dance floors & stages','Decor & centerpieces'],
  7, true
),
(
  'wedding-consultation',
  'Wedding Consultation',
  'Expert guidance to shape your vision into a clear, achievable plan.',
  'Our wedding consultation service pairs you with experienced planners who help you shape your vision into a clear, achievable plan. Whether you need guidance on theme, budget, vendor selection, or cultural protocols, we provide honest, expert advice.',
  'message-circle',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  ARRAY['Vision & theme development','Budget guidance','Vendor recommendations','Cultural protocol advice','Timeline planning','Stress-free decision support'],
  8, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  updated_at = now();

-- ============================================================
-- WEDDING PACKAGES
-- ============================================================
INSERT INTO wedding_packages (slug, name, tagline, description, price_from, price_range, features, inclusions, exclusions, image_url, gallery_urls, display_order, is_featured) VALUES
(
  'classic-celebration',
  'Classic Celebration',
  'Elegant essentials for a beautiful, memorable wedding.',
  'The Classic Celebration package covers the essential decoration and coordination needed for a beautiful wedding. Perfect for couples seeking a refined celebration with the fundamentals handled by professionals.',
  250000,
  '₦250,000 – ₦450,000',
  ARRAY['Venue decoration','Bridal party florals','Basic lighting','Event coordination','Table settings','1-day service'],
  'Full venue decoration, bridal bouquets and boutonnieres, basic ambient lighting, day-of event coordination, complete table settings for up to 100 guests, and one-day on-site service.',
  'Catering, tailoring, rental equipment beyond standard package, photography, and entertainment.',
  'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg',
  ARRAY['https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg','https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg'],
  1, true
),
(
  'royal-heritage',
  'Royal Heritage',
  'A grand celebration blending tradition with refined luxury.',
  'The Royal Heritage package delivers a grand wedding experience that honors tradition while elevating every detail. Designed for couples who want a rich, immersive celebration.',
  650000,
  '₦650,000 – ₦1,200,000',
  ARRAY['Traditional ceremony coordination','Full venue transformation','Premium floral design','Catering for 200 guests','Bridal party tailoring','2-day coordination','Sound & lighting','Photography setup'],
  'Traditional ceremony coordination, full venue transformation with premium florals, catering for up to 200 guests, bridal party tailoring, two-day on-site coordination, professional sound and lighting, and a dedicated photography setup.',
  'Accommodation, transportation, and premium add-ons like live bands or fireworks.',
  'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg',
  ARRAY['https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg','https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg'],
  2, true
),
(
  'imperial-experience',
  'Imperial Experience',
  'The ultimate, fully bespoke wedding — every detail, perfected.',
  'The Imperial Experience is our flagship package — a fully bespoke wedding where every element is tailored to your exact vision. From multi-day celebrations to cross-cultural ceremonies, premium catering, custom tailoring, luxury rentals, and full-service planning, nothing is left to chance.',
  1500000,
  '₦1,500,000 and above',
  ARRAY['Multi-day celebration','Full traditional & white wedding','Unlimited venue transformation','Premium catering for 500+','Custom tailoring for entire party','Luxury rental inventory','Full event planning team','Live band & entertainment','Fireworks & premium add-ons','VIP guest management'],
  'Multi-day celebration covering both traditional and white weddings, unlimited venue transformation, premium catering for 500+ guests, custom tailoring for the entire wedding party, full access to our luxury rental inventory, a dedicated full event planning team, live band and entertainment, fireworks, and VIP guest management.',
  'International travel, accommodation for international guests, and venue rental fees (coordinated separately).',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  ARRAY['https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg','https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg','https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg'],
  3, true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  updated_at = now();

-- ============================================================
-- RENTAL CATEGORIES
-- ============================================================
INSERT INTO rental_categories (slug, name, description, icon, display_order) VALUES
('chairs', 'Chairs', 'Banquet, chiavari, folding, and decorative chairs for ceremonies and receptions.', 'armchair', 1),
('tables', 'Tables', 'Round, rectangular, and cocktail tables in various sizes.', 'table', 2),
('canopies', 'Canopies', 'Tents and canopies for outdoor ceremonies and receptions.', 'tent', 3),
('flowers', 'Flowers', 'Fresh and artificial floral arrangements and installations.', 'flower', 4),
('lighting', 'Lighting', 'Ambient, accent, and decorative lighting solutions.', 'lightbulb', 5),
('wedding-arches', 'Wedding Arches', 'Decorative arches and mandaps for ceremony backdrops.', 'archway', 6),
('dance-floor', 'Dance Floor', 'Portable dance floors in various sizes and finishes.', 'square', 7),
('stage', 'Stage', 'Elevated stages for ceremonies, performances, and presentations.', 'monitor', 8),
('decor-pieces', 'Decor Pieces', 'Sculptural and decorative accent pieces for venue styling.', 'sparkles', 9),
('centerpieces', 'Centerpieces', 'Table centerpieces, candelabras, and table decor.', 'flower2', 10),
('sound-equipment', 'Sound Equipment', 'Speakers, microphones, and audio systems for events.', 'speaker', 11),
('table-covers', 'Table Covers', 'Tablecloths, runners, napkins, and chair covers.', 'shirt', 12),
('backdrops', 'Backdrops', 'Decorative backdrops for photo walls and ceremony settings.', 'image', 13)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- ============================================================
-- RENTAL ITEMS
-- ============================================================
INSERT INTO rental_items (category_id, name, slug, description, image_url, stock, reserved_quantity, condition, storage_location, price_per_unit)
SELECT c.id, v.name, v.slug, v.description, v.image_url, v.stock, v.reserved_quantity, v.condition, v.storage_location, v.price_per_unit::numeric
FROM rental_categories c
JOIN (VALUES
  ('chairs', 'Chiavari Chair', 'chiavari-chair', 'Elegant gold chiavari chairs with cushion pads.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 200, 40, 'excellent', 'Warehouse A — Section 1', '1500'),
  ('chairs', 'Banquet Chair', 'banquet-chair', 'Padded banquet chairs suitable for large receptions.', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 300, 0, 'good', 'Warehouse A — Section 2', '1000'),
  ('tables', 'Round Banquet Table (60in)', 'round-banquet-table-60', '60-inch round table seating 8 guests comfortably.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 50, 10, 'excellent', 'Warehouse A — Section 3', '2500'),
  ('tables', 'Cocktail Table', 'cocktail-table', 'Tall cocktail table for standing receptions.', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 40, 5, 'good', 'Warehouse A — Section 3', '2000'),
  ('canopies', 'White Event Canopy (20x40)', 'white-event-canopy-20x40', '20x40 ft white canopy tent for outdoor events.', 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg', 8, 2, 'excellent', 'Warehouse B — Section 1', '35000'),
  ('flowers', 'Bridal Bouquet', 'bridal-bouquet', 'Custom bridal bouquet with fresh seasonal flowers.', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 15, 3, 'excellent', 'Floral Studio', '12000'),
  ('lighting', 'Fairy Light String (50m)', 'fairy-light-string-50m', '50-meter warm white fairy light string for ambient decor.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 30, 8, 'good', 'Warehouse B — Section 2', '5000'),
  ('wedding-arches', 'Floral Wedding Arch', 'floral-wedding-arch', 'Decorated wedding arch with floral arrangements.', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 6, 1, 'excellent', 'Warehouse B — Section 3', '45000'),
  ('dance-floor', 'Parquet Dance Floor (4x4m)', 'parquet-dance-floor-4x4', 'Premium parquet dance floor panels, 4x4 meters.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 4, 0, 'good', 'Warehouse B — Section 4', '25000'),
  ('stage', 'Elevated Stage (4x3m)', 'elevated-stage-4x3', 'Modular elevated stage platform, 4x3 meters.', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 3, 1, 'good', 'Warehouse B — Section 5', '30000'),
  ('centerpieces', 'Crystal Candelabra Centerpiece', 'crystal-candelabra-centerpiece', 'Elegant crystal candelabra centerpiece for tables.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 60, 12, 'excellent', 'Warehouse C — Section 1', '3500'),
  ('sound-equipment', 'Professional PA System', 'professional-pa-system', 'Complete PA system with speakers, mixer, and microphones.', 'https://images.pexels.com/photos/167466/pexels-photo-167466.jpeg', 5, 1, 'excellent', 'Warehouse C — Section 2', '28000'),
  ('table-covers', 'Satin Tablecloth (Round)', 'satin-tablecloth-round', 'Premium ivory satin tablecloth for round tables.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 100, 20, 'good', 'Warehouse C — Section 3', '1500'),
  ('table-covers', 'Chair Cover with Sash', 'chair-cover-with-sash', 'Fitted chair cover with organza sash in various colors.', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 250, 50, 'good', 'Warehouse C — Section 3', '800'),
  ('backdrops', 'Floral Photo Backdrop', 'floral-photo-backdrop', 'Decorated floral backdrop for photo walls and ceremonies.', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 5, 2, 'excellent', 'Warehouse C — Section 4', '38000')
) AS v(category_slug, name, slug, description, image_url, stock, reserved_quantity, condition, storage_location, price_per_unit)
ON c.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  stock = EXCLUDED.stock,
  updated_at = now();

-- ============================================================
-- GALLERY CATEGORIES
-- ============================================================
INSERT INTO gallery_categories (slug, name, description, display_order) VALUES
('traditional-weddings', 'Traditional Weddings', 'Traditional and cultural wedding celebrations.', 1),
('white-weddings', 'White Weddings', 'Church ceremonies and white wedding receptions.', 2),
('decor', 'Decor & Design', 'Venue decoration, floral design, and stage styling.', 3),
('catering', 'Catering', 'Cuisine, table settings, and dining experiences.', 4),
('celebrations', 'Celebrations', 'Dance, joy, and unforgettable moments.', 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- ============================================================
-- GALLERY ALBUMS
-- ============================================================
INSERT INTO gallery_albums (category_id, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
SELECT gc.id, v.title, v.slug, v.description, v.cover_image_url, v.event_date::date, v.venue, v.is_featured::boolean, v.display_order::int
FROM gallery_categories gc
JOIN (VALUES
  ('traditional-weddings', 'Adaeze & Chidi — Traditional Wedding', 'adaeze-chidi-traditional', 'A vibrant Igbo traditional wedding with rich cultural pageantry and elegant decor.', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', '2024-11-15', 'Owerri, Imo State', 'true', '1'),
  ('white-weddings', 'Grace & David — White Wedding', 'grace-david-white-wedding', 'A timeless white wedding ceremony and reception with romantic floral styling.', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', '2024-12-07', 'Lagos, Lagos State', 'true', '2'),
  ('decor', 'Signature Venue Transformations', 'signature-venue-transformations', 'A collection of our most striking venue decor and stage designs.', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', '2024-10-20', 'Various venues', 'true', '3'),
  ('catering', 'Exquisite Dining Experiences', 'exquisite-dining-experiences', 'Catering and table settings from our premium events.', 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg', '2024-09-14', 'Various venues', 'false', '4'),
  ('celebrations', 'Moments of Joy', 'moments-of-joy', 'Dance, laughter, and celebration from our couples and their guests.', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', '2024-08-10', 'Various venues', 'true', '5'),
  ('traditional-weddings', 'Fatima & Ibrahim — Northern Wedding', 'fatima-ibrahim-northern', 'A beautiful northern Nigerian wedding with traditional elegance.', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', '2024-07-22', 'Kano, Kano State', 'false', '6')
) AS v(category_slug, title, slug, description, cover_image_url, event_date, venue, is_featured, display_order)
ON gc.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  cover_image_url = EXCLUDED.cover_image_url;

-- ============================================================
-- GALLERY MEDIA
-- ============================================================
INSERT INTO gallery_media (album_id, media_type, url, thumbnail_url, title, caption, display_order)
SELECT ga.id, v.media_type::media_type, v.url, v.thumbnail_url, v.title, v.caption, v.display_order::int
FROM gallery_albums ga
JOIN (VALUES
  ('adaeze-chidi-traditional', 'image', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'Bridal Entrance', 'The bride arrives in traditional splendor.', '1'),
  ('adaeze-chidi-traditional', 'image', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'Floral Arch', 'Custom floral arch for the traditional ceremony.', '2'),
  ('adaeze-chidi-traditional', 'image', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'Family Blessing', 'The couple receives blessings from family elders.', '3'),
  ('adaeze-chidi-traditional', 'image', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'Reception Setup', 'Traditional reception table styling.', '4'),
  ('grace-david-white-wedding', 'image', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'Church Ceremony', 'The church ceremony with elegant aisle decor.', '1'),
  ('grace-david-white-wedding', 'image', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'Altar Florals', 'Altar arrangement with seasonal blooms.', '2'),
  ('grace-david-white-wedding', 'image', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'Reception Hall', 'The reception hall bathed in warm light.', '3'),
  ('grace-david-white-wedding', 'image', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'First Dance', 'The couple shares their first dance.', '4'),
  ('signature-venue-transformations', 'image', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'Mandap Design', 'A custom mandap with intricate floral work.', '1'),
  ('signature-venue-transformations', 'image', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'Stage Styling', 'Elevated stage with premium draping.', '2'),
  ('signature-venue-transformations', 'image', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'Tablescapes', 'Detailed tablescape with crystal and gold accents.', '3'),
  ('signature-venue-transformations', 'image', 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg', 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg', 'Outdoor Canopy', 'Outdoor ceremony under a draped canopy.', '4'),
  ('exquisite-dining-experiences', 'image', 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg', 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg', 'Plated Service', 'Elegant plated dinner service.', '1'),
  ('exquisite-dining-experiences', 'image', 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg', 'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg', 'Dessert Display', 'A curated dessert and cake display.', '2'),
  ('exquisite-dining-experiences', 'image', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'Cocktail Hour', 'Cocktail hour with canapes and signature drinks.', '3'),
  ('exquisite-dining-experiences', 'image', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'Buffet Setup', 'Premium buffet setup for large guest counts.', '4'),
  ('moments-of-joy', 'image', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'Dance Floor', 'The dance floor comes alive.', '1'),
  ('moments-of-joy', 'image', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'Couple Portrait', 'A candid moment between the couple.', '2'),
  ('moments-of-joy', 'image', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'Guest Celebration', 'Guests celebrating the newlyweds.', '3'),
  ('moments-of-joy', 'image', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg', 'Sparkler Exit', 'A magical sparkler exit to end the night.', '4'),
  ('fatima-ibrahim-northern', 'image', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg', 'Northern Elegance', 'Traditional northern wedding decor.', '1'),
  ('fatima-ibrahim-northern', 'image', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg', 'Floral Installation', 'Elegant floral installation for the ceremony.', '2'),
  ('fatima-ibrahim-northern', 'image', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg', 'Reception Decor', 'Sophisticated reception styling.', '3'),
  ('fatima-ibrahim-northern', 'image', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg', 'Family Portrait', 'A portrait with the extended family.', '4')
) AS v(album_slug, media_type, url, thumbnail_url, title, caption, display_order)
ON ga.slug = v.album_slug
ON CONFLICT DO NOTHING;

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (author_name, author_role, author_photo_url, content, rating, event_date, event_type, is_featured, display_order) VALUES
(
  'Adaeze & Chidi Okafor',
  'Traditional & White Wedding',
  'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg',
  'Even Decorators turned our dream wedding into reality. From the traditional ceremony to the white wedding, every single detail was perfect. The team understood our vision immediately and executed it flawlessly. Our guests are still talking about it.',
  5, '2024-12-07', 'Traditional & White', true, 1
),
(
  'Grace & David Adeyemi',
  'White Wedding',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  'We cannot thank Even Decorators enough. The church decoration was breathtaking, and the reception was beyond anything we imagined. Their attention to detail and professionalism made our day completely stress-free.',
  5, '2024-11-23', 'White Wedding', true, 2
),
(
  'Fatima & Ibrahim Sani',
  'Traditional Wedding',
  'https://images.pexels.com/photos/3137067/pexels-photo-3137067.jpeg',
  'The team respected every cultural tradition while making the celebration feel modern and elegant. The decor was stunning, the catering was exceptional, and the coordination was seamless. Highly recommended.',
  5, '2024-10-15', 'Traditional Wedding', true, 3
),
(
  'Blessing & Emmanuel Eze',
  'Royal Heritage Package',
  'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg',
  'The Royal Heritage package was worth every naira. From the traditional ceremony to the grand reception, everything was handled with such care and professionalism. We felt like royalty on our day.',
  5, '2024-09-20', 'Traditional & White', true, 4
),
(
  'Chioma & Tunde Bello',
  'Classic Celebration Package',
  'https://images.pexels.com/photos/1779415/pexels-photo-1779415.jpeg',
  'Even Decorators made our intimate wedding feel luxurious without breaking the bank. The Classic Celebration package covered everything we needed and the team was so responsive and accommodating. Thank you for making our day special.',
  5, '2024-08-10', 'White Wedding', true, 5
),
(
  'Ngozi & Kingsley Obi',
  'Imperial Experience Package',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  'We chose the Imperial Experience for our multi-day celebration and it exceeded every expectation. The level of detail, the quality of the decor, the catering, the coordination — everything was world-class. Even Decorators is simply the best.',
  5, '2024-07-05', 'Traditional & White', true, 6
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FAQS
-- ============================================================
INSERT INTO faqs (question, answer, category, display_order) VALUES
(
  'How do I book Even Decorators for my wedding?',
  'You can submit a booking request through our website by filling out the booking form on the Booking Request page. Alternatively, you can request a quotation first, and our team will contact you to discuss your needs. Once we understand your requirements, we will prepare a tailored quotation for your review.',
  'Booking', 1
),
(
  'Do you handle both traditional and white weddings?',
  'Yes. We specialize in both traditional and white weddings, and we frequently coordinate multi-day celebrations that include both. Our team is experienced with the cultural protocols and traditions of various Nigerian ethnic groups and can ensure your ceremony honors your heritage.',
  'Services', 2
),
(
  'Can I customize a wedding package?',
  'Absolutely. Our packages are designed as starting points and can be fully customized. During your consultation, we will discuss your vision, budget, and preferences, and tailor the package to match. You can add or remove services as needed.',
  'Packages', 3
),
(
  'Do you offer catering services?',
  'Yes. We offer full catering services as part of our packages or as a standalone service. Our culinary team prepares traditional and continental cuisine and can accommodate dietary requirements, cultural preferences, and large guest counts.',
  'Services', 4
),
(
  'Can I rent equipment without booking a full package?',
  'Yes. Our rental inventory — chairs, tables, canopies, lighting, arches, and more — is available for individual rental. Contact us with your requirements and we will provide a rental quotation based on availability.',
  'Rentals', 5
),
(
  'Do you provide tailoring services for the wedding party?',
  'Yes. Our tailoring service creates custom-fitted attire for the bride, groom, and entire wedding party. We work with premium fabrics and offer both traditional and contemporary designs. We recommend booking tailoring well in advance to allow for multiple fittings.',
  'Services', 6
),
(
  'How far in advance should I book?',
  'We recommend booking at least 3 to 6 months in advance for standard weddings and 6 to 12 months in advance for large or multi-day celebrations. This ensures availability and gives us ample time to plan and prepare every detail. However, we do our best to accommodate shorter timelines when possible.',
  'Booking', 7
),
(
  'Do you offer wedding consultation?',
  'Yes. We offer wedding consultation services — in-person and virtually — where our experienced planners help you shape your vision, plan your budget, and make key decisions. Consultation can be a standalone service or the first step toward a full booking.',
  'Services', 8
),
(
  'How does pricing work?',
  'Pricing is determined after we understand your specific needs. We do not process payments online. You submit a booking request or quotation request, and our team manually prepares a tailored quote based on your requirements. All payments are handled offline through agreed-upon methods.',
  'Pricing', 9
),
(
  'What areas do you serve?',
  'We are based in Nigeria and serve clients across the country. For destination weddings or events outside our primary service area, travel and accommodation costs may apply. Contact us with your venue location and we will confirm service availability.',
  'General', 10
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STAFF ROLES
-- ============================================================
INSERT INTO staff_roles (name, description, permissions) VALUES
('super_admin', 'Full unrestricted access to all system features and settings.', ARRAY['*']),
('admin', 'Administrative access to bookings, quotations, gallery, and content management.', ARRAY['manage_bookings','manage_quotations','manage_gallery','manage_content','manage_testimonials','manage_faqs','view_reports']),
('staff', 'Operational access to bookings, inventory, and gallery viewing.', ARRAY['view_bookings','manage_inventory','view_gallery'])
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description, permissions = EXCLUDED.permissions;

-- ============================================================
-- STAFF
-- ============================================================
INSERT INTO staff (role_id, full_name, email, phone, position, bio, photo_url) VALUES
(
  (SELECT id FROM staff_roles WHERE name = 'super_admin'),
  'Mrs. Evelyn Adeyemi',
  'evelyn@evendecorators.com',
  '+234 801 234 5678',
  'Founder & Creative Director',
  'Evelyn founded Even Decorators with a vision to bring luxury wedding experiences to families across Nigeria. With over 15 years of event design experience, she personally oversees every project to ensure it meets the standard our clients expect.',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
),
(
  (SELECT id FROM staff_roles WHERE name = 'admin'),
  'Mr. Daniel Okonkwo',
  'daniel@evendecorators.com',
  '+234 802 345 6789',
  'Operations Manager',
  'Daniel leads our operations team, ensuring every event runs seamlessly from setup to teardown. His attention to logistics and vendor coordination keeps our celebrations flawless.',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
),
(
  (SELECT id FROM staff_roles WHERE name = 'staff'),
  'Ms. Amara Ibrahim',
  'amara@evendecorators.com',
  '+234 803 456 7890',
  'Lead Floral Designer',
  'Amara brings our floral visions to life. Her expertise in both fresh and preserved floral design has made her one of the most sought-after wedding florists in the region.',
  'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg'
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  position = EXCLUDED.position,
  bio = EXCLUDED.bio;

-- ============================================================
-- SITE STATS
-- ============================================================
INSERT INTO site_stats (label, value, icon, display_order) VALUES
('Weddings Planned', '500+', 'heart', 1),
('Years of Experience', '15+', 'calendar', 2),
('Happy Couples', '480+', 'smile', 3),
('Events Managed', '750+', 'sparkles', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
('contact_info', jsonb_build_object(
  'phone', '+234 801 234 5678',
  'email', 'hello@evendecorators.com',
  'address', '15 Wedding Boulevard, Victoria Island, Lagos, Nigeria',
  'hours', 'Monday – Saturday: 9:00 AM – 6:00 PM'
)),
('social_links', jsonb_build_object(
  'instagram', 'https://instagram.com/evendecorators',
  'facebook', 'https://facebook.com/evendecorators',
  'twitter', 'https://twitter.com/evendecorators',
  'whatsapp', 'https://wa.me/2348012345678'
)),
('hero_content', jsonb_build_object(
  'title', 'Creating Moments, Crafting Memories',
  'subtitle', 'Luxury wedding decoration, traditional and white weddings, catering, tailoring, and full event planning — all from one dedicated team.',
  'image_url', 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg',
  'video_url', '',
  'cta_primary', 'Book Your Wedding',
  'cta_secondary', 'Request Quotation'
)),
('announcement', jsonb_build_object(
  'text', 'Now booking for the 2025 wedding season — reserve your date early.',
  'is_active', true
)),
('about_content', jsonb_build_object(
  'title', 'A Family-Owned Wedding Atelier',
  'story', 'Even Decorators began as a small family business with a big vision: to bring luxury, heart, and precision to every wedding we touch. For over 15 years, we have been honored to help hundreds of couples celebrate their love with celebrations that are as beautiful as they are meaningful.',
  'mission', 'To create extraordinary wedding experiences that honor each couple''s unique love story, cultural heritage, and personal vision — with meticulous attention to detail and genuine care for every guest.',
  'values', jsonb_build_array(
    jsonb_build_object('title', 'Craftsmanship', 'description', 'Every floral arrangement, every draped fold, every table setting is crafted with intention and skill.'),
    jsonb_build_object('title', 'Heritage', 'description', 'We honor the traditions and cultural protocols that make each wedding uniquely meaningful.'),
    jsonb_build_object('title', 'Care', 'description', 'We treat every couple and every celebration as if it were our own family''s.'),
    jsonb_build_object('title', 'Excellence', 'description', 'We hold ourselves to the highest standard, because your day deserves nothing less.')
  )
))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
