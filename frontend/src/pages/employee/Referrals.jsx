import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { referrals } from "../../data/referrals";
import { getJobById } from "../../data/jobs";
import { getCandidateById } from "../../data/candidates";
import { StatusBadge } from "../../components/Badges";

export const EmployeeReferrals = () => (
  <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Referrals</h1>
    <p className="text-slate-600 mt-1 mb-6">Every candidate you've referred internally.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((r) => {
            const cand = getCandidateById(r.candidateId);
            const job = getJobById(r.jobId);
            return (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-5 py-3.5"><div className="flex items-center gap-2"><img src={cand?.photo} className="w-8 h-8 rounded-full object-cover" alt="" /><span className="font-medium text-slate-900">{cand?.name}</span></div></td>
                <td className="px-5 py-3.5 text-slate-700">{job?.title}</td>
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
