import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { JobCard } from "../../components/JobCard";
import { jobs } from "../../data/jobs";

export const CandidateJobs = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find Jobs</h1>
    <p className="text-slate-600 mt-1 mb-6">{jobs.length} roles matching your profile.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {jobs.map((j) => <JobCard key={j.id} job={j} />)}
    </div>
  </DashboardShell>
);
