import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

// Authentication
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/admin/LoginPage";

// Public Pages
import { HomePage } from "./pages/public/HomePage";
import { AboutPage } from "./pages/public/AboutPage";
import {
  ServicesPage,
  ServiceDetailPage,
} from "./pages/public/ServicesPage";
import {
  PackagesPage,
  PackageDetailPage,
} from "./pages/public/PackagesPage";
import { RentalsPage } from "./pages/public/RentalsPage";
import { GalleryPage } from "./pages/public/GalleryPage";
import { TestimonialsPage } from "./pages/public/TestimonialsPage";
import { FAQsPage } from "./pages/public/FAQsPage";
import { ContactPage } from "./pages/public/ContactPage";
import { BookingPage } from "./pages/public/BookingPage";
import {
  PrivacyPage,
  TermsPage,
} from "./pages/public/LegalPages";
import {
  NotFoundPage,
  ServerErrorPage,
} from "./pages/public/ErrorPages";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminQuotations } from "./pages/admin/AdminQuotations";
import { AdminInventory } from "./pages/admin/AdminInventory";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import {
  AdminTestimonials,
  AdminFAQs,
  AdminStaff,
  AdminServices,
  AdminReports,
  AdminSettings,
} from "./pages/admin/AdminPages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* =========================
              PUBLIC WEBSITE
          ========================== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route
              path="/services/:slug"
              element={<ServiceDetailPage />}
            />
            <Route path="/packages" element={<PackagesPage />} />
            <Route
              path="/packages/:slug"
              element={<PackageDetailPage />}
            />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route
              path="/testimonials"
              element={<TestimonialsPage />}
            />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route
              path="/quote"
              element={<BookingPage isQuotation />}
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          {/* =========================
              ADMIN LOGIN
          ========================== */}
          <Route
            path="/admin/login"
            element={<LoginPage />}
          />

          {/* =========================
              PROTECTED ADMIN
          ========================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="bookings"
              element={<AdminBookings />}
            />
            <Route
              path="quotations"
              element={<AdminQuotations />}
            />
            <Route
              path="services"
              element={<AdminServices />}
            />
            <Route
              path="inventory"
              element={<AdminInventory />}
            />
            <Route
              path="gallery"
              element={<AdminGallery />}
            />
            <Route
              path="testimonials"
              element={<AdminTestimonials />}
            />
            <Route
              path="customers"
              element={<AdminCustomers />}
            />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route
              path="reports"
              element={<AdminReports />}
            />
            <Route
              path="settings"
              element={<AdminSettings />}
            />
          </Route>

          {/* =========================
              ERROR PAGES
          ========================== */}
          <Route
            path="/500"
            element={<ServerErrorPage />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}