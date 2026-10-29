import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate ,useLocation} from "react-router-dom";
import {
    MailCheck,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl");

    const token = searchParams.get("token");

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState(
        "Please wait while we verify your email address."
    );

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                setMessage(
                    "Invalid verification link. The verification token is missing."
                );
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/auth/verify-email`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            token,
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    setStatus("error");
                    setMessage(
                        result.message ||
                        "Unable to verify your email address. The link may be expired or invalid."
                    );
                    return;
                }

                setStatus("success");
                setMessage(
                    result.message ||
                    "Your email has been successfully verified."
                );

                // Redirect to login after successful verification
                setTimeout(() => {
                    navigate(`/login?returnUrl=${returnUrl}`, {
                        state: {
                            message:
                                "Email verified successfully. You can now log in.",
                                showResumeParse:true
                        },
                    });
                }, 2500);
            } catch (error) {
                console.error("Email verification error:", error);

                setStatus("error");
                setMessage(
                    "Unable to connect to the server. Please try again."
                );
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

            {/* Left Section */}
            <div className="hidden lg:block relative bg-slate-900">
                <img
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=srgb&fm=jpg&w=900&q=80"
                    alt="Team"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                <div className="relative p-12 h-full flex flex-col justify-between text-white">

                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>

                        <span className="text-lg font-bold">
                            refermy.life
                        </span>
                    </Link>

                    <div>
                        <p className="text-2xl font-semibold leading-snug max-w-md">
                            Connect with employees, get referred, and take
                            the next step in your career.
                        </p>

                        <p className="text-sm text-white/70 mt-4">
                            Your next opportunity could be one referral away.
                        </p>
                    </div>

                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center justify-center p-6 sm:p-12 bg-white">

                <div className="w-full max-w-md text-center">

                    {/* Verifying */}
                    {status === "verifying" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Verifying your email
                            </h1>

                            <p className="text-slate-500 mt-3 leading-relaxed">
                                Please wait while we verify your email address.
                                This should only take a moment.
                            </p>
                        </>
                    )}

                    {/* Success */}
                    {status === "success" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Email verified!
                            </h1>

                            <p className="text-slate-500 mt-3 leading-relaxed">
                                {message}
                            </p>

                            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-700 font-medium">
                                <span>Redirecting you to login</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </>
                    )}

                    {/* Error */}
                    {status === "error" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                                <XCircle className="w-9 h-9 text-red-500" />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Verification failed
                            </h1>

                            <p className="text-slate-500 mt-3 leading-relaxed">
                                {message}
                            </p>

                            <div className="mt-8 flex flex-col gap-3">

                                <Link
                                    to="/login"
                                    className="btn-primary w-full justify-center"
                                >
                                    Go to login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                    Create a new account
                                </Link>

                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};
