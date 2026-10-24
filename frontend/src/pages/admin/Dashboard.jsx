import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { LayoutDashboard, Users, Building2, UserCheck, Briefcase, Send, ShieldCheck, Flag } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { companies } from "../../data/companies";
import { employees } from "../../data/employees";
import { CompanyLogo } from "../../components/CompanyLogo";

const sidebar = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/companies", label: "Companies", icon: Building2 },
  { to: "/admin/employees", label: "Employees", icon: UserCheck },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/referrals", label: "Referrals", icon: Send },
];

export const adminSidebar = sidebar;

export const AdminDashboard = () => (
  <DashboardShell role="admin" roleLabel="refermy.life Admin" userName="Admin" sidebar={sidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform overview</h1>
    <p className="text-slate-600 mt-1 mb-6">Trust & safety across the refermy.life network.</p>
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <StatCard label="Users" value="12,842" icon={Users} />
      <StatCard label="Companies" value="284" icon={Building2} />
      <StatCard label="Verified Employees" value="4,127" icon={ShieldCheck} tone="emerald" />
      <StatCard label="Jobs" value="1,342" icon={Briefcase} />
      <StatCard label="Referrals" value="18,204" icon={Send} tone="emerald" />
      <StatCard label="Fraud flags" value="7" icon={Flag} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Pending company verification</h2>
        <div className="divide-hair">
          {companies.slice(0, 4).map((c) => (
            <div key={c.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3"><CompanyLogo company={c} /><div><p className="text-sm font-medium text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.website}</p></div></div>
              <div className="flex gap-2"><button className="btn-ghost text-xs">Reject</button><button className="btn-primary text-xs py-1.5 px-3">Approve</button></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Pending employee verification</h2>
        <div className="divide-hair">
          {employees.filter((e) => !e.verified).concat(employees.slice(0, 3)).slice(0, 4).map((e, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div><p className="text-sm font-medium text-slate-900">{e.name}</p><p className="text-xs text-slate-500">{e.email}</p></div>
              <div className="flex gap-2"><button className="btn-ghost text-xs">Reject</button><button className="btn-primary text-xs py-1.5 px-3">Approve</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardShell>
);
