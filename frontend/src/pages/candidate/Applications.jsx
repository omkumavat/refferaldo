import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { jobs, getJobById } from "../../data/jobs";
import { getCompanyById } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";
import { StatusBadge } from "../../components/Badges";

const applications = [
  { id: "a1", jobId: "j1", status: "Interview", applied: "Sep 10" },
  { id: "a2", jobId: "j3", status: "Under Review", applied: "Sep 08" },
  { id: "a3", jobId: "j7", status: "Submitted", applied: "Sep 05" },
  { id: "a4", jobId: "j10", status: "Rejected", applied: "Aug 22" },
];

export const CandidateApplications = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Applications</h1>
    <p className="text-slate-600 mt-1 mb-6">All roles you've applied to across referrals and direct applications.</p>
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => {
            const j = getJobById(a.jobId);
            const c = getCompanyById(j?.companyId);
            return (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-medium text-slate-900">{j?.title}</td>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2"><CompanyLogo company={c} size={28} /><span className="text-slate-700">{c?.name}</span></div></td>
                <td className="px-5 py-3.5 text-slate-500">{a.applied}</td>
                <td className="px-5 py-3.5"><StatusBadge stage={a.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
