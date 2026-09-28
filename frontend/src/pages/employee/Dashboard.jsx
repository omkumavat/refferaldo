import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { LayoutDashboard, Users, Send, Briefcase, Gift, ShieldCheck, Bell, Settings,User } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { CandidateCard } from "../../components/CandidateCard";
import { candidates } from "../../data/candidates";
import { toast } from "sonner";

const sidebar = [
  { to: "/employee/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/employee/jobs", label: "Company Jobs", icon: Briefcase },
  { to: "/employee/refer-job", label: "Refer a Job", icon: Briefcase },
  { to: "/employee/candidates", label: "Candidates", icon: Users },
  { to: "/employee/referrals", label: "My Referrals", icon: Send },
  { to: "/employee/rewards", label: "Rewards", icon: Gift },
  { to: "/employee/verify", label: "Verify Employment", icon: ShieldCheck },
  { to: "/employee/notifications", label: "Notifications", icon: Bell },
  { to: "/employee/settings", label: "Settings", icon: Settings },
   { to: "/employee/profile", label: "Profile", icon: User },
];

export const employeeSidebar = sidebar;

export const EmployeeDashboard = () => {
  const [modal, setModal] = useState(null);
  const [user] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  )
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    toast.success("Referral submitted");
    setTimeout(() => { setModal(null); setSubmitted(false); setConfirmed(false); }, 2000);
  };

  return (
    <DashboardShell role="employee" roleLabel="Employee" userName={user?.name} sidebar={sidebar}>
      <div className="mb-8">
        <p className="eyebrow">Employee Referral Center</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">Refer great people. Get rewarded.</h1>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Open Jobs" value="24" icon={Briefcase} />
        <StatCard label="Referral Requests" value="18" icon={Send} tone="emerald" />
        <StatCard label="My Referrals" value="11" icon={Users} />
        <StatCard label="Successful Hires" value="3" icon={ShieldCheck} tone="emerald" />
        <StatCard label="Potential Rewards" value="₹45,000" icon={Gift} tone="emerald" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Candidates requesting referrals</h2>
        <Link to="/employee/candidates" className="text-xs font-semibold text-emerald-700">View all →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {candidates.slice(0, 4).map((c) => (
          <CandidateCard key={c.id} candidate={c} onRefer={setModal} onView={() => window.location.assign(`/employee/candidates/${c.id}`)} />
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {!submitted ? (
              <>
                <h3 className="text-xl font-bold text-slate-900">Refer {modal.name}?</h3>
                <div className="card p-4 mt-4 bg-slate-50/50">
                  <div className="flex gap-3">
                    <img src={modal.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{modal.name}</p>
                      <p className="text-xs text-slate-500">{modal.headline}</p>
                    </div>
                  </div>
                </div>
                <label className="flex items-start gap-2 mt-4 text-sm text-slate-700">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-emerald-600 mt-0.5" data-testid="confirm-referral-checkbox" />
                  <span>I confirm that I know this candidate professionally and believe they may be suitable for this role.</span>
                </label>
                <div className="flex gap-3 mt-6">
                  <button className="btn-secondary flex-1" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn-primary flex-1 disabled:opacity-50" disabled={!confirmed} onClick={submit} data-testid="refer-candidate-confirm-btn">Submit Referral</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3"><ShieldCheck className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900">Referral submitted</h3>
                <p className="text-sm text-slate-600 mt-1">Your referral has been recorded. The company's recruiting team will handle next steps.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
