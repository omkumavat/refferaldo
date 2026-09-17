import React from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { CandidateCard } from "../../components/CandidateCard";
import { candidates } from "../../data/candidates";
import { useNavigate } from "react-router-dom";

export const EmployeeCandidates = () => {
  const navigate = useNavigate();
  return (
    <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates</h1>
      <p className="text-slate-600 mt-1 mb-6">Verified job seekers who match your company's open roles.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} onView={() => navigate(`/employee/candidates/${c.id}`)} onRefer={() => navigate(`/employee/candidates/${c.id}`)} />
        ))}
      </div>
    </DashboardShell>
  );
};
