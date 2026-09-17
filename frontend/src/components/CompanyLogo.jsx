import React from "react";

export const CompanyLogo = ({ company, size = 44, className = "" }) => {
  if (!company) return null;
  const style = {
    width: size,
    height: size,
    fontSize: size / 2.6,
  };
  return (
    <div
      className={`flex items-center justify-center rounded-lg font-semibold border ${company.tint} ${className}`}
      style={style}
      aria-label={`${company.name} logo`}
      data-testid={`company-logo-${company.id}`}
    >
      {company.symbol}
    </div>
  );
};
