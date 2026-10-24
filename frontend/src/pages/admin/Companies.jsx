import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { adminSidebar } from "./Dashboard";
import { companies } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";

export const AdminCompanies = () => (
  <DashboardShell role="admin" roleLabel="refermy.life Admin" sidebar={adminSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company verifications</h1>
    <p className="text-slate-600 mt-1 mb-6">Approve or reject new employer accounts.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200"><tr>{["Company", "Industry", "HQ", "Referrers", "Actions"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-5 py-3.5"><div className="flex items-center gap-2"><CompanyLogo company={c} size={32} /><span className="font-medium text-slate-900">{c.name}</span></div></td>
              <td className="px-5 py-3.5 text-slate-500">{c.industry}</td>
              <td className="px-5 py-3.5 text-slate-500">{c.hq}</td>
              <td className="px-5 py-3.5 text-slate-700 font-medium">{c.referrers}</td>
              <td className="px-5 py-3.5"><div className="flex gap-2"><button className="btn-ghost text-xs">Details</button><button className="btn-primary text-xs py-1.5 px-3">Verify</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
