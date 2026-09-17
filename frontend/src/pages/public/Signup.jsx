import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./Login";
import { User, Users, Building2, CheckCircle2 } from "lucide-react";

const roles = [
  { key: "candidate", icon: User, title: "Candidate", desc: "I'm looking for a new role and want referrals.", to: "/candidate/dashboard" },
  { key: "employee", icon: Users, title: "Employee", desc: "I want to refer candidates to jobs at my company.", to: "/employee/dashboard" },
  { key: "company", icon: Building2, title: "Company / Recruiter", desc: "I post jobs and manage referrals for my company.", to: "/company/dashboard" },
];

export const Signup = () => {
  const [role, setRole] = useState("candidate");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with Referly in less than a minute."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-emerald-700">Log in</Link></>}
    >
      <p className="text-xs font-semibold text-slate-600 mb-2">I am a...</p>
      <div className="space-y-2">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${role === r.key ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300"}`}
            data-testid={`signup-role-${r.key}`}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${role === r.key ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}><r.icon className="w-4 h-4" /></div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
            </div>
            {role === r.key && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>
        ))}
      </div>
      <form className="space-y-3 mt-5" onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Full name" className="field" data-testid="signup-name" />
        <input placeholder="Work email" type="email" className="field" data-testid="signup-email" />
        <input placeholder="Password" type="password" className="field" data-testid="signup-password" />
        <Link to={roles.find((r) => r.key === role).to} className="btn-primary w-full justify-center" data-testid="signup-submit">Create account</Link>
      </form>
    </AuthShell>
  );
};
