import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { companySidebar } from "./Dashboard";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const CompanyCreateJob = () => {
  const [desc, setDesc] = useState("We're looking for a senior engineer to join our payments team...");
  const [improving, setImproving] = useState(false);
  const navigate = useNavigate();

  const improve = () => {
    setImproving(true);
    setTimeout(() => {
      setDesc(
        "Join Stripe's Payments Platform team to design and scale mission-critical infrastructure that processes billions of dollars in transactions every day.\n\nAs a Senior Engineer, you'll own core services from architecture through production, partner with product & risk on regulated features, and mentor a team of world-class engineers. If you're excited about distributed systems, correctness under pressure, and building software that powers the internet economy, we'd love to talk."
      );
      setImproving(false);
      toast.success("Description enhanced");
    }, 1400);
  };

  const publish = () => {
    toast.success("Job posted successfully");
    setTimeout(() => navigate("/company/jobs"), 600);
  };

  return (
    <DashboardShell role="company" roleLabel="Stripe · HR" sidebar={companySidebar}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post a new job</h1>
      <p className="text-slate-600 mt-1 mb-6">Publish once. Referrers, candidates, and the public feed pick it up instantly.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 space-y-4">
          <div><label className="text-xs font-semibold text-slate-600">Job title</label><input className="field mt-1" placeholder="Senior Software Engineer" data-testid="job-title-input" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600">Department</label><input className="field mt-1" placeholder="Engineering" /></div>
            <div><label className="text-xs font-semibold text-slate-600">Location</label><input className="field mt-1" placeholder="Bangalore, India" /></div>
            <div><label className="text-xs font-semibold text-slate-600">Employment type</label><select className="field mt-1"><option>Full-time</option><option>Contract</option><option>Part-time</option></select></div>
            <div><label className="text-xs font-semibold text-slate-600">Work mode</label><select className="field mt-1"><option>Hybrid</option><option>Remote</option><option>On-site</option></select></div>
            <div><label className="text-xs font-semibold text-slate-600">Salary range</label><input className="field mt-1" placeholder="₹42L – ₹68L" /></div>
            <div><label className="text-xs font-semibold text-slate-600">Experience</label><input className="field mt-1" placeholder="4 - 7 years" /></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1"><label className="text-xs font-semibold text-slate-600">Description</label>
              <button type="button" onClick={improve} disabled={improving} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800" data-testid="improve-jd-btn">
                {improving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {improving ? "Enhancing..." : "Improve with AI"}
              </button>
            </div>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="field min-h-[180px]" />
          </div>
          <div><label className="text-xs font-semibold text-slate-600">Referral reward (optional)</label><input className="field mt-1" placeholder="₹50,000" /></div>
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button className="btn-secondary" onClick={() => navigate("/company/jobs")}>Save as draft</button>
            <button className="btn-primary" onClick={publish} data-testid="publish-job-btn">Publish job</button>
          </div>
        </div>
        <aside className="card p-6 h-fit">
          <h3 className="font-semibold text-slate-900">Tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Be specific about scope and impact</li>
            <li>• Highlight ownership and autonomy</li>
            <li>• Skip corporate jargon</li>
            <li>• Add a referral reward to boost visibility</li>
          </ul>
        </aside>
      </div>
    </DashboardShell>
  );
};
