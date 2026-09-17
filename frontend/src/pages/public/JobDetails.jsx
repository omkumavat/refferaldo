import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { getJobById } from "../../data/jobs";
import { getCompanyById } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";
import { MatchScore } from "../../components/MatchScore";
import { VerificationBadge, ReferralAvailableBadge } from "../../components/Badges";
import {
  MapPin,
  Briefcase,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  UserCheck,
  ArrowLeft,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = getJobById(id);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <PublicNav />
        <div className="max-w-4xl mx-auto p-10 text-center">
          <p>Job not found.</p>
          <Link to="/jobs" className="btn-primary mt-4">Back to jobs</Link>
        </div>
      </div>
    );
  }

  const company = getCompanyById(job.companyId);

  const handleSubmit = () => {
    toast.success("Referral request sent to verified employees at " + company.name);
    setShowModal(false);
    setTimeout(() => navigate("/candidate/referrals"), 800);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <PublicNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-5">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <CompanyLogo company={company} size={56} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/companies/${company.id}`} className="text-slate-600 hover:text-emerald-700 font-medium text-sm">{company.name}</Link>
                    <VerificationBadge label="Verified Company" />
                    {job.referralAvailable && <ReferralAvailableBadge />}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1.5">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.workMode} · {job.employmentType}</span>
                    <span className="inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> {job.salary}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.postedAgo}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-100">
                <button className="btn-primary" onClick={() => setShowModal(true)} data-testid="request-referral-btn">
                  <UserCheck className="w-4 h-4" /> Request Referral
                </button>
                <button className="btn-secondary" data-testid="apply-without-referral-btn">
                  Apply Without Referral
                </button>
              </div>
            </div>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900">About the role</h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{job.description}</p>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
              {job.preferred && (
                <>
                  <h3 className="font-semibold text-slate-900 mt-6 mb-3">Preferred qualifications</h3>
                  <ul className="space-y-2">
                    {job.preferred.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-slate-600">
                        <span className="w-4 h-4 rounded-full border-2 border-slate-300 mt-0.5 flex-shrink-0" />{r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((b) => (
                  <div key={b} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />{b}
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center gap-3">
                <CompanyLogo company={company} />
                <div>
                  <h2 className="font-semibold text-slate-900">About {company.name}</h2>
                  <p className="text-xs text-slate-500">{company.industry} · {company.size} employees</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">{company.about}</p>
              <Link to={`/companies/${company.id}`} className="text-sm font-semibold text-emerald-700 mt-4 inline-block">View company profile →</Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow">AI Match</p>
              <div className="flex items-center gap-4 mt-3">
                <MatchScore value={job.match} size={68} />
                <div>
                  <p className="text-lg font-bold text-slate-900">{job.match >= 85 ? "Strong match" : job.match >= 70 ? "Good match" : "Fair match"}</p>
                  <p className="text-xs text-slate-500">Based on your profile</p>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Matching skills</p>
                {job.matchingSkills.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-slate-700 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{s}
                  </div>
                ))}
                {job.missingSkills.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-slate-500 uppercase mt-3 mb-2">Less relevant</p>
                    {job.missingSkills.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-slate-500 py-1">
                        <XCircle className="w-3.5 h-3.5 text-slate-300" />{s}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="card p-6 border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <p className="text-sm font-semibold text-emerald-800">{company.referrers} verified employees at {company.name} are available for referrals.</p>
              </div>
              <button onClick={() => setShowModal(true)} className="btn-primary w-full justify-center mt-3" data-testid="sidebar-request-referral-btn">
                Request a Referral
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Referral modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900">Request a referral</h3>
            <p className="text-sm text-slate-600 mt-1">We'll send your profile to verified employees at <span className="font-semibold text-slate-900">{company.name}</span>. Add a short note explaining your interest.</p>
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-600">Note to employee</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Hi! I noticed the Senior Payments role at Stripe. My background in ledger systems seems like a strong fit..."
                className="field mt-1.5 min-h-[120px]"
                data-testid="referral-note-input"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary flex-1" onClick={handleSubmit} data-testid="submit-referral-request">Send request</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
