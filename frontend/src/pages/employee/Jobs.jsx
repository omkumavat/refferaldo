import React, { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { JobCard } from "../../components/JobCard";
import { ShieldCheck, Clock3 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export const EmployeeJobs = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localUser] = useState(
    JSON.parse(
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
    )
  );

  useEffect(() => {
    const fetchCompanyJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/company/get-jobs/${localUser?.id}`, {
          method: "GET",
          credentials: "include",
        }
        );

        const result = await response.json();
        console.log(result);
        

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch company details");
        }

        setCompany(result.data.company);

        // Do NOT show jobs if company isn't verified
        if (!result.data?.verified) {
          setJobs([]);
          return;
        }

        setJobs(result.data?.jobs || []);
      } catch (err) {
        console.error("Failed to fetch company jobs:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, []);

  return (
    <DashboardShell
    userName={localUser?.name}
      role="employee"
      roleLabel="Employee"
      sidebar={employeeSidebar}
    >
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Open jobs at your company
      </h1>

      <p className="text-slate-600 mt-1 mb-6">
        Refer candidates you know for any of these roles.
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Unable to load jobs
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>
        </div>
      )}

      {/* Company verification pending */}
      {!loading &&
        !error &&
        company &&
        !company.verified && (
          <div className="card max-w-2xl mx-auto p-8 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
              alt="Verification pending"
              className="w-28 h-28 mx-auto mb-5 object-contain"
            />

            <div className="flex justify-center mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                <Clock3 className="w-4 h-4" />
                Verification Pending
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              Company verification is pending
            </h2>

            <p className="text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Jobs from{" "}
              <span className="font-semibold text-slate-800">
                {company.name || company.companyname || "your company"}
              </span>{" "}
              will be available here once the company has been verified.
            </p>

            <p className="text-sm text-slate-500 mt-4">
              Please check back later.
            </p>
          </div>
        )}

      {/* Verified company + jobs */}
      {!loading &&
        !error &&
        company?.verified &&
        jobs.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />

              <span className="text-sm text-slate-600">
                Jobs from{" "}
                <span className="font-semibold text-slate-900">
                  {company.name || company.companyname}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {jobs.map((job, index) => (
                <JobCard
                  key={job.id || job._id || job.url || index}
                  job={job}
                  company={company}
                  ctaLabel="Refer a candidate"
                  ctaTo="/employee/candidates"
                />
              ))}
            </div>
          </>
        )}

      {/* Verified but no jobs */}
      {!loading &&
        !error &&
        company?.verified &&
        jobs.length === 0 && (
          <div className="card p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No open jobs found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              There are currently no open positions available for referral.
            </p>
          </div>
        )}
    </DashboardShell>
  );
};