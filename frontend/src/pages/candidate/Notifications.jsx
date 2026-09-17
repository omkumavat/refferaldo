import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { notifications } from "../../data/notifications";
import { CheckCircle2, Info } from "lucide-react";

export const CandidateNotifications = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
    <p className="text-slate-600 mt-1 mb-6">Everything happening on your Referly account.</p>
    <div className="card divide-hair">
      {notifications.map((n) => (
        <div key={n.id} className={`p-5 flex gap-4 ${!n.read && "bg-emerald-50/30"}`} data-testid={`notif-${n.id}`}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${n.tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
            {n.tone === "success" ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-900 text-sm">{n.title}</p>
              <span className="text-xs text-slate-400">{n.time}</span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{n.body}</p>
          </div>
        </div>
      ))}
    </div>
  </DashboardShell>
);
