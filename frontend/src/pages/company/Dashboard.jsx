import React from "react";
import { Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { LayoutDashboard, Briefcase, Send, Users, UserCheck, BarChart3, Settings, PlusCircle } from "lucide-react";
import { StatCard } from "../../components/StatCard";
import { referrals } from "../../data/referrals";
import { getCandidateById } from "../../data/candidates";
import { getJobById } from "../../data/jobs";
import { StatusBadge } from "../../components/Badges";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const sidebar = [
  { to: "/company/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/company/jobs", label: "Jobs", icon: Briefcase },
  { to: "/company/referrals", label: "Referrals", icon: Send },
  { to: "/company/candidates", label: "Candidates", icon: Users },
  { to: "/company/employees", label: "Employees", icon: UserCheck },
  { to: "/company/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/company/settings", label: "Settings", icon: Settings },
];

export const companySidebar = sidebar;

const trend = [
  { m: "May", referrals: 45, hires: 3 },
  { m: "Jun", referrals: 62, hires: 5 },
  { m: "Jul", referrals: 78, hires: 6 },
  { m: "Aug", referrals: 96, hires: 7 },
  { m: "Sep", referrals: 118, hires: 8 },
  { m: "Oct", referrals: 142, hires: 11 },
];

const funnelData = [
  { stage: "Submitted", value: 342 },
  { stage: "Reviewed", value: 218 },
  { stage: "Interview", value: 74 },
  { stage: "Offer", value: 21 },
  { stage: "Hired", value: 8 },
];

const sourceData = [
  { name: "Employees", value: 342, fill: "#059669" },
  { name: "Public", value: 128, fill: "#0D9488" },
  { name: "Inbound", value: 47, fill: "#4F46E5" },
];

export const CompanyDashboard = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" userName="Alex" sidebar={sidebar}>
    <div className="flex items-start justify-between mb-8 flex-col md:flex-row gap-4">
      <div>
        <p className="eyebrow">Talent operations</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">Referral pipeline overview</h1>
      </div>
      <Link to="/company/jobs/create" className="btn-primary" data-testid="create-job-cta"><PlusCircle className="w-4 h-4" /> Post new job</Link>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <StatCard label="Open Jobs" value="18" icon={Briefcase} />
      <StatCard label="Total Referrals" value="342" delta="+24" icon={Send} tone="emerald" />
      <StatCard label="Shortlisted" value="74" icon={UserCheck} />
      <StatCard label="Interviews" value="31" icon={Users} />
      <StatCard label="Hires" value="8" icon={UserCheck} tone="emerald" />
      <StatCard label="Conversion" value="8.4%" icon={BarChart3} tone="emerald" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Referrals over time</h2>
        <p className="text-xs text-slate-500 mb-4">Monthly referral volume across all jobs</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="m" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0" }} />
            <Line type="monotone" dataKey="referrals" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="hires" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Referral source</h2>
        <p className="text-xs text-slate-500 mb-4">Where referrals come from</p>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {sourceData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Recent referrals</h2>
        <p className="text-xs text-slate-500 mb-4">Latest submissions from your employees</p>
        <div className="divide-hair">
          {referrals.slice(0, 5).map((r) => {
            const c = getCandidateById(r.candidateId);
            const j = getJobById(r.jobId);
            return (
              <div key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img src={c?.photo} className="w-8 h-8 rounded-full object-cover" alt="" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c?.name}</p>
                    <p className="text-xs text-slate-500">{j?.title}</p>
                  </div>
                </div>
                <StatusBadge stage={r.stage} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Candidate funnel</h2>
        <p className="text-xs text-slate-500 mb-4">Last 30 days</p>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={funnelData} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#94A3B8" fontSize={11} />
            <YAxis type="category" dataKey="stage" stroke="#64748B" fontSize={11} width={70} />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardShell>
);
