import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { employees } from "../../data/employees";
import { VerificationBadge } from "../../components/Badges";

export const CompanyEmployees = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h1>
    <p className="text-slate-600 mt-1 mb-6">Verified employees in your referral network.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{["Name", "Role", "Email", "Status", "Referrals", "Hires"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-5 py-3.5 font-medium text-slate-900">{e.name}</td>
              <td className="px-5 py-3.5 text-slate-700">{e.role}</td>
              <td className="px-5 py-3.5 text-slate-500">{e.email}</td>
              <td className="px-5 py-3.5">{e.verified ? <VerificationBadge label="Verified" /> : <span className="chip bg-amber-50 text-amber-700 border-amber-200">Pending</span>}</td>
              <td className="px-5 py-3.5 text-slate-700">{e.referrals}</td>
              <td className="px-5 py-3.5 text-emerald-700 font-medium">{e.hires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
