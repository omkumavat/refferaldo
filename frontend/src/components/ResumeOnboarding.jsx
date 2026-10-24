import React, { useRef, useState } from "react";
import {
    Upload,
    FileText,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    X,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parseResumeAndExtract } from "../api/candidateApi";

const ResumeOnboarding = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user] = useState(
        JSON.parse(
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "{}"
        )
    )

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const dashboardByRole = {
        candidate: "/candidate/dashboard",
        employee: "/employee/dashboard",
        company: "/company/dashboard",
        admin: "/admin/dashboard",
    };

    const goToDashboard = () => {
        navigate(dashboardByRole[user?.role] || "/");
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        setError("");

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Please upload a PDF, DOC, or DOCX resume.");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("Resume must be smaller than 5 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select your resume first.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const response = await parseResumeAndExtract(user?.id, file);

            if (!response.success) {
                setError(response.error || "Unable to upload your resume.");
                return;
            }

            // Resume uploaded successfully.
            // Parsed information can be completed/edited later
            // from the candidate profile.
            goToDashboard();
        } catch (err) {
            console.error("Resume upload error:", err);
            setError("Something went wrong while uploading your resume.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 sm:px-6">
            <div className="w-full max-w-5xl">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-5 h-5" />
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                            refermy.life
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-8 sm:px-10 sm:py-10 text-center border-b border-slate-100">
                        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                            <FileText className="w-7 h-7" />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Complete your profile faster
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
                            Upload your resume and we'll automatically extract your
                            experience, skills, education and projects to help build your
                            refermy.life profile.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="grid lg:grid-cols-2">

                        {/* Benefits */}
                        <div className="p-6 sm:p-10 bg-slate-50/70">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Why upload your resume?
                            </h2>

                            <div className="mt-6 space-y-5">

                                <Benefit
                                    icon={<Sparkles className="w-5 h-5" />}
                                    title="Build your profile automatically"
                                    description="We'll extract relevant information from your resume so you don't have to enter everything manually."
                                />

                                <Benefit
                                    icon={<CheckCircle2 className="w-5 h-5" />}
                                    title="Save time"
                                    description="Your skills, experience, education and projects can be pre-filled in seconds."
                                />

                                <Benefit
                                    icon={<ArrowRight className="w-5 h-5" />}
                                    title="Improve your referral profile"
                                    description="A more complete profile helps employees understand your background when considering referrals."
                                />

                                <Benefit
                                    icon={<ShieldCheck className="w-5 h-5" />}
                                    title="You stay in control"
                                    description="Nothing is permanently changed without your review. You can edit your profile information before saving."
                                />

                            </div>
                        </div>

                        {/* Upload */}
                        <div className="p-6 sm:p-10">

                            <h2 className="text-lg font-semibold text-slate-900">
                                Upload your resume
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                PDF, DOC or DOCX · Maximum 5 MB
                            </p>

                            {/* Drop zone */}
                            <div
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`mt-6 border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition
                  ${uploading
                                        ? "cursor-not-allowed bg-slate-50 border-slate-200"
                                        : "cursor-pointer border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/40"
                                    }
                `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!file ? (
                                    <>
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Upload className="w-6 h-6" />
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-slate-800">
                                            Click to upload your resume
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            or drag and drop your file here
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-slate-800 break-all">
                                            {file.name}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>

                                        {!uploading && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                    fileInputRef.current.value = "";
                                                }}
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                                Remove
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                                    <p className="text-xs text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Upload button */}
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing resume...
                                    </>
                                ) : (
                                    <>
                                        Upload & Continue
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Skip */}
                            <button
                                type="button"
                                onClick={goToDashboard}
                                disabled={uploading}
                                className="w-full mt-3 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
                            >
                                Skip for now
                            </button>

                            <p className="text-[11px] text-slate-400 text-center mt-3">
                                You can upload or update your resume later from your profile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center text-xs text-slate-400 mt-5">
                    You can always complete your profile later.
                </p>
            </div>
        </div>
    );
};

const Benefit = ({ icon, title, description }) => {
    return (
        <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-white border border-slate-200 text-emerald-600 flex items-center justify-center">
                {icon}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-800">
                    {title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ResumeOnboarding;