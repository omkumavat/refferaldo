
import React from "react";
import { MapPin, Briefcase, FileText, Send } from "lucide-react";
import { VerificationBadge } from "./Badges";

const handleViewProfile = async (item) => {
  console.log("Viewing profile for candidate:", item);
  const candidateId =
    item?.id || item.candidate;

  // Adapt this path to your existing candidate profile route.
  const profileUrl = candidateId
    ? `/candidate/profile/${candidateId}/public`
    : `/applications/${item._id}`;

  // Open synchronously from the click to avoid popup blocking.
  const newTab = window.open(profileUrl, "_blank");

  try {
    if (item.status === "new") {
      await changeStatus(item._id, "reviewing");
    }
  } catch (err) {
    newTab?.close();
    throw err;
  }
};

export const CandidateCard = ({ candidate, onView, onRefer }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-6">
    <div className="flex items-start gap-4">
      {candidate.photo ? (
        <img
          src={candidate.photo}
          alt={candidate.name}
          className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl font-bold text-emerald-700">
          {candidate.name?.charAt(0)?.toUpperCase() || "C"}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {candidate.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {candidate.headline || "Job seeker"}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <Send size={12} />
            {candidate.referralCount ?? 0} referrals
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          {candidate.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} />
              {candidate.location}
            </span>
          )}

          {candidate.experience && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={14} />
              {candidate.experience}
            </span>
          )}

          {candidate.verifications?.email && (
            <VerificationBadge label="Email verified" />
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(candidate.skills || []).slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}

          {(candidate.skills || []).length > 5 && (
            <span className="px-1 py-1 text-xs text-slate-400">
              +{candidate.skills.length - 5} more
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => handleViewProfile(candidate)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <FileText size={16} />
        View profile
      </button>

      <button
        type="button"
        onClick={() => onRefer?.(candidate)}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <Send size={15} />
        Refer candidate
      </button>
    </div>
  </div>
);

export default CandidateCard;
