import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "./Login";
import { User, Users, CheckCircle2, Sparkles } from "lucide-react";
import { Thankyou } from "../../components/Thankyou";

const roles = [
  {
    key: "candidate",
    icon: User,
    title: "Candidate",
    desc: "I'm looking for a new role and want referrals.",
    to: "/candidate/dashboard",
  },
  {
    key: "employee",
    icon: Users,
    title: "Employee",
    desc: "I want to refer candidates to jobs at my company.",
    to: "/employee/dashboard",
  },
];

const API_URL = import.meta.env.VITE_API_URL;

const personalEmailProviders = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "protonmail.com",
  "proton.me",
  "aol.com",
  "zoho.com",
];

export const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("candidate");
  const [submitSuccess, setsubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);

    // Clear email error when switching roles
    setErrors((prev) => ({
      ...prev,
      email: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // First name
    if (!firstName) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName =
        "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(firstName)) {
      newErrors.firstName = "First name contains invalid characters";
    }

    // Last name
    if (!lastName) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName =
        "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s'-]+$/.test(lastName)) {
      newErrors.lastName = "Last name contains invalid characters";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Employee work email validation
    if (role === "employee" && email) {
      const domain = email.split("@")[1]?.toLowerCase();

      if (!domain || personalEmailProviders.includes(domain)) {
        newErrors.email =
          "Employees must use a valid work email address";
      }
    }

    // Password
    // if (!password) {
    //   newErrors.password = "Password is required";
    // } else if (password.length < 8) {
    //   newErrors.password =
    //     "Password must be at least 8 characters";
    // } else if (!/[A-Z]/.test(password)) {
    //   newErrors.password =
    //     "Password must contain at least one uppercase letter";
    // } else if (!/[a-z]/.test(password)) {
    //   newErrors.password =
    //     "Password must contain at least one lowercase letter";
    // } else if (!/[0-9]/.test(password)) {
    //   newErrors.password =
    //     "Password must contain at least one number";
    // }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

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
      const API_URL = import.meta.env.VITE_API_URL;
      console.log("API_URL:", API_URL); // Debugging line
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors && Array.isArray(result.errors)) {
          const backendErrors = {};

          result.errors.forEach((error) => {
            if (error.path) {
              backendErrors[error.path] = error.msg || error.message;
            }
          });

          setErrors(backendErrors);
        }

        setServerError(
          result.message || "Registration failed. Please try again."
        );

        return;
      }

      setsubmitSuccess(true);
      // Registration successful
      // navigate(
      //   roles.find((r) => r.key === role)?.to ||
      //     "/login"
      // );
    } catch (error) {
      console.error("Registration error:", error);

      setServerError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return <Thankyou />;
  }


  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with Referly in less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-700"
          >
            Log in
          </Link>
        </>
      }
    >
      
      <p className="text-xs font-semibold text-slate-600 mb-2">
        I am a...
      </p>

      <div className="space-y-2">
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => handleRoleChange(r.key)}
            className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${role === r.key
              ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
              : "border-slate-200 hover:border-slate-300"
              }`}
            data-testid={`signup-role-${r.key}`}
          >
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${role === r.key
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600"
                }`}
            >
              <r.icon className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                {r.title}
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                {r.desc}
              </p>
            </div>

            {role === r.key && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        ))}
      </div>

      <form
        className="space-y-3 mt-5"
        onSubmit={handleSubmit}
      >
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={`field w-full ${errors.firstName
                ? "border-red-400"
                : ""
                }`}
              data-testid="signup-first-name"
              autoComplete="given-name"
            />

            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={`field w-full ${errors.lastName
                ? "border-red-400"
                : ""
                }`}
              data-testid="signup-last-name"
              autoComplete="family-name"
            />

            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={
              role === "employee"
                ? "Work email"
                : "Email address"
            }
            type="email"
            className={`field w-full ${errors.email
              ? "border-red-400"
              : ""
              }`}
            data-testid="signup-email"
            autoComplete="email"
          />

          {role === "employee" && (
            <p className="text-[11px] text-slate-500 mt-1">
              Employees must use their company/work email.
            </p>
          )}

          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className={`field w-full ${errors.password
              ? "border-red-400"
              : ""
              }`}
            data-testid="signup-password"
            autoComplete="new-password"
          />

          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            type="password"
            className={`field w-full ${errors.confirmPassword
              ? "border-red-400"
              : ""
              }`}
            data-testid="signup-confirm-password"
            autoComplete="new-password"
          />

          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

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
          className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          data-testid="signup-submit"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
};
