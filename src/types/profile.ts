export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;

  role: "super_admin" | "admin" | "staff" | "customer";

  is_active: boolean;

  created_at: string;
  updated_at: string;
}