import React from "react";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { Target, UserCheck, Building2, Sparkles, ShieldCheck, TrendingUp, Users } from "lucide-react";

export const HowItWorks = () => (
  <div className="min-h-screen bg-white">
    <PublicNav />
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="eyebrow">How refermy.life works</p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mt-2">The referral marketplace, explained.</h1>
      <p className="text-slate-600 mt-3 text-lg leading-relaxed">Referrals are the fastest path to a job — and the least accessible. refermy.life changes that by making it easy for candidates to reach verified employees at companies they love.</p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { i: Target, t: "1. Find a job", d: "Browse verified roles from top companies. See your AI match and required skills." },
          { i: UserCheck, t: "2. Request a referral", d: "Send a note to verified employees. If accepted, they submit your profile internally." },
          { i: Building2, t: "3. Company hires you", d: "Once your referral lands, the company's normal hiring process handles interviews and offer." },
        ].map((s) => (
          <div key={s.t} className="card p-6">
            <s.i className="w-6 h-6 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 mt-3">{s.t}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Why refermy.life is different</h2>
        <div className="mt-6 space-y-4">
          {[
            { i: ShieldCheck, t: "Every referrer is verified", d: "We verify employment via corporate email OTP before anyone can refer. No fakes, no scams." },
            { i: Sparkles, t: "AI-powered match scores", d: "Our matching engine highlights the best-fit opportunities and gives referrers instant candidate context." },
            { i: TrendingUp, t: "Transparent referral tracking", d: "Track every stage from request to hire — no more black holes." },
            { i: Users, t: "The employee's job is simple", d: "Employees don't run interviews. They just review the candidate and click Refer. HR takes it from there." },
          ].map((f) => (
            <div key={f.t} className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0"><f.i className="w-5 h-5" /></div>
              <div>
                <h3 className="font-semibold text-slate-900">{f.t}</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);
