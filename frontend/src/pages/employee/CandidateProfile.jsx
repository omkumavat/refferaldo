import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { getCandidateById } from "../../data/candidates";
import { MatchScore } from "../../components/MatchScore";
import { VerificationBadge } from "../../components/Badges";
import { ArrowLeft, Mail, Phone, FileText, Download, ShieldCheck, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";

export const EmployeeCandidateProfile = () => {
  const { id } = useParams();
  const c = getCandidateById(id);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!c) return null;

  const submit = () => { setSubmitted(true); toast.success("Referral submitted"); };

  return (
    <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
      <Link to="/employee/candidates" className="btn-ghost text-sm mb-5"><ArrowLeft className="w-4 h-4" /> All candidates</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <img src={c.photo} alt={c.name} className="w-20 h-20 rounded-full object-cover border border-slate-200" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{c.name}</h1>
                <p className="text-slate-600">{c.headline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {c.location}</span>
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {c.experience}</span>
                </div>
              </div>
              <MatchScore value={c.match} size={64} />
            </div>
          </div>

          <div className="card p-6"><h2 className="font-semibold text-slate-900 mb-2">Summary</h2><p className="text-sm text-slate-600 leading-relaxed">{c.summary}</p></div>

          <div className="card p-6"><h2 className="font-semibold text-slate-900 mb-3">Skills</h2><div className="flex flex-wrap gap-2">{c.skills.map((s) => <span key={s} className="chip-emerald">{s}</span>)}</div></div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Experience</h2>
            <div className="space-y-4">
              {c.experienceItems.map((e) => (
                <div key={e.company} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{e.role} · <span className="font-normal text-slate-600">{e.company}</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">{e.period}</p>
                    <p className="text-sm text-slate-600 mt-1.5">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Education</h2>
            {c.education.map((e) => (
              <div key={e.school} className="text-sm">
                <p className="font-medium text-slate-900">{e.school}</p>
                <p className="text-slate-600">{e.degree} · {e.year}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Verification</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Mail className="w-3.5 h-3.5" /> Email</span>{c.verifications.email ? <VerificationBadge label="Verified" /> : <span className="chip">Pending</span>}</li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5" /> Phone</span>{c.verifications.phone ? <VerificationBadge label="Verified" /> : <span className="chip">Pending</span>}</li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><FileText className="w-3.5 h-3.5" /> Resume</span>{c.verifications.resume ? <VerificationBadge label="Uploaded" /> : <span className="chip">Missing</span>}</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500"><span>Profile completeness</span><span className="font-semibold text-slate-900">{c.verifications.profile}%</span></div>
              <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${c.verifications.profile}%` }} /></div>
            </div>
          </div>

          <div className="card p-6">
            <button className="btn-secondary w-full justify-center text-xs"><Download className="w-3.5 h-3.5" /> Download resume</button>
          </div>

          <div className="card p-6 border-emerald-200 bg-emerald-50/40">
            {!submitted ? (
              <>
                <h3 className="font-semibold text-slate-900">Refer this candidate</h3>
                <p className="text-xs text-slate-600 mt-1">Your referral will be submitted internally. HR will handle everything after.</p>
                <label className="flex items-start gap-2 mt-4 text-xs text-slate-700">
                  <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-emerald-600 mt-0.5" />
                  <span>I know this candidate professionally and believe they may fit this role.</span>
                </label>
                <button className="btn-primary w-full justify-center mt-4 text-sm disabled:opacity-50" disabled={!confirmed} onClick={submit} data-testid="submit-referral-btn">Submit Referral</button>
              </>
            ) : (
              <div className="text-center py-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold text-slate-900 mt-2">Referral submitted</p>
                <p className="text-xs text-slate-600 mt-1">The company will handle the next steps.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
};
