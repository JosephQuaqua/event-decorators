/*
# Revert: Remove Cake Service & Broadened Event Types

Reverts the platform back to the wedding-only version by removing the data
added by the `add_cake_and_event_types` migration. The schema columns
(event_type, client_name) are kept to avoid data loss, but all seed data
from that migration is removed.

## Changes
1. Delete the "Wedding Cakes & Pastries" service
2. Delete gallery categories/albums/media for birthdays, graduations, corporate, cakes
3. Delete testimonials for non-wedding events (birthday, graduation, corporate)
4. Delete the "Do you make custom cakes?" FAQ
5. Revert FAQs that were changed to mention multiple event types
6. Revert site_stats values
*/

-- ============================================================
-- DELETE WEDDING CAKES SERVICE
-- ============================================================
DELETE FROM services WHERE slug = 'wedding-cakes';

-- ============================================================
-- DELETE GALLERY MEDIA, ALBUMS, CATEGORIES FOR NEW EVENT TYPES
-- ============================================================
DELETE FROM gallery_media WHERE album_id IN (
  SELECT id FROM gallery_albums WHERE slug IN (
    'princess-first-birthday',
    'class-of-2024-graduation',
    'annual-corporate-gala',
    'signature-cake-collection'
  )
);
DELETE FROM gallery_albums WHERE slug IN (
  'princess-first-birthday',
  'class-of-2024-graduation',
  'annual-corporate-gala',
  'signature-cake-collection'
);
DELETE FROM gallery_categories WHERE slug IN (
  'birthdays',
  'graduations',
  'corporate-events',
  'cakes'
);

-- ============================================================
-- DELETE NON-WEDDING TESTIMONIALS
-- ============================================================
DELETE FROM testimonials WHERE author_name IN (
  'Mrs. Sarah Dennis',
  'Mr. Augustine Pewu',
  'Ms. Josephine Karnga'
);

-- ============================================================
-- DELETE CAKES FAQ
-- ============================================================
DELETE FROM faqs WHERE question = 'Do you make custom cakes?';

-- ============================================================
-- REVERT FAQS TO WEDDING-ONLY WORDING
-- ============================================================
UPDATE faqs SET answer = 'You can submit a booking request through our website by filling out the booking form on the Booking Request page. Alternatively, you can request a quotation first, and our team will contact you to discuss your needs.' WHERE question = 'How do I book Even Decorators for my wedding?';

UPDATE faqs SET question = 'Do you handle both traditional and white weddings?' WHERE question = 'Do you only do weddings, or other events too?';

UPDATE faqs SET answer = 'Yes, we do! We are experienced in both traditional Liberian weddings and white (Western-style) weddings. Many of our couples choose to have both ceremonies, and we can seamlessly coordinate the decor, catering, and logistics for both.' WHERE question = 'Do you handle both traditional and white weddings?';

-- ============================================================
-- REVERT SITE STATS
-- ============================================================
UPDATE site_stats SET value = '500+', label = 'Weddings Planned' WHERE label = 'Weddings Planned';
UPDATE site_stats SET value = '650+', label = 'Events Managed' WHERE label = 'Events Managed';
