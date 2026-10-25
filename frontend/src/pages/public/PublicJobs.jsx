
import React, { useEffect, useMemo, useState } from "react";
import { JobCard } from "../../components/JobCard";
import {
    Search,
    SlidersHorizontal,
    RefreshCw,
    BriefcaseBusiness,
} from "lucide-react";
import { Footer, PublicNav } from "../../components/layout/PublicNav";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const PublicJobs = () => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [workMode, setWorkMode] = useState("all");
    const [applicationStatus, setApplicationStatus] = useState("all");
    const [localUser] = useState(
        JSON.parse(
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            "{}"
        )
    );
    const candidateId = localUser?.id || localUser?._id;
    const isCandidate = Boolean(
        localUser?.role === "candidate" && candidateId
    );

    const fetchReferralForms = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                sessionStorage.getItem("token") ||
                localStorage.getItem("token");

            const endpoint = isCandidate
                ? `${API_BASE_URL}/referrals/candidate/forms/available/${candidateId}`
                : `${API_BASE_URL}/referrals/forms/public`;

            const response = await fetch(
                `${endpoint}`,
                {
                    headers: {
                        ...(isCandidate ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load referral opportunities"
                );
            }


            isCandidate ? setForms(result.data || []) : setForms(result.form || []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferralForms();
    }, []);

    const filteredForms = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = forms.filter((form) => {
            const companyName =
                form.company?.name ||
                form.company?.companyname ||
                form.companyname ||
                "";

            const searchableText = [
                form.title,
                form.description,
                companyName,
                form.location,
                ...(Array.isArray(form.skills) ? form.skills : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (query && !searchableText.includes(query)) {
                return false;
            }

            if (
                workMode !== "all" &&
                String(form.workMode || "").toLowerCase() !== workMode
            ) {
                return false;
            }

            if (
                applicationStatus === "applied" &&
                !form.hasApplied
            ) {
                return false;
            }

            if (
                applicationStatus === "not-applied" &&
                form.hasApplied
            ) {
                return false;
            }

            return true;
        });

        return filtered.sort((a, b) => {
            if (sortBy === "match") {
                return (
                    (b.matchScore ?? -1) - (a.matchScore ?? -1)
                );
            }

            if (sortBy === "deadline") {
                if (!a.applicationDeadline) return 1;
                if (!b.applicationDeadline) return -1;

                return (
                    new Date(a.applicationDeadline) -
                    new Date(b.applicationDeadline)
                );
            }

            return (
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
            );
        });
    }, [
        forms,
        search,
        sortBy,
        workMode,
        applicationStatus,
    ]);

    const appliedCount = forms.filter(
        (form) => form.hasApplied
    ).length;

    return (
        <>
            <div className="min-h-screen page-container py-2">
                <PublicNav />
                <div className="mb-6 mt-6 flex flex-wrap items-start justify-between gap-4 page-container py-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Find Referral Opportunities
                        </h1>

                        <p className="mt-1 text-sm text-slate-600">
                            Explore open referrals, find your best matches, and track
                            the forms you've already submitted.
                        </p>
                    </div>


                </div>

                {/* Search and filters */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 page-container py-2">
                    <div className="relative mb-4 ">
                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search roles, companies, locations or skills..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ">
                        <SlidersHorizontal size={14} />
                        Filters and sorting
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 ">
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        >
                            <option value="recent">Most Recent</option>
                            {
                                isCandidate && (
                                    <option value="match">Best Match</option>
                                )
                            }
                            <option value="deadline">Deadline Soon</option>
                        </select>

                        <select
                            value={workMode}
                            onChange={(event) => setWorkMode(event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                        >
                            <option value="all">All Work Modes</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">On-site</option>
                            <option value="on-site">On-site</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={fetchReferralForms}
                            className="font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white"
                            />
                        ))}
                    </div>
                ) : filteredForms.length > 0 ? (
                    <>
                        <div className="mb-4 flex items-center justify-between page-container py-2">
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">
                                    {filteredForms.length}
                                </span>{" "}
                                opportunities found
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 page-container py-2">
                            {filteredForms.map((form) => {
                                const company = form.company || {
                                    name: form.companyname || "Company",
                                };

                                const job = {
                                    ...form,
                                    id: form._id,
                                    title: form.title,
                                    skills: form.skills || [],
                                    postedAgo: form.createdAt
                                        ? new Date(form.createdAt).toLocaleDateString()
                                        : "Recently posted",
                                    experience:
                                        form.experienceMin != null ||
                                            form.experienceMax != null
                                            ? `${form.experienceMin ?? 0}–${form.experienceMax ?? "Any"} years`
                                            : null,
                                    salary:
                                        form.salaryMin != null ||
                                            form.salaryMax != null
                                            ? `${form.salaryMin ?? "Negotiable"} – ${form.salaryMax ?? "Negotiable"}`
                                            : null,
                                };

                                return (
                                    <div
                                        key={form._id}
                                        className="relative"
                                    >
                                        {form.hasApplied && (
                                            <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                                                {form.submissionStatus
                                                    ? form.submissionStatus.toUpperCase()
                                                    : "APPLIED"}
                                            </span>
                                        )}

                                        <JobCard
                                            job={job}
                                            company={company}
                                            applied={form.hasApplied}
                                            matchScore={form.matchScore}
                                            ctaLabel="Apply Now"
                                            ctaTo={`/candidate/apply/${form.slug}`}
                                        />

                                        {form.applicationDeadline && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                Deadline:{" "}
                                                {new Date(
                                                    form.applicationDeadline
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                        <BriefcaseBusiness
                            size={32}
                            className="mx-auto text-slate-400"
                        />

                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            No referral opportunities found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters to see more opportunities.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setSortBy("recent");
                                setWorkMode("all");
                                setApplicationStatus("all");
                            }}
                            className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};
