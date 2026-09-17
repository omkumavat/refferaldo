import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { candidateSidebar } from "./Dashboard";
import { referrals } from "../../data/referrals";
import { getJobById } from "../../data/jobs";
import { getCompanyById } from "../../data/companies";
import { CompanyLogo } from "../../components/CompanyLogo";
import { StatusBadge } from "../../components/Badges";
import { ReferralTimeline } from "../../components/ReferralTimeline";

export const CandidateReferrals = () => (
  <DashboardShell role="candidate" roleLabel="Candidate" sidebar={candidateSidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Referrals</h1>
    <p className="text-slate-600 mt-1 mb-6">Track every referral from request to hire.</p>
    <div className="space-y-4">
      {referrals.slice(0, 4).map((r) => {
        const job = getJobById(r.jobId);
        const company = getCompanyById(r.companyId);
        return (
          <div key={r.id} className="card p-6" data-testid={`referral-${r.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <CompanyLogo company={company} />
                <div>
                  <h3 className="font-semibold text-slate-900">{job?.title}</h3>
                  <p className="text-sm text-slate-500">{company?.name} · Requested {r.createdAt}</p>
                </div>
              </div>
              <StatusBadge stage={r.stage} />
            </div>
            <div className="mt-6">
              <ReferralTimeline stage={r.stage} />
            </div>
          </div>
        );
      })}
    </div>
  </DashboardShell>
);
