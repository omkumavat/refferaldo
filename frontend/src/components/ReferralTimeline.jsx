import React from "react";
import { REFERRAL_STAGES } from "../data/referrals";
import { Check } from "lucide-react";

export const ReferralTimeline = ({ stage = "Requested" }) => {
  const currentIdx = REFERRAL_STAGES.indexOf(stage);
  return (
    <div className="w-full overflow-x-auto" data-testid="referral-timeline">
      <div className="flex items-center min-w-[720px] py-2">
        {REFERRAL_STAGES.map((s, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    active
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-100 border-emerald-600"
                      : done
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-slate-400 border-slate-300"
                  }`}
                  data-testid={`timeline-stage-${s.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {done ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    active || done ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {idx < REFERRAL_STAGES.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 rounded-full ${
                    idx < currentIdx ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
