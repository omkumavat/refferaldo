import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { adminSidebar } from "./Dashboard";
import { candidates } from "../../data/candidates";
import { employees } from "../../data/employees";

export const AdminUsers = () => (
  <DashboardShell role="admin" roleLabel="Referly Admin" sidebar={adminSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
    <p className="text-slate-600 mt-1 mb-6">Every account across candidates and employees.</p>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200"><tr>{["User", "Type", "Location / Role", "Status"].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-5 py-3.5"><div className="flex items-center gap-2"><img src={c.photo} className="w-8 h-8 rounded-full object-cover" alt="" /><span className="font-medium text-slate-900">{c.name}</span></div></td>
              <td className="px-5 py-3.5"><span className="chip">Candidate</span></td>
              <td className="px-5 py-3.5 text-slate-500">{c.location}</td>
              <td className="px-5 py-3.5"><span className="chip-emerald">Verified</span></td>
            </tr>
          ))}
          {employees.map((e) => (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-5 py-3.5 font-medium text-slate-900">{e.name}</td>
              <td className="px-5 py-3.5"><span className="chip">Employee</span></td>
              <td className="px-5 py-3.5 text-slate-500">{e.role}</td>
              <td className="px-5 py-3.5">{e.verified ? <span className="chip-emerald">Verified</span> : <span className="chip bg-amber-50 text-amber-700 border-amber-200">Pending</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
