
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { StatusBadge } from "../../components/Badges";
import ApplicationInfoModal from "../../components/referral/ApplicationInfoModal";
import {
  FileText,
  ExternalLink,
  RefreshCw,
  ClipboardList,
  Building2,
  UserRound,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCreatorName = (form) => {
  const creator = form?.createdBy || form?.employee || form?.user;

  if (typeof creator === "string") return creator;

  return (
    creator?.name ||
    creator?.fullName ||
    form?.creatorName ||
    "Not available"
  );
};

const getCompanyName = (form) => {
  const company = form?.company;

  if (typeof company === "string") return company;

  return (
    company?.companyname ||
    company?.name ||
    form?.companyName ||
    "Not available"
  );
};

const getRoleTitle = (form) =>
  form?.roleName ||
  form?.jobTitle ||
  form?.title ||
  form?.position ||
  "Untitled role";

const getFormUrl = (form, submission) => {
  const identifier = form?._id || form?.slug;

  if (!identifier) return null;

  // Opens the associated referral form in a new tab.
  return `/apply/${identifier}`;
};

export const CandidateApplications = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplicationInfo, setShowApplicationInfo] = useState(null);
  const [localUser] = useState(
    JSON.parse(
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
    )
  );

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/candidate/referrals/submissions/${localUser?.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load your submissions."
        );
      }

      setSubmissions(
        Array.isArray(data)
          ? data
          : data.submissions || data.data || []
      );
    } catch (err) {
      console.error("Failed to fetch candidate submissions:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <DashboardShell
      role="candidate"
      userName={localUser.name}
      roleLabel="Candidate"
      sidebar={candidateSidebar}
    >
      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Submissions
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              View the referral forms you have submitted and track their
              current status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSubmissions}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  Total submissions
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "—" : submissions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  Awaiting review
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading
                    ? "—"
                    : submissions.filter((submission) =>
                      ["new", "reviewing"].includes(
                        String(submission.status || "").toLowerCase()
                      )
                    ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="flex-1 text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchSubmissions}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Submissions table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Submitted referral forms
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your submitted forms and their latest recorded status.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading your submissions...
            </div>
          ) : error && submissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Unable to load submissions. Please try again.
            </div>
          ) : submissions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No submissions yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When you submit a referral form, it will appear here so you
                can review its details and track its status.
              </p>
              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Explore opportunities
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    {[
                      "Job title",
                      "Company",
                      "Form created by",
                      "Submitted date",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {submissions.map((submission) => {
                    const form = submission.form || {};
                    const formUrl = getFormUrl(form, submission);

                    return (
                      <tr
                        key={submission._id || submission.id}
                        className="transition"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {getRoleTitle(form)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Referral application
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                            {getCompanyName(form)}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-700">
                            <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                            {getCreatorName(form)}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {formatDate(
                              submission.createdAt ||
                              submission.submittedAt
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            stage={submission.status || "new"}
                          />
                        </td>

                        <td className="px-5 py-4">
                          {submission.submittedThroughForm ? (
                            <button
                              type="button"
                              onClick={() => setShowApplicationInfo(submission)}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              View Application
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Form unavailable (Direct referral)
                            </span>
                          )}

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showApplicationInfo && (
        <ApplicationInfoModal
          submission={showApplicationInfo}
          questions={showApplicationInfo.answers}
          onClose={() => setShowApplicationInfo(false)}
        />
      )}
    </DashboardShell>
  );
};
