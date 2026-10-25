
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import { CompanyLogo } from "../../components/CompanyLogo";
import {
  Search,
  Building2,
  BriefcaseBusiness,
  Users,
  MapPin,
  Globe,
  BadgeCheck,
  ArrowUpRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  BadgeInfo,
  BadgeX
} from "lucide-react";

const verificationConfig = {
  verified: {
    label: "Verified",
    Icon: BadgeCheck,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Verification Pending",
    Icon: BadgeInfo,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  rejected: {
    label: "Verification Rejected",
    Icon: BadgeX,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};


const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getWebsiteUrl = (website) => {
  if (!website) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(website) ? website : `https://${website}`
    );

    if (!["http:", "https:"].includes(url.protocol)) return null;

    return url.href;
  } catch {
    return null;
  }
};

const CompanyCard = ({ company }) => {
  const websiteUrl = getWebsiteUrl(company.website);
  const companyId = company._id || company.id;
  const verification = verificationConfig[company?.verificationStatus];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-6">
      {/* Company identity */}
      <div className="flex items-start gap-4">
        <CompanyLogo company={company} size={56} />

        <div className="min-w-0 flex-1">
          <h2 className="break-words text-lg font-bold tracking-tight text-slate-900">
            {company.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {company.industry || ""}
          </p>

          {verification && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${verification.className}`}
            >
              <verification.Icon size={14} />
              {verification.label}
            </span>
          )}

        </div>
      </div>

      {/* Company description */}
      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
        {company.description ||
          ""}
      </p>

      {/* Company details */}
      <div className="mt-5 space-y-3">
        {company.headquarters && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{company.headquarters}</span>
          </div>
        )}

        {company.domain && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Globe className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{company.domain}</span>
          </div>
        )}
      </div>

      {/* Jobs and referrers */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <BriefcaseBusiness className="h-4 w-4" />
            <span className="text-xs">Open jobs</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {company.openJobs ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4" />
            <span className="text-xs">Referrers</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {company.referrers ?? 0}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-5">
        {websiteUrl ? (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Company website
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">Website unavailable</span>
        )}

        {/* <Link
          to={`/companies/${companyId}`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View company
          <ArrowUpRight className="h-4 w-4" />
        </Link> */}
      </div>
    </article>
  );
};

export const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: search.trim(),
        industry,
        page: String(page),
        limit: "12",
      });

      const response = await fetch(
        `${API_BASE_URL}/company?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load companies.");
      }

      console.log(data)
      setCompanies(data.companies || []);
      setIndustries(data.filters?.industries || []);
      setPagination(
        data.pagination || {
          total: (data.companies || []).length,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error("Fetch companies error:", err);
      setError(err.message || "Unable to load companies.");
    } finally {
      setLoading(false);
    }
  }, [search, industry, page]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleIndustryChange = (value) => {
    setIndustry(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-4 w-4" />
                Verified employers
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-90 sm:text-4xl lg:text-5xl">
                Find companies.
                <span className="block text-emerald-400">
                  Discover opportunities.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Explore verified companies, discover active job openings,
                and find organizations where employee referrals can help
                you take the next step in your career.
              </p>
            </div>

            {/* Search and filter */}
            <div className="mt-9 grid grid-cols-1 gap-3 md:grid-cols-[1fr_260px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  placeholder="Search companies, industries, or locations..."
                  aria-label="Search companies"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* <select
                value={industry}
                onChange={(event) =>
                  handleIndustryChange(event.target.value)
                }
                aria-label="Filter by industry"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="">All industries</option>
                {industries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select> */}
            </div>
          </div>
        </section>

        {/* Directory */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Explore companies
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Finding companies..."
                  : `${pagination.total || 0} ${pagination.total === 1 ? "company" : "companies"
                  }`}
              </p>
            </div>
            {/* 
            <button
              type="button"
              onClick={fetchCompanies}
              disabled={loading}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button> */}
          </div>

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <p className="flex-1 text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={fetchCompanies}
                className="self-start text-sm font-semibold text-red-700 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-6 h-12 rounded bg-slate-100" />
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-xl bg-slate-100" />
                    <div className="h-20 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : !error && companies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Building2 className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No companies found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a different search term or select another industry
                to explore available companies.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setIndustry("");
                  setPage(1);
                }}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <CompanyCard
                    key={company._id || company.id}
                    company={company}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="px-2 text-sm text-slate-500">
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
