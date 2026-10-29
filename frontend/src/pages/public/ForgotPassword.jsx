
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthShell } from "./Login";

export const ForgotPassword = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl");

  const loginUrl = returnUrl
    ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : "/login";

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link
          to={loginUrl}
          className="font-semibold text-emerald-700"
        >
          Back to login
        </Link>
      }
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@company.com"
          className="field"
          data-testid="forgot-email"
          required
        />

        <button
          type="submit"
          className="btn-primary w-full justify-center"
          data-testid="forgot-submit"
        >
          Send reset link
        </button>
      </form>
    </AuthShell>
  );
};
