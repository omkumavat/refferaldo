import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const dashboardByRole = {
  candidate: "/candidate/dashboard",
  employee: "/employee/dashboard",
  company: "/company/dashboard",
  admin: "/admin/dashboard",
};

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    <div className="hidden lg:block relative bg-slate-900">
      <img
        src="https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=srgb&fm=jpg&w=900&q=80"
        alt="Team"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div className="relative p-12 h-full flex flex-col justify-between text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>

          <span className="text-lg font-bold">
            Referly
          </span>
        </Link>

        <div>
          <p className="text-2xl font-semibold leading-snug max-w-md">
            "I found an employee at the company and got my
            profile referred within a day."
          </p>

          <p className="text-sm text-white/70 mt-4">
            — Aarav Sharma, Fullstack Engineer at Coinbase
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="lg:hidden flex items-center gap-2 mb-8"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>

          <span className="text-lg font-bold text-slate-900">
            Referly
          </span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="text-sm text-slate-600 mt-1">
          {subtitle}
        </p>

        <div className="mt-8">
          {children}
        </div>

        {footer && (
          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // Email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } 
    // else if (password.length < 8) {
    //   newErrors.password =
    //     "Password must be at least 8 characters";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      console.log("Login response:", result);

      if (!response.ok || !result.success) {
        // Handle backend validation errors
        if (
          result.errors &&
          Array.isArray(result.errors)
        ) {
          const backendErrors = {};

          result.errors.forEach((error) => {
            if (error.path) {
              backendErrors[error.path] =
                error.msg || error.message;
            }
          });

          setErrors(backendErrors);
        }

        setServerError(
          result.message ||
            "Invalid email or password."
        );

        return;
      }

      const user = result.data?.user;

      if (!user) {
        setServerError(
          "Login successful, but user information was not returned."
        );
        return;
      }

      const dashboard =
        dashboardByRole[user.role];

      if (!dashboard) {
        setServerError(
          "Your account role is not configured."
        );
        return;
      }

      if (formData.rememberMe) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })
        );
      } else {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })
        );
      }

      navigate(dashboard, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your referral journey."
      footer={
        <>
          New to Referly?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-700"
          >
            Create an account
          </Link>
        </>
      }
    >
      {/* Social Login */}
      <div className="space-y-3">
        <button
          type="button"
          className="btn-secondary w-full justify-center"
          data-testid="login-google"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
          >
            <path
              fill="#4285F4"
              d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.8c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.6 7.8 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M6 14.3c-.2-.6-.3-1.3-.3-2 0-.7.1-1.4.3-2V7.5H2.3C1.5 9 1 10.5 1 12.3s.5 3.3 1.3 4.8L6 14.3z"
            />
            <path
              fill="#EA4335"
              d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.3 2.3 14.9 1.3 12 1.3 7.8 1.3 4.1 3.7 2.3 7.5L6 10.3c.9-2.5 3.2-4.8 6-4.8z"
            />
          </svg>

          Continue with Google
        </button>

        <button
          type="button"
          className="btn-secondary w-full justify-center"
          data-testid="login-microsoft"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
          >
            <path fill="#F35325" d="M1 1h10v10H1z" />
            <path fill="#81BC06" d="M13 1h10v10H13z" />
            <path fill="#05A6F0" d="M1 13h10v10H1z" />
            <path fill="#FFBA08" d="M13 13h10v10H13z" />
          </svg>

          Continue with Microsoft
        </button>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <div className="flex-1 border-t border-slate-200" />
        OR
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Login Form */}
      <form
        className="space-y-3"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Email
          </label>

          <div className="relative mt-1">
            {/* <Mail className="w-4 h-4 absolute left-1 top-1/2 -translate-y-1/2 text-slate-400" /> */}

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`field pl-9 w-full ${
                errors.email
                  ? "border-red-400"
                  : ""
              }`}
              placeholder="you@company.com"
              autoComplete="email"
              data-testid="login-email"
            />
          </div>

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-xs font-medium text-emerald-700"
              data-testid="forgot-password-link"
            >
              Forgot?
            </Link>
          </div>

          <div className="relative mt-1">
            {/* <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> */}

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`field pl-9 w-full ${
                errors.password
                  ? "border-red-400"
                  : ""
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
              data-testid="login-password"
            />
          </div>

          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <label className="flex items-center gap-2 text-sm text-slate-600 pt-2 cursor-pointer">
          <input
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="accent-emerald-600"
          />

          Remember me
        </label>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <p className="text-sm text-red-600">
              {serverError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          data-testid="login-submit"
        >
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
};

export { AuthShell };