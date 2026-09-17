import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";

export const CompanySettings = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company settings</h1>
    <div className="card p-6 mt-6 space-y-4 max-w-xl">
      <div><label className="text-xs font-semibold text-slate-600">Company name</label><input className="field mt-1" defaultValue="Stripe" /></div>
      <div><label className="text-xs font-semibold text-slate-600">Domain</label><input className="field mt-1" defaultValue="stripe.com" /></div>
      <div><label className="text-xs font-semibold text-slate-600">Referral reward policy</label><textarea className="field mt-1 min-h-[100px]" defaultValue="₹50,000 paid on successful hire. Vested over 6 months." /></div>
      <button className="btn-primary">Save</button>
    </div>
  </DashboardShell>
);
