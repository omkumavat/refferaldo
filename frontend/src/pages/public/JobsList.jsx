import React, { useState, useMemo } from "react";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { JobCard } from "../../components/JobCard";
import { jobs } from "../../data/jobs";
import { companies } from "../../data/companies";
import { Search, SlidersHorizontal } from "lucide-react";

export const JobsList = () => {
  const [q, setQ] = useState("");
  const [workMode, setWorkMode] = useState("all");
  const [companyId, setCompanyId] = useState("all");
  const [referralOnly, setReferralOnly] = useState(false);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (workMode !== "all" && j.workMode !== workMode) return false;
      if (companyId !== "all" && j.companyId !== companyId) return false;
      if (referralOnly && !j.referralAvailable) return false;
      if (q) {
        const s = q.toLowerCase();
        return j.title.toLowerCase().includes(s) || j.skills.join(" ").toLowerCase().includes(s) || j.location.toLowerCase().includes(s);
      }
      return true;
    });
  }, [q, workMode, companyId, referralOnly]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find your next opportunity</h1>
          <p className="text-slate-600 mt-1">Explore {jobs.length} open roles with verified referrers ready to submit your profile.</p>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Job title, skill, company, or location"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="field pl-9"
                data-testid="jobs-search-input"
              />
            </div>
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="field lg:w-40" data-testid="filter-workmode">
              <option value="all">All modes</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="field lg:w-52" data-testid="filter-company">
              <option value="all">All companies</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label className="flex items-center gap-2 px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" className="accent-emerald-600" checked={referralOnly} onChange={(e) => setReferralOnly(e.target.checked)} data-testid="filter-referral-only" />
              Referral available
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{filtered.length}</span> results</p>
          <button className="btn-ghost text-sm"><SlidersHorizontal className="w-4 h-4" /> Sort: Best match</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((j) => <JobCard key={j.id} job={j} />)}
        </div>

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-slate-500">No jobs match your filters. Try widening your search.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
