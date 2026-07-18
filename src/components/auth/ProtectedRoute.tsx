import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { loading, user, profile } = useAuth();

  // Still loading authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // No profile found
  if (!profile) {
    return <Navigate to="/admin/login" replace />;
  }

  // Account disabled
  if (!profile.is_active) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-xl border bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-2xl font-bold text-red-600">
            Account Disabled
          </h1>

          <p className="text-gray-600">
            Please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  // Customers cannot access admin
  if (profile.role === "customer") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}