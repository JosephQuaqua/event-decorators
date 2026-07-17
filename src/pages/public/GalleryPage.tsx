import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  Reveal,
  Spinner,
  EmptyState,
  ErrorState,
} from '../../components/ui/Section';
import {
  useGalleryCategories,
  useGalleryAlbums,
  useGalleryMedia,
} from '../../lib/hooks';
import { PEXEL_IMAGES } from '../../lib/constants';
import { cn, formatDate } from '../../lib/utils';

// ===========================================================================
// GalleryPage
// ===========================================================================

export function GalleryPage() {
  const { data: categories, isLoading: catLoading } = useGalleryCategories();
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: albums, isLoading, isError } = useGalleryAlbums(activeCategory);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const { data: media, isLoading: mediaLoading } =
    useGalleryMedia(selectedAlbumId);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Find the selected album object
  const selectedAlbum = albums?.find((a) => a.id === selectedAlbumId) ?? null;

  const closeAlbum = useCallback(() => {
    setSelectedAlbumId(null);
    setLightboxIndex(null);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || !media) return prev;
      return (prev + 1) % media.length;
    });
  }, [media]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || !media) return prev;
      return (prev - 1 + media.length) % media.length;
    });
  }, [media]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          closeLightbox();
        } else {
          closeAlbum();
        }
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, closeLightbox, closeAlbum, nextImage, prevImage]);

  // Lock body scroll when album modal is open
  useEffect(() => {
    if (selectedAlbumId) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAlbumId]);

  const activeMedia = lightboxIndex !== null && media ? media[lightboxIndex] : null;

  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="Gallery"
        description="Explore our portfolio of celebrations — weddings, birthdays, graduations, corporate events, and more. Each album tells a story of a day beautifully crafted."
        bgImage={PEXEL_IMAGES.celebration}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gallery' },
        ]}
      />

      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          {/* Category filters */}
          <Reveal>
            <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
                  activeCategory === 'all'
                    ? 'bg-gold-500 text-white shadow-gold'
                    : 'border border-ivory-300 bg-white text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
                )}
              >
                All Albums
              </button>
              {!catLoading &&
                categories?.map((cat) => (
                  <button
                    key={cat.id}
                    type= "button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={cn(
                      'rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300',
                      activeCategory === cat.slug
                        ? 'bg-gold-500 text-white shadow-gold'
                        : 'border border-ivory-300 bg-white text-charcoal-700 hover:border-gold-500 hover:text-gold-600'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </Reveal>

          {/* Albums grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-72 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState />
          ) : !albums || albums.length === 0 ? (
            <EmptyState title="No albums found" />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, idx) => (
                <Reveal key={album.id} delay={idx * 80}>
                  <button
                    type="button"
                    onClick={() => setSelectedAlbumId(album.id)}
                    className="group relative block w-full overflow-hidden rounded-2xl text-left shadow-luxury transition-all duration-300 hover:shadow-gold"
                  >
                    <div className="relative h-72 overflow-hidden">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-charcoal-800 text-ivory-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      {album.category?.name && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                          {album.category.name}
                        </span>
                      )}
                      <h3 className="mt-1 font-serif text-xl font-semibold text-white">
                        {album.title}
                      </h3>
                      {album.event_date && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-ivory-200">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(album.event_date)}
                        </div>
                      )}
                      {album.venue && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-ivory-200">
                          <MapPin className="h-3.5 w-3.5" />
                          {album.venue}
                        </div>
                      )}
                    </div>
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowRight className="h-5 w-5 text-charcoal-800" />
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Album Modal Viewer */}
      {selectedAlbumId && selectedAlbum && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-charcoal-900/80 p-4 backdrop-blur-sm md:p-8">
          <div className="relative my-auto w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-ivory-200 bg-white/95 p-6 backdrop-blur-sm">
              <div>
                {selectedAlbum.category?.name && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {selectedAlbum.category.name}
                  </span>
                )}
                <h2 className="mt-1 font-serif text-2xl font-semibold text-charcoal-900">
                  {selectedAlbum.title}
                </h2>
                {selectedAlbum.description && (
                  <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                    {selectedAlbum.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal-500">
                  {selectedAlbum.event_date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gold-500" />
                      {formatDate(selectedAlbum.event_date)}
                    </span>
                  )}
                  {selectedAlbum.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gold-500" />
                      {selectedAlbum.venue}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closeAlbum}
                className="flex-shrink-0 rounded-full bg-ivory-100 p-2 text-charcoal-600 transition-colors hover:bg-rose-100 hover:text-rose-600"
                aria-label="Close album"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Media grid */}
            <div className="p-6">
              {mediaLoading ? (
                <div className="flex justify-center py-16">
                  <Spinner />
                </div>
              ) : !media || media.length === 0 ? (
                <EmptyState title="No media in this album" />
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {media.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative overflow-hidden rounded-xl shadow-luxury"
                    >
                      <img
                        src={m.thumbnail_url ?? m.url}
                        alt={m.title ?? `Media ${idx + 1}`}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {m.title && (
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal-900/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-sm text-white">{m.title}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-charcoal-950/95"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous */}
          {media && media.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="flex max-h-[90vh] max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeMedia.url}
              alt={activeMedia.title ?? 'Gallery image'}
              className="max-h-[80vh] max-w-full object-contain"
            />
            {activeMedia.title && (
              <p className="mt-4 text-center text-sm text-ivory-200">
                {activeMedia.title}
              </p>
            )}
            {activeMedia.caption && (
              <p className="mt-1 text-center text-xs text-ivory-400">
                {activeMedia.caption}
              </p>
            )}
          </div>

          {/* Next */}
          {media && media.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Counter */}
          {media && media.length > 1 && lightboxIndex !== null && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
              {lightboxIndex + 1} / {media.length}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <section className="bg-emerald-700 py-20">
        <div className="container-luxury text-center">
          <Reveal>
            <h2 className="font-serif text-display-md font-medium text-white">
              Your Celebration, Our Canvas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ivory-200">
              Let us add your special day to our gallery. Book your event today
              and let the magic unfold.
            </p>
            <div className="mt-10">
              <Link to="/book" className="btn-primary">
                <Heart className="h-4 w-4" />
                Book Your Event
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default GalleryPage;
