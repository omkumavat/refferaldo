import React from "react";
import { Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react";
import { companies } from "../../data/companies";
import { testimonials } from "../../data/testimonials";
import { jobs } from "../../data/jobs";
import { JobCard } from "../../components/JobCard";

export const Landing = () => (
  <div className="min-h-screen bg-white">
    <PublicNav />

    {/* HERO */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 chip-emerald mb-5" data-testid="hero-eyebrow">
              <Sparkles className="w-3 h-3" /> Referral-first hiring marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Your next opportunity might be
              <span className="text-emerald-600"> one referral </span>
              away.
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
              Discover relevant jobs, connect with verified employees, and get your application in front of the people who can actually help you get noticed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="btn-primary text-base px-5 py-3" data-testid="hero-find-job">
                Find a Job <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/employee/dashboard" className="btn-secondary text-base px-5 py-3" data-testid="hero-become-referrer">
                Become a Referrer
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified employees only</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-600" /> Referrals in under 48 hours</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free for candidates</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=srgb&fm=jpg&w=900&q=80"
                alt="Team of professionals collaborating"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute top-5 right-5 bg-white border border-slate-200 shadow-md rounded-xl px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-500 leading-tight">Referral accepted</p>
                  <p className="text-sm font-semibold text-slate-900 leading-tight">Priya @ Stripe · 2m ago</p>
                </div>
              </div>
              <div className="absolute bottom-5 left-5 bg-white border border-slate-200 shadow-md rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] text-slate-500 leading-tight">AI Match</p>
                <p className="text-lg font-bold text-emerald-700 leading-tight">94% · Strong fit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* TRUSTED */}
    <section className="border-y border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Companies hiring through referrals</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {companies.slice(0, 8).map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-slate-600">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold border ${c.tint}`}>{c.symbol}</div>
              <span className="text-sm font-semibold text-slate-700">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">Three steps between you and your next role.</h2>
          <p className="text-slate-600 mt-3">No more cold applications, no more black hole. A verified employee submits your profile internally — the company takes it from there.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Find a job", d: "Browse relevant opportunities from companies you're interested in.", icon: Target },
            { n: "02", t: "Request a referral", d: "Connect with a verified employee who can submit your referral internally.", icon: Users },
            { n: "03", t: "Let the company take it from there", d: "Once referred, the company's normal hiring process takes over.", icon: TrendingUp },
          ].map((s) => (
            <div key={s.n} className="card p-6 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 tracking-widest">{s.n}</span>
                <s.icon className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mt-4">{s.t}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* VALUE PROPS */}
    <section className="py-20 bg-zinc-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "For Candidates",
            desc: "Get seen. Skip the ATS black hole.",
            bullets: ["Better visibility with recruiters", "Verified employee referrers", "AI-powered job matching", "Real referral tracking"],
            cta: { label: "Find jobs", to: "/jobs" },
          },
          {
            title: "For Employees",
            desc: "Refer strong peers in one click.",
            bullets: ["Discover relevant candidates", "One-click referral submission", "Track referral status", "Earn referral rewards"],
            cta: { label: "Become a Referrer", to: "/employee/dashboard" },
          },
          {
            title: "For Companies",
            desc: "Turn employees into a hiring pipeline.",
            bullets: ["Employee referral pipeline", "Verified referrer network", "Better candidate discovery", "Full referral analytics"],
            cta: { label: "For Companies", to: "/company/dashboard" },
          },
        ].map((v) => (
          <div key={v.title} className="card p-7 flex flex-col">
            <h3 className="text-xl font-semibold text-slate-900">{v.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{v.desc}</p>
            <ul className="mt-5 space-y-2.5">
              {v.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to={v.cta.to} className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              {v.cta.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>

    {/* FEATURED JOBS */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow">Featured roles</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">Handpicked opportunities with referrers available.</h2>
          </div>
          <Link to="/jobs" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Browse all jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.slice(0, 6).map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="py-20 bg-zinc-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="eyebrow text-center">Trusted by professionals</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mt-2 max-w-2xl mx-auto">Referrals move faster than applications. Always have.</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="card p-6">
              <div className="flex items-center gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-700 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role} · {t.context}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 p-10 sm:p-14 text-center relative overflow-hidden">
          <BarChart3 className="w-32 h-32 text-white/5 absolute -top-4 -right-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Get referred. Get noticed. Get hired.</h2>
          <p className="text-slate-300 mt-3 max-w-xl mx-auto">Join thousands of candidates and employees using Referly to make hiring feel more human.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="btn-primary text-base px-5 py-3" data-testid="cta-signup">
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-white/90 hover:text-white px-5 py-3">Learn how it works</Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);
