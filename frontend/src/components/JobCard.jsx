import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, IndianRupee } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { MatchPill } from "./MatchScore";
import { ReferralAvailableBadge, VerificationBadge } from "./Badges";
import { getCompanyById } from "../data/companies";

export const JobCard = ({ job, ctaLabel = "Request Referral", ctaTo, compact = false }) => {
  const company = getCompanyById(job.companyId);
  const to = ctaTo || `/jobs/${job.id}`;
  return (
    <div
      className="group card p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
      data-testid={`job-card-${job.id}`}
    >
      <div className="flex items-start gap-3">
        <CompanyLogo company={company} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/jobs/${job.id}`}
                className="block text-[15px] font-semibold text-slate-900 group-hover:text-emerald-700 leading-snug"
              >
                {job.title}
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-0.5">
                <span>{company?.name}</span>
                {company?.verified && <VerificationBadge label="Verified" />}
              </div>
            </div>
            <MatchPill value={job.match} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[13px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {job.workMode} · {job.experience}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" /> {job.salary}
            </span>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 4).map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" /> {job.postedAgo}
          {job.referralAvailable && <ReferralAvailableBadge />}
        </div>
        <Link
          to={to}
          className="btn-primary text-xs py-2 px-3"
          data-testid={`job-referral-cta-${job.id}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
};
