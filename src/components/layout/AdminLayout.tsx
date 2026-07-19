import { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Package,
  Image,
  Star,
  Users,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  Home,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { COMPANY } from "../../lib/constants";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

// ---------------------------------------------------------------------------
// Nav items
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Bookings", to: "/admin/bookings", icon: CalendarDays },
  { label: "Quotations", to: "/admin/quotations", icon: FileText },
  { label: "Services", to: "/admin/services", icon: Briefcase },
  { label: "Rental Inventory", to: "/admin/inventory", icon: Package },
  { label: "Gallery", to: "/admin/gallery", icon: Image },
  { label: "Testimonials", to: "/admin/testimonials", icon: Star },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Staff", to: "/admin/staff", icon: ShieldCheck },
  { label: "FAQs", to: "/admin/faqs", icon: HelpCircle },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "My Profile", to: "/admin/profile", icon: User },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function SidebarContent({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-charcoal-800 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-gold-400"
          >
            <path d="M12 2l2.39 7.36H22l-6.19 4.5L18.2 21 12 16.5 5.8 21l2.39-7.14L2 9.36h7.61L12 2z" />
          </svg>
        </span>

        <span className="font-serif text-lg font-semibold text-white">
          {COMPANY.name}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/admin"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gold-500/10 text-gold-400"
                        : "text-charcoal-300 hover:bg-charcoal-800 hover:text-white"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-charcoal-800 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-300 transition hover:bg-charcoal-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin Layout
// ---------------------------------------------------------------------------

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { profile } = useAuth();

const initials = useMemo(() => {
  if (!profile?.full_name) return "ED";

  return profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}, [profile]);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeItem = NAV_ITEMS.find(
    (item) =>
      item.to === pathname ||
      (item.to !== "/admin" && pathname.startsWith(item.to))
  );

  const pageTitle = activeItem?.label ?? "Dashboard";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-ivory-100">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-charcoal-900 lg:block">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-64 bg-charcoal-900 shadow-2xl transition-transform",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent
            onNavigate={() => setMobileOpen(false)}
            onLogout={handleLogout}
          />
        </aside>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ivory-200 bg-ivory-100/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-charcoal-700 hover:bg-ivory-200 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="font-serif text-xl font-semibold text-charcoal-900">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg p-2 text-charcoal-600 hover:bg-ivory-200"
            >
              <Home className="h-5 w-5" />

              <span className="hidden sm:inline">View Site</span>
            </Link>

            <button className="relative rounded-lg p-2 text-charcoal-600 hover:bg-ivory-200">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold-500"></span>
            </button>

           <div className="relative">
  <button
    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
    className="flex items-center gap-3 rounded-xl p-2 hover:bg-ivory-200 transition"
  >
    <div className="h-10 w-10 overflow-hidden rounded-full bg-emerald-700">
  {profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt={profile.full_name ?? "Profile"}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
      {initials}
    </div>
  )}
</div>

    <div className="hidden md:block text-left">
      <p className="text-sm font-semibold text-charcoal-900">
        {profile?.full_name || "Administrator"}
      </p>

      <p className="text-xs capitalize text-charcoal-500">
        {(profile?.role || "").replace("_", " ")}
      </p>
    </div>
  </button>

  {profileMenuOpen && (
    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ivory-200 bg-white shadow-xl overflow-hidden">
      <Link
        to="/admin/profile"
        className="block px-4 py-3 hover:bg-ivory-100"
        onClick={() => setProfileMenuOpen(false)}
      >
        My Profile
      </Link>

      <button
        onClick={handleLogout}
        className="block w-full px-4 py-3 text-left hover:bg-rose-50 text-rose-600"
      >
        Sign Out
      </button>
    </div>
  )}
</div>
</div>
</header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;