import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  Trophy,
  ArrowUpRight,
  LoaderCircle,
  RefreshCw,
  UserCheck,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ArrowLeft
} from "lucide-react";

import {
  getFormSubmissions,
  getBestMatches,
  updateSubmissionStatus,
  referCandidate,
} from "../../api/referralApi";
import { StatusBadge } from "../../components/Badges";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { SuccessCandidate } from "../../components/referral/SuccessCandidate";
import { ShowCandidateInfo } from "../../components/referral/showCandidateInfo";
import ApplicationInfoModal from "../../components/referral/ApplicationInfoModal";
import { ConfirmReferral } from "../../components/referral/ConfirmReferral"
import { ConfirmReject } from "../../components/referral/ConfirmReject"

const statusColors = {
  new: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  shortlisted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  referred: "bg-slate-50 text-slate-700",
  hired: "bg-green-100 text-green-800",
};

const ReferralAnalytics = () => {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId");

  const [tab, setTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [successCandidate, setSuccessCandidate] = useState(null);
  const [showCandidateInfo, setShowCandidateInfo] = useState(null);
  const [showApplicationInfo, setShowApplicationInfo] = useState(null);
  const [selectedReject, setSelectedReject] = useState(null);

  const [localUser] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [submissionResult, matchResult] = await Promise.all([
        getFormSubmissions(formId, {
          search,
          status,
          page: String(page),
          limit: "20",
        }),
        getBestMatches(formId),
      ]);

      setSubmissions(submissionResult.data || []);
      setTotal(submissionResult.pagination?.total || 0);
      matchResult?.data.push({
        submittedThroughForm: submissionResult?.data?.submissionResult?.data
      })
      setMatches(matchResult.data || []);
    } catch (err) {
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [formId, search, status, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const changeStatus = async (submissionId, nextStatus) => {
    setBusyId(submissionId);
    setError("");

    try {
      await updateSubmissionStatus(submissionId, nextStatus);
      await loadData();
    } catch (err) {
      setError(err.message || "Could not update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleViewProfile = async (item) => {
    const candidateId =
      item.candidate?._id || item.candidate;

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

  const handleRefer = async () => {

    if (!selected) return;

    const candidate = selected;
    setBusyId(candidate._id);
    setError("");

    try {
      await updateSubmissionStatus(candidate._id, "referred");

      setSelected(null);
      setShowCandidateInfo(false);
      setSuccessCandidate(candidate);

      await loadData();
    } catch (err) {
      setError(err.message || "Referral failed.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {

    if (!selectedReject) return;

    const candidate = selectedReject;
    setBusyId(candidate._id);
    setError("");

    try {
      await updateSubmissionStatus(candidate._id, "rejected");

      setSelectedReject(null);

      await loadData();
    } catch (err) {
      setError(err.message || "Referral failed.");
    } finally {
      setBusyId(null);
    }
  };


  const cards = [
    { label: "Applications", value: total, icon: Users },
    {
      label: "Shortlisted",
      value: submissions.filter(
        (item) => item.status === "shortlisted"
      ).length,
      icon: UserCheck,
    },
    {
      label: "Referred",
      value: submissions.filter(
        (item) => item.status === "referred"
      ).length,
      icon: ArrowUpRight,
    },
    { label: "Ranked candidates", value: matches.length, icon: Trophy },
  ];

  const renderCandidate = (item, rank) => {
    // console.log(showCandidateInfo, successCandidate);
    const submission = item.submission || item;
    const score = item.score ?? item.match?.score;
    const id = submission._id;
    console.log(submission);


    return (
      <tr key={id} className="border-t border-slate-100">
        <td className="px-4 py-4 text-sm text-slate-400">
          {rank ?? "—"}
        </td>

        <td className="px-4 py-4">
          <p className="font-semibold text-slate-900">
            {submission.name || submission.candidate?.name || "Candidate"}
          </p>
        </td>

        <td className="px-4 py-4">
          {score != null ? (
            <div className="min-w-24">
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {score}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, score))}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Not calculated</span>
          )}
        </td>

        <td className="px-4 py-4">
          <StatusBadge
            stage={submission.status || "new"}
          />
        </td>

        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === id}
              onClick={() => handleViewProfile(submission)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerland-500 disabled:opacity-50"
            >
              View Profile
            </button>

            {submission.submittedThroughForm && (
              <button
                type="button"
                onClick={() => setShowApplicationInfo(submission)}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                View Application
              </button>
            )}

            {
              submission.status != "referred" && (submission.status == "new"
                || submission.status == "reviewing") && (
                <button
                  type="button"
                  onClick={() => setSelectedReject(submission)}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-red hover:bg-red-700"
                >
                  Reject
                </button>
              )
            }

            {
              submission.status === "referred" && (
                <button
                  type="button"
                  disabled={busyId === id}
                  onClick={() => setShowCandidateInfo({
                    email: submission.email || submission.candidate?.email,
                    phone: submission.phone || submission.candidate?.phone,
                    name: submission.name || submission.candidate?.name,
                  })}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-emerland-50 disabled:opacity-50"
                >
                  View Personal Info
                </button>
              )
            }

            {submission.status !== "referred" &&
              submission.status !== "hired" &&
              submission.status !== "rejected" && (
                <button
                  type="button"
                  disabled={busyId === id}
                  onClick={() => setSelected(submission)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Refer
                </button>
              )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <DashboardShell
      role="employee"
      roleLabel="Employee"
      sidebar={employeeSidebar}
      userName={localUser.name}
    >
      <div className="max-w-6xl mx-auto">
        <header className="border-b border-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div>
              <Link
                to="/employee/referral/forms"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Refer a Job
              </Link>
              <h1 className="text-xl font-bold text-slate-900">
                Referral Analytics
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Review submissions and find the best candidates.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-7">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {cards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{label}</p>
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex gap-5 border-b border-slate-200 px-5">
              <button
                type="button"
                onClick={() => setTab("submissions")}
                className={`border-b-2 py-4 text-sm font-semibold ${tab === "submissions"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500"
                  }`}
              >
                All Submissions
              </button>

              <button
                type="button"
                onClick={() => setTab("matches")}
                className={`flex items-center gap-2 border-b-2 py-4 text-sm font-semibold ${tab === "matches"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500"
                  }`}
              >
                <Trophy size={15} /> Best Matches
              </button>
            </div>

            {tab === "submissions" && (
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    placeholder="Search candidate or email..."
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                >
                  <option value="all">All statuses</option>
                  {Object.keys(statusColors).map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <LoaderCircle className="animate-spin text-emerald-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Match</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(tab === "submissions"
                      ? submissions
                      : matches
                    ).map((item, index) =>
                      renderCandidate(
                        item,
                        tab === "matches" ? index + 1 : null
                      )
                    )}

                    {(tab === "submissions"
                      ? submissions
                      : matches
                    ).length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-14 text-center text-sm text-slate-500"
                          >
                            No candidates found.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "submissions" && total > 20 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {total} total submissions
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page * 20 >= total || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {selected && (
        <ConfirmReferral
          setSelected={setSelected}
          busyId={busyId}
          selected={selected}
          handleRefer={handleRefer}
        />
      )}

      {selectedReject && (
        <ConfirmReject
          setSelected={setSelectedReject}
          busyId={busyId}
          selected={selectedReject}
          handleReject={handleReject}
        />
      )}

      {showApplicationInfo && (
        <ApplicationInfoModal
          submission={showApplicationInfo}
          questions={showApplicationInfo.answers}
          onClose={() => setShowApplicationInfo(false)}
        />
      )}


      {/* Referral Success Modal */}
      {successCandidate && !showCandidateInfo && (
        <SuccessCandidate
          successCandidate={successCandidate}
          setSuccessCandidate={setSuccessCandidate}
          setShowCandidateInfo={setShowCandidateInfo}
        />
      )}

      {/* Candidate Personal Information Modal */}
      {showCandidateInfo && !successCandidate && (
        <ShowCandidateInfo
          showCandidateInfo={showCandidateInfo}
          setShowCandidateInfo={setShowCandidateInfo}
          setSuccessCandidate={setSuccessCandidate}
        />
      )}

    </DashboardShell>
  );
};

export default ReferralAnalytics;