import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  useGalleryAlbums,
  useGalleryMedia,
  useGalleryCategories,
} from '../../lib/hooks';
import { Spinner } from '../../components/ui/Section';
import { AdminPageHeader } from '../../components/ui/AdminTable';
import { cn, slugify } from '../../lib/utils';
import type { GalleryAlbum } from '../../types';

// ---------------------------------------------------------------------------
// Add album modal
// ---------------------------------------------------------------------------

function AddAlbumModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useGalleryCategories();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [venue, setVenue] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('gallery_albums').insert({
        title,
        slug: slugify(title),
        category_id: categoryId || null,
        description: description || null,
        cover_image_url: coverUrl || null,
        venue: venue || null,
        is_active: true,
        is_featured: false,
        display_order: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-luxury">
        <div className="flex items-center justify-between border-b border-ivory-200 px-6 py-4">
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">Add Album</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div>
            <label className="label-field" htmlFor="album-title">
              Title
            </label>
            <input
              id="album-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="album-category">
              Category
            </label>
            <select
              id="album-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input-field"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field" htmlFor="album-desc">
              Description
            </label>
            <textarea
              id="album-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="album-cover">
              Cover Image URL
            </label>
            <input
              id="album-cover"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="album-venue">
              Venue / Location
            </label>
            <input
              id="album-venue"
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="input-field"
            />
          </div>

          {createMutation.isError && (
            <p className="text-sm text-rose-600">
              Error: {(createMutation.error as Error)?.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              type="button"
              disabled={createMutation.isPending || !title.trim()}
              onClick={() => createMutation.mutate()}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Creating…' : 'Create Album'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add media modal
// ---------------------------------------------------------------------------

function AddMediaModal({
  albums,
  defaultAlbumId,
  onClose,
}: {
  albums: GalleryAlbum[];
  defaultAlbumId: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [albumId, setAlbumId] = useState(defaultAlbumId);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('gallery_media').insert({
        album_id: albumId || null,
        url: imageUrl,
        title: title || null,
        caption: caption || null,
        media_type: 'image',
        is_active: true,
        display_order: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-media', albumId] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-luxury">
        <div className="flex items-center justify-between border-b border-ivory-200 px-6 py-4">
          <h2 className="font-serif text-2xl font-medium text-charcoal-900">Add Media</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-500 hover:bg-ivory-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div>
            <label className="label-field" htmlFor="media-album">
              Album
            </label>
            <select
              id="media-album"
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="input-field"
            >
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field" htmlFor="media-url">
              Image URL
            </label>
            <input
              id="media-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="media-title">
              Title
            </label>
            <input
              id="media-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="media-caption">
              Caption
            </label>
            <textarea
              id="media-caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="input-field"
            />
          </div>

          {createMutation.isError && (
            <p className="text-sm text-rose-600">
              Error: {(createMutation.error as Error)?.message}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              type="button"
              disabled={createMutation.isPending || !imageUrl.trim()}
              onClick={() => createMutation.mutate()}
              className="btn-primary"
            >
              {createMutation.isPending ? 'Adding…' : 'Add Media'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminGallery
// ---------------------------------------------------------------------------

export function AdminGallery() {
  const { data: albums = [], isLoading } = useGalleryAlbums();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const { data: media = [] } = useGalleryMedia(selectedAlbumId);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showAddMedia, setShowAddMedia] = useState(false);

  const queryClient = useQueryClient();

  const deleteMedia = useMutation({
    mutationFn: async (mediaId: string) => {
      const { error } = await supabase
        .from('gallery_media')
        .update({ is_active: false })
        .eq('id', mediaId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-media', selectedAlbumId] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const activeAlbumId = selectedAlbumId ?? albums[0]?.id ?? '';

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery"
        description="Organize albums and manage media."
        action={
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAddAlbum(true)} className="btn-outline">
              <Plus className="h-4 w-4" /> Album
            </button>
            <button
              type="button"
              onClick={() => setShowAddMedia(true)}
              disabled={albums.length === 0}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" /> Media
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Album sidebar */}
        <div className="lg:col-span-1">
          <div className="card-luxury overflow-hidden">
            <div className="border-b border-ivory-200 px-4 py-3">
              <h2 className="font-serif text-lg font-medium text-charcoal-900">Albums</h2>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {albums.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-charcoal-400">
                  No albums yet.
                </p>
              ) : (
                <ul className="divide-y divide-ivory-200">
                  {albums.map((album) => (
                    <li key={album.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedAlbumId(album.id)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                          activeAlbumId === album.id
                            ? 'bg-gold-50 text-gold-700'
                            : 'text-charcoal-700 hover:bg-ivory-50'
                        )}
                      >
                        {album.cover_image_url ? (
                          <img
                            src={album.cover_image_url}
                            alt={album.title}
                            className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ivory-200">
                            <ImageIcon className="h-5 w-5 text-charcoal-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{album.title}</p>
                          {album.venue && (
                            <p className="truncate text-xs text-charcoal-400">
                              {album.venue}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Media grid */}
        <div className="lg:col-span-3">
          {!activeAlbumId ? (
            <div className="card-luxury flex items-center justify-center py-24 text-charcoal-400">
              Create an album to start adding media.
            </div>
          ) : media.length === 0 ? (
            <div className="card-luxury flex flex-col items-center justify-center py-24 text-charcoal-400">
              <ImageIcon className="mb-3 h-10 w-10" />
              <p>No media in this album yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="group relative overflow-hidden rounded-xl border border-ivory-200 bg-white shadow-luxury"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={m.url}
                      alt={m.title ?? ''}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {m.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-900/70 to-transparent px-3 py-2">
                      <p className="truncate text-xs font-medium text-white">{m.title}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMedia.mutate(m.id)}
                    className="absolute right-2 top-2 rounded-lg bg-charcoal-900/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
                    aria-label="Delete media"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddAlbum && <AddAlbumModal onClose={() => setShowAddAlbum(false)} />}
      {showAddMedia && (
        <AddMediaModal
          albums={albums}
          defaultAlbumId={activeAlbumId}
          onClose={() => setShowAddMedia(false)}
        />
      )}
    </div>
  );
}

export default AdminGallery;
