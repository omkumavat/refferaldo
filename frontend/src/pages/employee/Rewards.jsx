import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { Gift, TrendingUp } from "lucide-react";
import { StatCard } from "../../components/StatCard";

const items = [
  { candidate: "Marcus Chen", role: "Lead DevOps Architect", company: "Datadog", amount: "₹75,000", status: "Paid", date: "Sep 04" },
  { candidate: "Priya V.", role: "Staff PD", company: "Figma", amount: "₹60,000", status: "Pending", date: "Sep 18" },
  { candidate: "Rahul S.", role: "Senior SWE", company: "Stripe", amount: "₹45,000", status: "In review", date: "Sep 17" },
];

export const EmployeeRewards = () => (
  <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rewards</h1>
    <p className="text-slate-600 mt-1 mb-6">Earnings from successful referrals.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard label="Total earned" value="₹75,000" icon={Gift} tone="emerald" />
      <StatCard label="Pending" value="₹1,05,000" icon={TrendingUp} />
      <StatCard label="Referrals successful" value="3" icon={Gift} tone="emerald" />
    </div>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{["Candidate", "Role", "Company", "Amount", "Status", "Date"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.candidate} className="border-b border-slate-100">
              <td className="px-5 py-3.5 font-medium text-slate-900">{r.candidate}</td>
              <td className="px-5 py-3.5 text-slate-700">{r.role}</td>
              <td className="px-5 py-3.5 text-slate-500">{r.company}</td>
              <td className="px-5 py-3.5 font-semibold text-emerald-700">{r.amount}</td>
              <td className="px-5 py-3.5"><span className={`chip ${r.status === "Paid" ? "chip-emerald" : ""}`}>{r.status}</span></td>
              <td className="px-5 py-3.5 text-slate-500">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
