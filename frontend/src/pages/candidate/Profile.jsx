import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { candidates } from "../../data/candidates";
import { VerificationBadge } from "../../components/Badges";
import { MapPin, Briefcase, Mail, Phone, FileText, Github, Linkedin } from "lucide-react";

export const CandidateProfile = () => {
  const me = candidates[0];
  return (
    <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-col sm:flex-row">
          <img src={me.photo} alt={me.name} className="w-24 h-24 rounded-full object-cover border border-slate-200" />
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{me.name}</h1>
              <VerificationBadge label="Identity Verified" />
            </div>
            <p className="text-slate-600 mt-0.5">{me.headline}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {me.location}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {me.experience} experience</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs">Preview</button>
            <button className="btn-primary text-xs" data-testid="edit-profile-btn">Edit profile</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-2">About</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{me.summary}</p>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Experience</h2>
            <div className="space-y-4">
              {me.experienceItems.map((e) => (
                <div key={e.company} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{e.role} · <span className="text-slate-600 font-normal">{e.company}</span></p>
                    <p className="text-xs text-slate-500 mt-0.5">{e.period}</p>
                    <p className="text-sm text-slate-600 mt-1.5">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">{me.skills.map((s) => <span key={s} className="chip-emerald">{s}</span>)}</div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Projects</h2>
            {me.projects.map((p) => (
              <div key={p.name} className="pb-3 mb-3 last:pb-0 last:mb-0 border-b border-slate-100 last:border-0">
                <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                <p className="text-sm text-slate-600 mt-0.5">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Verification</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Mail className="w-3.5 h-3.5" /> Email</span><VerificationBadge label="Verified" /></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Phone className="w-3.5 h-3.5" /> Phone</span><VerificationBadge label="Verified" /></li>
              <li className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><FileText className="w-3.5 h-3.5" /> Resume</span><VerificationBadge label="Uploaded" /></li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Links</h3>
            <a className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 py-1"><Github className="w-4 h-4" /> github.com/rahulsharma</a>
            <a className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 py-1"><Linkedin className="w-4 h-4" /> linkedin.com/in/rahulsharma</a>
          </div>
          <div className="card p-6 border-emerald-200 bg-emerald-50/40">
            <h3 className="font-semibold text-slate-900">Resume</h3>
            <p className="text-xs text-slate-600 mt-1">rahul_sharma_resume.pdf · Updated 2 weeks ago</p>
            <button className="btn-secondary w-full justify-center mt-3 text-xs">Download</button>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
};
