import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
 

export default function LoginPage() {
  const navigate = useNavigate();
  

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, go straight to dashboard
 
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-serif font-bold text-yellow-600">
            Even Decorators
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Wedding Management System
          </p>
        </div>

        {/* Welcome */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome Back
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sign in to your Admin Dashboard
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>

          <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-yellow-500">
            <Mail size={18} className="text-gray-400" />

            <input
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="flex items-center rounded-lg border border-gray-300 px-3 focus-within:border-yellow-500">
            <Lock size={18} className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Remember */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" />
            Remember me
          </label>

          <button
            type="button"
            className="text-yellow-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

