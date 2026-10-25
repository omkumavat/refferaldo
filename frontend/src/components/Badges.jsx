import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

export const VerificationBadge = ({ label = "Verified", className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
    data-testid="verification-badge"
  >
    <CheckCircle2 className="w-3 h-3" />
    {label}
  </span>
);

export const ReferralAvailableBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white" data-testid="referral-available-badge">
    <Sparkles className="w-3 h-3" />
    Referral available
  </span>
);

const stageStyle = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Submitted: "bg-teal-50 text-teal-700 border-teal-200",
  "reviewing": "bg-amber-50 text-amber-700 border-amber-200",
  Interview: "bg-slate-50 text-slate-700 border-slate-200",
  Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  referred: "bg-emerald-600 text-white border-emerald-600",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const stageLabel = {
  new: "Submitted",
  // Accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  // Submitted: "bg-teal-50 text-teal-700 border-teal-200",
  "reviewing": "Under Review",
  // Interview: "bg-slate-50 text-slate-700 border-slate-200",
  // Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  referred: "Referred",
  rejected: "Rejected",
};


export const StatusBadge = ({ stage }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stageStyle[stage] || "bg-slate-100 text-slate-700 border-slate-200"}`}
    data-testid={`status-badge-${stage?.toLowerCase().replace(/\s+/g, "-")}`}
  >
    {stageLabel[stage]}
  </span>
);
