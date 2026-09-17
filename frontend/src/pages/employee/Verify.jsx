import React, { useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { ShieldCheck, Mail, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const EmployeeVerify = () => {
  const [step, setStep] = useState(1);
  return (
    <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verify your employment</h1>
      <p className="text-slate-600 mt-1 mb-6">This one-time verification unlocks referrals across your company.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center gap-3 mb-6">
            {[1, 2, 3].map((n) => (
              <React.Fragment key={n}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= n ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>{step > n ? <CheckCircle2 className="w-4 h-4" /> : n}</div>
                {n < 3 && <div className={`flex-1 h-[2px] ${step > n ? "bg-emerald-500" : "bg-slate-200"}`} />}
              </React.Fragment>
            ))}
          </div>
          {step === 1 && (
            <>
              <h2 className="font-semibold text-slate-900">Step 1: Corporate email</h2>
              <p className="text-sm text-slate-600 mt-1">We'll send a one-time code to your work email.</p>
              <div className="relative mt-4"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="you@yourcompany.com" /></div>
              <button className="btn-primary mt-4" onClick={() => setStep(2)} data-testid="verify-next-1">Send code</button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-semibold text-slate-900">Step 2: Enter OTP</h2>
              <p className="text-sm text-slate-600 mt-1">Check your inbox for a 6-digit code.</p>
              <input className="field mt-4 tracking-widest text-center text-lg" placeholder="• • • • • •" maxLength={6} />
              <button className="btn-primary mt-4" onClick={() => setStep(3)} data-testid="verify-next-2">Verify code</button>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-semibold text-slate-900">Step 3: Company details</h2>
              <p className="text-sm text-slate-600 mt-1">Confirm your role and team.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <input className="field" placeholder="Company name" defaultValue="Stripe" />
                <input className="field" placeholder="Your role" defaultValue="Senior Software Engineer" />
                <input className="field sm:col-span-2" placeholder="Team / department" defaultValue="Payments Platform" />
              </div>
              <button className="btn-primary mt-4" onClick={() => toast.success("Verification submitted! We'll notify you within 24 hours.")} data-testid="verify-submit">Submit</button>
            </>
          )}
        </div>
        <aside className="card p-6 border-emerald-200 bg-emerald-50/40">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="font-semibold text-slate-900 mt-3">Why verify?</h3>
          <ul className="space-y-2 mt-3 text-sm text-slate-700">
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Unlock referrals for your company</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Get a "Verified Employee" badge</li>
            <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Earn referral rewards</li>
          </ul>
        </aside>
      </div>
    </DashboardShell>
  );
};
