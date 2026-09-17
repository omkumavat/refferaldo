import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { JobCard } from "../../components/JobCard";
import { jobs } from "../../data/jobs";

export const CandidateSaved = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Saved Jobs</h1>
    <p className="text-slate-600 mt-1 mb-6">Roles you've bookmarked for later.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {jobs.slice(0, 3).map((j) => <JobCard key={j.id} job={j} />)}
    </div>
  </DashboardShell>
);
