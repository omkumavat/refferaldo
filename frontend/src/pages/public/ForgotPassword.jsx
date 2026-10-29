
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthShell } from "./Login";
import { Mail, ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export const ForgotPassword = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const originalReturnUrl = params.get("returnUrl");

  const loginUrl = originalReturnUrl
    ? `/login?returnUrl=${encodeURIComponent(originalReturnUrl)}`
    : "/login";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to process your request."
        );
      }

      setMessage(data.message);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={submitted ? "Check your inbox" : "Reset your password"}
      subtitle={
        submitted
          ? "We've processed your password reset request."
          : "Enter your email and we'll send you a reset link."
      }
      footer={
        <Link
          to={loginUrl}
          className="inline-flex items-center gap-2 font-semibold text-emerald-500 hover:text-emerald-400"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      }
    >
      {submitted ? (
        <div className="space-y-6 text-center">
          {/* Email icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <Mail className="h-9 w-9 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              Check your email
            </h2>

            <p className="text-sm leading-6 text-neutral-400">
              If an eligible account exists, a password reset
              link will be sent to:
            </p>

            <p className="break-all font-medium text-emerald-400">
              {email}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-left">
            <p className="mb-3 text-sm font-medium text-white">
              What to do next
            </p>

            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex gap-3">
                <span className="font-semibold text-emerald-500">1.</span>
                Check your email inbox.
              </li>

              <li className="flex gap-3">
                <span className="font-semibold text-emerald-500">2.</span>
                Open the email from Referly.
              </li>

              <li className="flex gap-3">
                <span className="font-semibold text-emerald-500">3.</span>
                Click "Reset Password" to create a new password.
              </li>
            </ul>

            <p className="mt-4 text-xs leading-5 text-neutral-500">
              The reset link expires in 15 minutes. If you don't
              see the email, check your spam or junk folder.
            </p>
          </div>

          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            Open Gmail
            <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setMessage("");
              setError("");
            }}
            className="inline-flex items-center justify-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <RefreshCw size={14} />
            Try another email
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@company.com"
            className="field"
            data-testid="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {message && (
            <p role="status" className="text-sm text-emerald-500">
              {message}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="forgot-submit"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
};
