
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, RefreshCw, Users } from "lucide-react";

import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { CandidateCard } from "../../components/CandidateCard";
import CandidateReferModal from "../../components/referral/CandidateReferModal";
import { getMostReferredCandidates } from "../../api/referralApi";
import { SuccessCandidate } from "../../components/referral/SuccessCandidate";
import { ShowCandidateInfo } from "../../components/referral/showCandidateInfo";

export const EmployeeCandidates = () => {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successCandidate, setSuccessCandidate] = useState(null);
  const [showCandidateInfo, setShowCandidateInfo] = useState(null);
  const [localUser] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  );

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMostReferredCandidates();
      setCandidates(response.data || []);
    } catch (err) {
      setError(err.message || "Unable to load candidates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  return (
    <DashboardShell
      role="employee"
      roleLabel="Employee"
      userName={localUser.name}
      sidebar={employeeSidebar}
    >
      <div className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-7">
          {/* Page heading */}
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> */}
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Talent discovery
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Candidates
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover frequently referred job seekers and refer them
              to any active role at your company.
            </p>
          </div>


          {error && (
            <div
              role="alert"
              className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={loadCandidates}
                className="shrink-0 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Candidate grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
              <LoaderCircle
                size={30}
                className="animate-spin text-emerald-600"
              />
              <p className="mt-4 text-sm text-slate-500">
                Finding candidates...
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Users
                size={32}
                className="mx-auto text-slate-400"
              />
              <h2 className="mt-4 font-semibold text-slate-900">
                No Eligible candidates for your company yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Candidates will appear here once they have linked
                accounts and recorded referrals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onView={() =>
                    navigate(`/candidate/profile/${candidate.id}/public`)
                  }
                  onRefer={() => setSelectedCandidate(candidate)}
                />
              ))}
            </div>
          )}

          {/* Refer candidate modal */}
          {selectedCandidate && (
            <CandidateReferModal
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              onSuccess={(candidate) => {
                setSelectedCandidate(null);
                setSuccessCandidate(candidate || selectedCandidate);
                setShowCandidateInfo(null);
                loadCandidates();
              }}
            />
          )}
        </div>
      </div>
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

export default EmployeeCandidates;
