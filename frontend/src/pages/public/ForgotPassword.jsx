import React from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./Login";

export const ForgotPassword = () => (
  <AuthShell
    title="Reset your password"
    subtitle="Enter your email and we'll send you a reset link."
    footer={<Link to="/login" className="font-semibold text-emerald-700">Back to login</Link>}
  >
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <input type="email" placeholder="you@company.com" className="field" data-testid="forgot-email" />
      <button className="btn-primary w-full justify-center" data-testid="forgot-submit">Send reset link</button>
    </form>
  </AuthShell>
);
