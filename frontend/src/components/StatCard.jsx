import React from "react";
import { TrendingUp } from "lucide-react";

export const StatCard = ({ label, value, delta, icon: Icon, tone = "default" }) => {
  const tones = {
    default: "text-slate-900",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
  };
  return (
    <div className="card p-5" data-testid={`stat-${label?.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && (
          <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-2xl font-bold tracking-tight ${tones[tone] || tones.default}`}>{value}</span>
        {delta && (
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-700">
            <TrendingUp className="w-3 h-3" /> {delta}
          </span>
        )}
      </div>
    </div>
  );
};
