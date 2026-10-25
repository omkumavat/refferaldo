import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { VerificationBadge } from "./Badges";


const getLocation = (job) => {
  // Greenhouse / generic API
  if (typeof job.location === "string") {
    return job.location;
  }

  if (Array.isArray(job.location)) {
    return job.location
      .map((location) => {
        if (typeof location === "string") return location;

        if (typeof location === "object") {
          return (
            location.name ||
            location.city ||
            location.location ||
            location.display_name ||
            ""
          );
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof job.location === "object" && job.location !== null) {
    return (
      job.location.name ||
      job.location.city ||
      job.location.location ||
      job.location.display_name ||
      "Location not specified"
    );
  }

  // Some portals may provide location differently
  if (job.locations) {
    if (typeof job.locations === "string") {
      return job.locations;
    }

    if (Array.isArray(job.locations)) {
      return job.locations
        .map((location) =>
          typeof location === "string"
            ? location
            : location?.name ||
            location?.city ||
            location?.location ||
            ""
        )
        .filter(Boolean)
        .join(", ");
    }
  }

  return "Location not specified";
};

const getDepartment = (job) => {
  return (
    job.department ||
    job.category ||
    job.team ||
    job.businessUnit
  );
};

const getExperience = (job) => {
  return (
    job.experience ||
    job.experienceLevel ||
    job.level ||
    job.seniority ||
    null
  );
};

const getSalary = (job) => {
  if (job.salary) return job.salary;

  if (job.compensation) return job.compensation;

  if (job.salaryRange) return job.salaryRange;

  return null;
};

export const JobCard = ({
  job,
  company,
  ctaLabel = "Request Referral",
  ctaTo,
  compact = false,
  applied = false,
  matchScore = null,
}) => {
  console.log(job)
  const location = getLocation(job);
  const department = getDepartment(job);
  const experience = getExperience(job);
  const salary = getSalary(job);

  const jobUrl =
    job.url ||
    job.jobUrl ||
    job.absolute_url ||
    `/jobs/${job.id || job._id}`;

  return (
    <div
      className="group card p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
      data-testid={`job-card-${job.id || job._id}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <CompanyLogo company={company} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <a
                href={jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[15px] font-semibold text-slate-900 group-hover:text-emerald-700 leading-snug"
              >
                {job.title}
              </a>

              <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                <span>
                  {company?.name ||
                    company?.companyname ||
                    job.companyname ||
                    "Company"}
                </span>

                {company?.verificationStatus === "success" && (
                  <VerificationBadge label="Verified" />
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-600 mt-1">
                Created by
                <span className="text-white">
                  { job?.createdBy?.name || "NA"}
                </span>

                {job?.createdBy?.verificationStatus === "success" && (
                  <VerificationBadge label="Verified" />
                )}
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[13px] text-slate-500">
            {
              location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )
            }

            {department && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {department}
              </span>
            )}

            {experience && (
              <span className="inline-flex items-center gap-1.5">
                {experience}
              </span>
            )}

            {salary && (
              <span className="inline-flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {salary}
              </span>
            )}
          </div>

          {/* Skills */}
          {!compact && Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* Footer */}
      <div className="mt-4 border-t border-slate-100 pt-4">
        {matchScore != null && (
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Skill match
            </span>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {matchScore}% match
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            {job.postedAgo ||
              job.postedDate ||
              job.createdAt ||
              "Recently posted"}
          </div>

          {applied ? (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Already Applied
            </button>
          ) : (
            <Link
              to={ctaTo || "/employee/candidates"}
              className="btn-primary shrink-0 px-3 py-2 text-xs"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};