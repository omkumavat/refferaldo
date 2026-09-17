import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { adminSidebar } from "./Dashboard";
import { jobs } from "../../data/jobs";
import { getCompanyById } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";

export const AdminJobs = () => (
  <DashboardShell role="admin" roleLabel="Referly Admin" sidebar={adminSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job moderation</h1>
    <p className="text-slate-600 mt-1 mb-6">Monitor all jobs and take action on reported ones.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200"><tr>{["Job", "Company", "Posted", "Status", "Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>
          {jobs.map((j) => {
            const c = getCompanyById(j.companyId);
            return (
              <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-medium text-slate-900">{j.title}</td>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2"><CompanyLogo company={c} size={28} /><span className="text-slate-700">{c?.name}</span></div></td>
                <td className="px-5 py-3.5 text-slate-500">{j.postedAgo}</td>
                <td className="px-5 py-3.5"><span className="chip-emerald">Live</span></td>
                <td className="px-5 py-3.5"><div className="flex gap-2"><button className="btn-ghost text-xs">Flag</button><button className="btn-ghost text-xs">Hide</button></div></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
