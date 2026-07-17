import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';
import type {
  Service, WeddingPackage, RentalCategory, RentalItem, GalleryCategory,
  GalleryAlbum, GalleryMedia, Testimonial, FAQ, Booking, Customer, Quotation,
  Staff, StaffRole, SiteStat, Notification, AuditLog,
} from '../types';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as Service[];
    },
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wedding_packages').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as WeddingPackage[];
    },
  });
}

export function useRentalCategories() {
  return useQuery({
    queryKey: ['rental-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rental_categories').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as RentalCategory[];
    },
  });
}

export function useRentalItems(categorySlug?: string) {
  return useQuery({
    queryKey: ['rental-items', categorySlug],
    queryFn: async () => {
      let query = supabase.from('rental_items').select('*, rental_categories(*)').eq('is_active', true).order('name');
      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase.from('rental_categories').select('id').eq('slug', categorySlug).maybeSingle();
        if (cat) query = query.eq('category_id', cat.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as RentalItem[];
    },
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ['gallery-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery_categories').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as GalleryCategory[];
    },
  });
}

export function useGalleryAlbums(categorySlug?: string) {
  return useQuery({
    queryKey: ['gallery-albums', categorySlug],
    queryFn: async () => {
      let query = supabase.from('gallery_albums').select('*, gallery_categories(*)').eq('is_active', true).order('display_order');
      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase.from('gallery_categories').select('id').eq('slug', categorySlug).maybeSingle();
        if (cat) query = query.eq('category_id', cat.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as GalleryAlbum[];
    },
  });
}

export function useGalleryMedia(albumId: string | null) {
  return useQuery({
    queryKey: ['gallery-media', albumId],
    queryFn: async () => {
      if (!albumId) return [];
      const { data, error } = await supabase.from('gallery_media').select('*').eq('album_id', albumId).eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as GalleryMedia[];
    },
    enabled: !!albumId,
  });
}

export function useFeaturedGallery(limit = 8) {
  return useQuery({
    queryKey: ['gallery-featured', limit],
    queryFn: async () => {
      const { data: albums } = await supabase.from('gallery_albums').select('id, title, slug, cover_image_url').eq('is_active', true).eq('is_featured', true).order('display_order').limit(limit);
      if (albums && albums.length > 0) return albums;
      const { data, error } = await supabase.from('gallery_albums').select('id, title, slug, cover_image_url').eq('is_active', true).order('display_order').limit(limit);
      if (error) throw error;
      return data;
    },
  });
}

export function useTestimonials(featuredOnly = false) {
  return useQuery({
    queryKey: ['testimonials', featuredOnly],
    queryFn: async () => {
      let query = supabase.from('testimonials').select('*').eq('is_active', true).order('display_order');
      if (featuredOnly) query = query.eq('is_featured', true);
      const { data, error } = await query;
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faqs').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as FAQ[];
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase.from('staff').select('*, staff_roles(*)').eq('is_active', true).order('created_at');
      if (error) throw error;
      return data as Staff[];
    },
  });
}

export function useSiteStats() {
  return useQuery({
    queryKey: ['site-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_stats').select('*').eq('is_active', true).order('display_order');
      if (error) throw error;
      return data as SiteStat[];
    },
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const map: Record<string, unknown> = {};
      data?.forEach((item) => { map[item.key] = item.value; });
      return map;
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useQuotations() {
  return useQuery({
    queryKey: ['admin-quotations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('quotations').select('*, bookings(*), quotation_items(*)').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Quotation[];
    },
  });
}

export function useStaffRoles() {
  return useQuery({
    queryKey: ['admin-staff-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('staff_roles').select('*').order('created_at');
      if (error) throw error;
      return data as StaffRole[];
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
      if (error) throw error;
      return data as Notification[];
    },
  });
}

export function useAuditLogs(limit = 50) {
  return useQuery({
    queryKey: ['admin-audit-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data as AuditLog[];
    },
  });
}
