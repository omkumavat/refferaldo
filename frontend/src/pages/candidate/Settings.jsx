import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";

const sections = ["Account", "Profile", "Notifications", "Privacy", "Security", "Email preferences"];

export const CandidateSettings = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
    <p className="text-slate-600 mt-1 mb-6">Manage your account preferences.</p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <ul className="space-y-1">
        {sections.map((s, i) => (
          <li key={s}>
            <button className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${i === 0 ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}>{s}</button>
          </li>
        ))}
      </ul>
      <div className="md:col-span-3 card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600">Full name</label>
          <input className="field mt-1" defaultValue="Rahul Sharma" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Email</label>
          <input className="field mt-1" defaultValue="rahul@example.com" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Location</label>
          <input className="field mt-1" defaultValue="Bangalore, India" />
        </div>
        <button className="btn-primary" data-testid="save-settings-btn">Save changes</button>
      </div>
    </div>
  </DashboardShell>
);
