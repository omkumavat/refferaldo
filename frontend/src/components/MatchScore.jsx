import React from "react";

export const MatchScore = ({ value = 0, size = 56, stroke = 5, showLabel = true }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 85 ? "#059669" : clamped >= 70 ? "#10B981" : "#F59E0B";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      data-testid="ai-match-ring"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-slate-900" style={{ fontSize: size / 4.5 }}>
            {clamped}%
          </span>
        </div>
      )}
    </div>
  );
};

export const MatchPill = ({ value = 0 }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const tone =
    clamped >= 85
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : clamped >= 70
        ? "bg-teal-50 text-teal-700 border-teal-200"
        : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${tone}`} data-testid="ai-match-pill">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {clamped}% Match
    </span>
  );
};
