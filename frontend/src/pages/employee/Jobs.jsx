import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { JobCard } from "../../components/JobCard";
import { jobs } from "../../data/jobs";

export const EmployeeJobs = () => (
  <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Open jobs at your company</h1>
    <p className="text-slate-600 mt-1 mb-6">Refer candidates you know for any of these roles.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {jobs.slice(0, 6).map((j) => <JobCard key={j.id} job={j} ctaLabel="Refer a candidate" ctaTo="/employee/candidates" />)}
    </div>
  </DashboardShell>
);
