import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { adminSidebar } from "./Dashboard";
import { referrals } from "../../data/referrals";
import { getCandidateById } from "../../data/candidates";
import { getJobById } from "../../data/jobs";
import { getEmployeeById } from "../../data/employees";
import { StatusBadge } from "../../components/Badges";

export const AdminReferrals = () => (
  <DashboardShell role="admin" roleLabel="refermy.life Admin" sidebar={adminSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Referral monitoring</h1>
    <p className="text-slate-600 mt-1 mb-6">Every referral submitted on the platform.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200"><tr>{["Candidate", "Referrer", "Role", "Date", "Status"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>
          {referrals.map((r) => {
            const cand = getCandidateById(r.candidateId);
            const emp = getEmployeeById(r.employeeId);
            const j = getJobById(r.jobId);
            return (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-medium text-slate-900">{cand?.name}</td>
                <td className="px-5 py-3.5 text-slate-700">{emp?.name}</td>
                <td className="px-5 py-3.5 text-slate-500">{j?.title}</td>
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
