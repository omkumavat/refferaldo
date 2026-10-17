import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  Users,
  ExternalLink,
  Pencil,
  Plus,
  RefreshCw,
  Copy,
  CalendarDays,
} from "lucide-react";

import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "../../pages/employee/Dashboard.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const getStatusStyle = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "draft":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "paused":
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
    case "closed":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/20";
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const MyReferralForms = () => {
  const navigate = useNavigate();

  const [localUser] = useState(
          JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
      )
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/referrals/my/${localUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch referral forms"
        );
      }

      setForms(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Failed to fetch referral forms:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      (form.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (form.location || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || form.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Drafts open in the builder; active forms open publicly.
  const openForm = (form) => {
    if (form.status === "active") {
      navigate(`/employee/referral/form/submission?formId=${form._id}`);
      return;
    }

    navigate(`/employee/refer-job/create?edit=${form._id}`);
  };

  const copyLink = async (form) => {
    const url = `${window.location.origin}/apply/${form.slug}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(form._id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === form._id ? null : current
        );
      }, 2000);
    } catch (err) {
      console.error("Failed to copy referral link:", err);
      window.prompt("Copy your referral link:", url);
    }
  };

  return (
    <DashboardShell
      role="employee"
      roleLabel="Employee"
      userName={localUser.name}
      sidebar={employeeSidebar}
      >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-2">
              Referral management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Referral Forms
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your job referrals, share links, and track applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchForms}
              disabled={loading}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <Link
              to="/employee/refer-job/create"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create form
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label="Total forms"
            value={forms.length}
            icon={BriefcaseBusiness}
          />

          <SummaryCard
            label="Active forms"
            value={forms.filter((f) => f.status === "active").length}
            icon={ExternalLink}
          />

          <SummaryCard
            label="Total applications"
            value={forms.reduce(
              (total, form) => total + (Number(form.submissions) || 0),
              0
            )}
            icon={Users}
          />
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  All referral forms
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select a role to edit or open its public application page.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search role or location..."
                  className="form-input sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input sm:w-36"
                >
                  <option value="all">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center text-slate-500">
              <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />
              <p className="text-sm mt-3">Loading your referral forms...</p>
            </div>
          ) : error ? (
            <div className="py-16 px-5 text-center">
              <p className="font-medium text-red-600">
                Could not load referral forms
              </p>
              <p className="text-sm text-slate-500 mt-2">{error}</p>

              <button
                type="button"
                onClick={fetchForms}
                className="btn-primary mt-4"
              >
                Try again
              </button>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="py-16 px-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BriefcaseBusiness className="w-6 h-6" />
              </div>

              <h3 className="font-semibold text-slate-900 mt-4">
                {forms.length === 0
                  ? "No referral forms yet"
                  : "No matching forms"}
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                {forms.length === 0
                  ? "Create your first personal referral form and share its application link with candidates."
                  : "Try another search term or change the status filter."}
              </p>

              {forms.length === 0 && (
                <Link
                  to="/employee/refer-job/create"
                  className="btn-primary inline-flex items-center gap-2 mt-5"
                >
                  <Plus className="w-4 h-4" />
                  Create your first form
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500">
                        Role
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                        Location
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                        Applications
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500">
                        Created
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredForms.map((form) => (
                      <tr
                        key={form._id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => openForm(form)}
                            className="text-sm font-semibold text-slate-900 hover:text-emerald-700 text-left"
                          >
                            {form.title || "Untitled role"}
                          </button>

                          <p className="text-xs text-slate-500 mt-1 capitalize">
                            {(form.employmentType || "full-time").replace(
                              "-",
                              " "
                            )}
                            {" · "}
                            {form.workMode || "onsite"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(
                              form.status
                            )}`}
                          >
                            {form.status || "unknown"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {form.location || "Not specified"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                            <Users className="w-4 h-4 text-slate-400" />
                            {Number(form.submissions) || 0}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatDate(form.createdAt)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end items-center gap-2">
                            {form.status === "active" && (
                              <button
                                type="button"
                                onClick={() => copyLink(form)}
                                title="Copy public link"
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-200"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => openForm(form)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              {form.status === "active" ? (
                                <>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  Open form
                                </>
                              ) : (
                                <>
                                  <Pencil className="w-3.5 h-3.5" />
                                  {form.status === "draft" ? "Edit" : "Manage"}
                                </>
                              )}
                            </button>
                          </div>

                          {copiedId === form._id && (
                            <p className="text-xs text-emerald-700 text-right mt-1">
                              Link copied!
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredForms.map((form) => (
                  <div key={form._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => openForm(form)}
                        className="text-left font-semibold text-slate-900 hover:text-emerald-700"
                      >
                        {form.title || "Untitled role"}
                      </button>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyle(
                          form.status
                        )}`}
                      >
                        {form.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {form.location || "Location not specified"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {Number(form.submissions) || 0} applications
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5" />
                        {formatDate(form.createdAt)}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => openForm(form)}
                        className="btn-primary flex-1 inline-flex justify-center items-center gap-2"
                      >
                        {form.status === "active" ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Open public form
                          </>
                        ) : (
                          <>
                            <Pencil className="w-4 h-4" />
                            {form.status === "draft" ? "Edit draft" : "Manage form"}
                          </>
                        )}
                      </button>

                      {form.status === "active" && (
                        <button
                          type="button"
                          onClick={() => copyLink(form)}
                          className="btn-secondary inline-flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === form._id ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !error && filteredForms.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Showing {filteredForms.length} of {forms.length} referral forms
              </p>
            </div>
          )}
        </div>
      </div>
      </DashboardShell>
  );
};

const SummaryCard = ({ label, value, icon: Icon }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">{label}</p>

      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
    </div>

    <p className="text-2xl font-bold text-slate-900 mt-3">
      {value}
    </p>
  </div>
);
