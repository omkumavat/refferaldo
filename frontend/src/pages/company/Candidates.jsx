import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { candidates } from "../../data/candidates";
import { CandidateCard } from "../../components/CandidateCard";

export const CompanyCandidates = () => (
  <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidate pool</h1>
    <p className="text-slate-600 mt-1 mb-6">All candidates who have been referred to your company.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {candidates.map((c) => <CandidateCard key={c.id} candidate={c} />)}
    </div>
  </DashboardShell>
);
