
import React, { useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthShell } from "./Login";

const API_URL = import.meta.env.VITE_API_URL;
export const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get("returnUrl");
    const token = params.get("token")
    const email = params.get("email")

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/auth/reset-password/${encodeURIComponent(token)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        password,
                        confirmPassword,
                        email
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to process your request."
                );
            }
            setSuccess(data.message);

            setTimeout(() => navigate(returnUrl != undefined ? returnUrl : "/login", { replace: true }), 1000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset your password. Please request a new link."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            title="Create a new password"
            subtitle="Choose a new password for your Referly account."
            footer={
                <Link to={`${returnUrl ? `/login?${returnUrl}` : "/login"}`} className="font-semibold text-emerald-700">
                    Back to login
                </Link>
            }
        >
            <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New password"
                    className="field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm new password"
                    className="field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                />

                {error && (
                    <p role="alert" className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status" className="text-sm text-emerald-600">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading || !!success}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Reset password"}
                </button>
            </form>
        </AuthShell>
    );
};
