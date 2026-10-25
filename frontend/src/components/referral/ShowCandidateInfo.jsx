import { Mail, Phone, X, Copy, Check } from "lucide-react";
import { useState } from "react"
export const ShowCandidateInfo = ({ showCandidateInfo, setShowCandidateInfo, setSuccessCandidate }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const copyInfo = async (data) => {

        try {
            await navigator.clipboard.writeText(data);
            setCopiedIndex(data);

            window.setTimeout(() => {
                setCopiedIndex((current) =>
                    current === data ? null : current
                );
            }, 2000);
        } catch (err) {
            console.error("Failed to copy referral link:", err);
            window.prompt("Copy your referral link:", url);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="candidate-info-title"
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    onClick={() => {
                        setShowCandidateInfo(null);
                        setSuccessCandidate(null);
                    }}
                    aria-label="Close candidate information"
                    className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 border-b border-slate-100 pb-6 pr-8">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white">
                        {(showCandidateInfo.name ||
                            showCandidateInfo.candidate?.name ||
                            "C")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h2
                            id="candidate-info-title"
                            className="text-xl font-bold text-slate-900"
                        >
                            Candidate details
                        </h2>
                        <p className="mt-1 truncate text-sm text-slate-500">
                            {showCandidateInfo.name ||
                                showCandidateInfo.candidate?.name ||
                                "Candidate"}
                        </p>
                    </div>
                </div>

                {(() => {
                    const candidate = showCandidateInfo.candidate || {};
                    const details = [
                        {
                            label: "Email address",
                            value: showCandidateInfo.email || candidate.email,
                            icon: Mail,
                        },
                        // {
                        //     label: "Phone number",
                        //     value: showCandidateInfo.phone || candidate.phone,
                        //     icon: Phone,
                        // },
                        // {
                        //   label: "Location",
                        //   value: showCandidateInfo.location || candidate.location,
                        //   icon: MapPin,
                        // },
                        // {
                        //   label: "Current position",
                        //   value:
                        //     showCandidateInfo.currentPosition ||
                        //     showCandidateInfo.currentPosition,
                        //   icon: Briefcase,
                        // },
                    ];

                    return (
                        <div className="mt-6 space-y-3">
                            {details.map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-4"
                                >
                                    <div className="mt-0.5 text-emerald-600">
                                        <Icon size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-slate-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                            {value || "Not provided"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => copyInfo(value)}
                                        title={copiedIndex === value ? "Copied!" : `Copy ${label}`}
                                        className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-emerland-100 hover:text-slate-700 transition-colors"
                                    >
                                        {copiedIndex === value ? (
                                            <Check size={16} className="text-green-600" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    );
                })()}

                <button
                    type="button"
                    onClick={() => {
                        setShowCandidateInfo(null);
                        setSuccessCandidate(null);
                    }}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Close
                </button>
            </div>
        </div>
    )
}