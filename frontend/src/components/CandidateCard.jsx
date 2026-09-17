import React from "react";
import { MapPin, Briefcase, FileText } from "lucide-react";
import { MatchPill } from "./MatchScore";
import { VerificationBadge } from "./Badges";

export const CandidateCard = ({ candidate, onView, onRefer }) => (
  <div
    className="card p-5 hover:border-slate-300 hover:shadow-sm transition-all"
    data-testid={`candidate-card-${candidate.id}`}
  >
    <div className="flex items-start gap-4">
      <img
        src={candidate.photo}
        alt={candidate.name}
        className="w-12 h-12 rounded-full object-cover border border-slate-200"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">{candidate.name}</h3>
            <p className="text-sm text-slate-600">{candidate.headline}</p>
          </div>
          <MatchPill value={candidate.match} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[13px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {candidate.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> {candidate.experience}
          </span>
          {candidate.verifications?.email && <VerificationBadge label="Verified" />}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {candidate.skills.slice(0, 4).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
      <button
        className="btn-ghost text-xs"
        onClick={() => onView?.(candidate)}
        data-testid={`view-candidate-${candidate.id}`}
      >
        <FileText className="w-3.5 h-3.5" /> View profile
      </button>
      <button
        className="btn-primary text-xs py-2 px-3"
        onClick={() => onRefer?.(candidate)}
        data-testid={`refer-candidate-${candidate.id}`}
      >
        Refer candidate
      </button>
    </div>
  </div>
);
