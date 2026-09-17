import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { notifications } from "../../data/notifications";
import { CheckCircle2, Info } from "lucide-react";

export const EmployeeNotifications = () => (
  <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
    <div className="card divide-hair mt-6">
      {notifications.map((n) => (
        <div key={n.id} className={`p-5 flex gap-4 ${!n.read && "bg-emerald-50/30"}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${n.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{n.tone === "success" ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between"><p className="font-semibold text-slate-900 text-sm">{n.title}</p><span className="text-xs text-slate-400">{n.time}</span></div>
            <p className="text-sm text-slate-600 mt-0.5">{n.body}</p>
          </div>
        </div>
      ))}
    </div>
  </DashboardShell>
);

export const EmployeeSettings = () => (
  <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
    <div className="card p-6 mt-6 space-y-4">
      <div><label className="text-xs font-semibold text-slate-600">Name</label><input className="field mt-1" defaultValue="Priya Mehta" /></div>
      <div><label className="text-xs font-semibold text-slate-600">Work email</label><input className="field mt-1" defaultValue="priya@stripe.com" /></div>
      <button className="btn-primary">Save changes</button>
    </div>
  </DashboardShell>
);
