import React from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { jobs } from "../../data/jobs";
import { PlusCircle, MoreHorizontal } from "lucide-react";

export const CompanyJobs = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Jobs</h1>
        <p className="text-slate-600 mt-1">{jobs.length} active postings</p>
      </div>
      <Link to="/company/jobs/create" className="btn-primary"><PlusCircle className="w-4 h-4" /> Post new job</Link>
    </div>
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>{["Job", "Location", "Applicants", "Referrals", "Status", "Posted", ""].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-b border-slate-100 hover:bg-slate-50/70">
              <td className="px-5 py-3.5"><Link to={`/company/jobs/${j.id}`} className="font-medium text-slate-900 hover:text-emerald-700">{j.title}</Link><p className="text-xs text-slate-500 mt-0.5">{j.department}</p></td>
              <td className="px-5 py-3.5 text-slate-500">{j.location}</td>
              <td className="px-5 py-3.5 text-slate-700 font-medium">{Math.floor(Math.random() * 60) + 20}</td>
              <td className="px-5 py-3.5 text-emerald-700 font-medium">{Math.floor(Math.random() * 20) + 3}</td>
              <td className="px-5 py-3.5"><span className="chip-emerald">Active</span></td>
              <td className="px-5 py-3.5 text-slate-500">{j.postedAgo}</td>
              <td className="px-5 py-3.5 text-right"><button className="p-1 rounded hover:bg-slate-100"><MoreHorizontal className="w-4 h-4 text-slate-400" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardShell>
);
    