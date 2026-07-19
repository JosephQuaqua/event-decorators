
export interface Profile {
  id: string;

  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;

  role: "super_admin" | "admin" | "staff" | "customer";

  is_active: boolean;

  position: string | null;
  department: string | null;
  bio: string | null;
  address: string | null;
  date_of_birth: string | null;
  last_login: string | null;
  created_by: string | null;

  created_at: string;
  updated_at: string;
}