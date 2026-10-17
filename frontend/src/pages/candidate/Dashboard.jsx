import React from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { LayoutDashboard, Briefcase, FileText, Send, Bookmark, User, Bell, Settings } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { JobCard } from "../../components/JobCard";
import { jobs } from "../../data/jobs";
import { referrals } from "../../data/referrals";
import { getJobById } from "../../data/jobs";
import { getCompanyById } from "../../data/companies";
import { StatusBadge } from "../../components/Badges";

const sidebar = [
  { to: "/candidate/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/candidate/jobs", label: "Find Jobs", icon: Briefcase },
  { to: "/candidate/applications", label: "Applications", icon: FileText },
  { to: "/candidate/referrals", label: "Referrals", icon: Send },
  { to: "/candidate/saved", label: "Saved Jobs", icon: Bookmark },
  { to: "/candidate/profile/", label: "Profile", icon: User ,requiresId: true},
  { to: "/candidate/notifications", label: "Notifications", icon: Bell },
  { to: "/candidate/settings", label: "Settings", icon: Settings },
];

export const candidateSidebar = sidebar;
const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

export const CandidateDashboard = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" userName={user.name} sidebar={sidebar}>
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Good morning, {user.name} </h1>
      <p className="text-slate-600 mt-1">Here's what's happening with your job search.</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Applications" value="12" delta="+3" icon={FileText} />
      <StatCard label="Referral Requests" value="4" icon={Send} tone="emerald" />
      <StatCard label="Referrals Received" value="2" icon={Briefcase} tone="emerald" />
      <StatCard label="Interviews" value="3" delta="+1" icon={User} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recommended for you</h2>
            <Link to="/candidate/jobs" className="text-xs font-semibold text-emerald-700">View all →</Link>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {jobs.slice(0, 4).map((j) => <JobCard key={j.id} job={j} compact />)}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Referral activity</h2>
          <div className="divide-hair">
            {referrals.slice(0, 4).map((r) => {
              const job = getJobById(r.jobId);
              const company = getCompanyById(r.companyId);
              return (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{job?.title}</p>
                    <p className="text-xs text-slate-500">{company?.name} · {r.createdAt}</p>
                  </div>
                  <StatusBadge stage={r.stage} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900">Profile completion</h3>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-2"><span className="text-slate-600">85% complete</span><span className="font-semibold text-emerald-700">85%</span></div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} /></div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Add your GitHub profile to improve your match score.</p>
          <Link to="/candidate/profile" className="btn-secondary w-full justify-center mt-4 text-xs">Edit profile</Link>
        </div>
        <div className="card p-6 border-emerald-200 bg-emerald-50/40">
          <p className="eyebrow">Tip</p>
          <p className="text-sm text-slate-700 mt-2">Candidates with 3+ referral requests get hired 4x faster on average.</p>
          <Link to="/candidate/jobs" className="btn-primary w-full justify-center mt-3 text-xs">Request more referrals</Link>
        </div>
      </aside>
    </div>
  </DashboardShell>
);
