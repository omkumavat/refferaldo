import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { StatCard } from "../../components/StatCard";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

const timeSeries = [
  { m: "Apr", referrals: 32, submitted: 24, hired: 2 },
  { m: "May", referrals: 45, submitted: 38, hired: 3 },
  { m: "Jun", referrals: 62, submitted: 51, hired: 5 },
  { m: "Jul", referrals: 78, submitted: 66, hired: 6 },
  { m: "Aug", referrals: 96, submitted: 82, hired: 7 },
  { m: "Sep", referrals: 118, submitted: 98, hired: 8 },
  { m: "Oct", referrals: 142, submitted: 120, hired: 11 },
];

const topJobs = [
  { name: "Senior SWE — Payments", value: 42 },
  { name: "Staff Product Designer", value: 31 },
  { name: "Backend Engineer", value: 28 },
  { name: "SRE", value: 22 },
  { name: "Data Scientist", value: 19 },
];

export const CompanyAnalytics = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
    <p className="text-slate-600 mt-1 mb-6">Deep insights into your referral pipeline performance.</p>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Referral conversion" value="8.4%" delta="+1.2%" icon={TrendingUp} tone="emerald" />
      <StatCard label="Avg time to hire" value="21d" icon={Clock} />
      <StatCard label="Active referrers" value="127" delta="+18" icon={Users} tone="emerald" />
      <StatCard label="Cost per hire" value="₹42k" icon={Award} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Pipeline velocity</h2>
        <p className="text-xs text-slate-500 mb-4">Referrals, submissions, and hires over time</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={timeSeries}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.3} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} /><stop offset="95%" stopColor="#0D9488" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="m" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} />
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="referrals" stroke="#059669" fill="url(#g1)" strokeWidth={2} />
            <Area type="monotone" dataKey="submitted" stroke="#0D9488" fill="url(#g2)" strokeWidth={2} />
            <Line type="monotone" dataKey="hired" stroke="#4F46E5" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Top jobs by referrals</h2>
        <p className="text-xs text-slate-500 mb-4">Last 90 days</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topJobs} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" stroke="#94A3B8" fontSize={11} />
            <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={110} />
            <Tooltip />
            <Bar dataKey="value" fill="#0D9488" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardShell>
);
