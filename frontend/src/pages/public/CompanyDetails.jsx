import React from "react";
import { useParams, Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { getCompanyById } from "../../data/companies";
import { jobs } from "../../data/jobs";
import { CompanyLogo } from "../../components/CompanyLogo";
import { JobCard } from "../../components/JobCard";
import { VerificationBadge } from "../../components/Badges";
import { Globe, MapPin, Users, Calendar, ArrowLeft } from "lucide-react";

export const CompanyDetails = () => {
  const { id } = useParams();
  const company = getCompanyById(id);
  const companyJobs = jobs.filter((j) => j.companyId === id);

  if (!company) return null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/companies" className="btn-ghost text-sm mb-5"><ArrowLeft className="w-4 h-4" /> All companies</Link>

        <div className="card p-8">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <CompanyLogo company={company} size={72} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{company.name}</h1>
                <VerificationBadge label="Verified employer" />
              </div>
              <p className="text-slate-600 mt-1">{company.tagline}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {company.website}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {company.hq}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {company.size}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Founded {company.founded}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 shrink-0">
              <div className="card px-4 py-3 text-center border-emerald-200 bg-emerald-50/40">
                <p className="text-2xl font-bold text-emerald-700">{company.openJobs}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">Open roles</p>
              </div>
              <div className="card px-4 py-3 text-center">
                <p className="text-2xl font-bold text-slate-900">{company.referrers}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">Referrers</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-2">About</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{company.about}</p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-3">Benefits & culture</h2>
            <div className="flex flex-wrap gap-2">{company.perks.map((p) => <span key={p} className="chip">{p}</span>)}</div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-5">Open roles at {company.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {companyJobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
          {companyJobs.length === 0 && <p className="text-slate-500 text-sm">No open roles right now.</p>}
        </section>
      </div>
      <Footer />
    </div>
  );
};
