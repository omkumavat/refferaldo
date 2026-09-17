import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { referrals } from "../../data/referrals";
import { getCandidateById } from "../../data/candidates";
import { getJobById } from "../../data/jobs";
import { getEmployeeById } from "../../data/employees";
import { StatusBadge } from "../../components/Badges";
import { MatchPill } from "../../components/MatchScore";

export const CompanyReferrals = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Referrals pipeline</h1>
    <p className="text-slate-600 mt-1 mb-6">Every candidate submitted through your employees.</p>
    <div className="card p-4 mb-4 flex flex-wrap gap-3">
      <select className="field w-auto"><option>All jobs</option></select>
      <select className="field w-auto"><option>All statuses</option></select>
      <select className="field w-auto"><option>All employees</option></select>
      <input className="field w-auto flex-1 min-w-[200px]" placeholder="Search candidate..." />
    </div>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{["Candidate", "Role", "Referrer", "Match", "Date", "Status"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {referrals.map((r) => {
            const cand = getCandidateById(r.candidateId);
            const job = getJobById(r.jobId);
            const emp = getEmployeeById(r.employeeId);
            return (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/70 cursor-pointer">
                <td className="px-5 py-3.5"><div className="flex items-center gap-2"><img src={cand?.photo} alt="" className="w-8 h-8 rounded-full object-cover" /><span className="font-medium text-slate-900">{cand?.name}</span></div></td>
                <td className="px-5 py-3.5 text-slate-700">{job?.title}</td>
                <td className="px-5 py-3.5 text-slate-500">{emp?.name}</td>
                <td className="px-5 py-3.5"><MatchPill value={cand?.match || 0} /></td>
                <td className="px-5 py-3.5 text-slate-500">{r.createdAt}</td>
                <td className="px-5 py-3.5"><StatusBadge stage={r.stage} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
