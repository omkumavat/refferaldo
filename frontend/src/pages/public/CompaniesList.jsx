import React from "react";
import { Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { companies } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";
import { Users, Briefcase } from "lucide-react";

export const CompaniesList = () => (
  <div className="min-h-screen bg-zinc-50">
    <PublicNav />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Companies hiring via referrals</h1>
      <p className="text-slate-600 mt-1">Explore verified employers with active referrers ready to submit your profile.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {companies.map((c) => (
          <Link key={c.id} to={`/companies/${c.id}`} className="card p-5 hover:border-emerald-300 hover:shadow-md transition-all" data-testid={`company-card-${c.id}`}>
            <div className="flex items-start gap-3">
              <CompanyLogo company={c} size={48} />
              <div>
                <h3 className="font-semibold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500">{c.industry}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed line-clamp-2">{c.tagline}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {c.openJobs} jobs</span>
              <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {c.referrers} referrers</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);
