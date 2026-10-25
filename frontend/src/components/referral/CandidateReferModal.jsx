
import React, { useEffect, useState } from "react";
import {
  X,
  Briefcase,
  MapPin,
  Clock,
  CalendarDays,
  LoaderCircle,
  Send,
  CheckCircle2,

} from "lucide-react";

import {
  getAvailableReferralForms,
  referCandidateToForm,
} from "../../api/referralApi";
import { SuccessCandidate } from "./SuccessCandidate";
import { ShowCandidateInfo } from "./showCandidateInfo";
import { Link } from "react-router-dom";

export const CandidateReferModal = ({
  candidate,
  onClose,
  onSuccess,
  setFormId
}) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyFormId, setBusyFormId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [successCandidate, setSuccessCandidate] = useState(null);
  const [showCandidateInfo, setShowCandidateInfo] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [localUser] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  );
  

  useEffect(() => {
    let cancelled = false;

    const loadForms = async () => {
      try {
        const result = await getAvailableReferralForms(localUser.id, candidate.id);
        console.log(result);

        if (!cancelled) {
          setForms(result.data.forms || []);
          console.log(result.data.submissions);
          
          setSubmissions(result.data.submissions || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadForms();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="refer-modal-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 sm:p-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Employee referrals
            </span>

            <h2
              id="refer-modal-title"
              className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl"
            >
              Select a referral form
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose an open role for{" "}
              <span className="font-semibold text-slate-800">
                {candidate.name}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Candidate summary */}


        {/* Form list */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              {success}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-500">
              <LoaderCircle className="mb-3 animate-spin text-emerald-600" size={28} />
              <p className="text-sm">Loading available referral forms...</p>
            </div>
          ) : forms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center">
              <Briefcase className="mx-auto mb-3 text-slate-400" size={30} />
              <p className="font-semibold text-slate-800">
                No active referral forms
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your company currently has no available roles for referral.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => {
                const isBusy = busyFormId === form._id;

                return (
                  <div
                    key={form._id}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {form.title || "Untitled role"}
                          </h3>

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            Active
                          </span>
                        </div>

                        {form.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
                            {form.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          {form.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={14} />
                              {form.location}
                            </span>
                          )}

                          {form.experience && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={14} />
                              {typeof form.experience === "object"
                                ? `${form.experience.min ?? 0}–${form.experience.max ?? "Any"} years`
                                : form.experience}
                            </span>
                          )}

                          {form.deadline && (
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              Due{" "}
                              {new Date(form.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {form.skills?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {form.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        <button
                          type="button"
                          disabled={
                            Boolean(busyFormId) ||
                            Boolean(success) ||
                            Boolean(
                              submissions?.find(
                                (sub) => sub.formId === form._id && sub.referred === true
                              )
                            )
                          }
                          onClick={() => {
                            setFormId(form._id);
                            onSuccess?.();
                          }}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isBusy ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <Send size={15} />
                          )}

                          {isBusy
                            ? "Referring..."
                            : submissions?.find(
                              (sub) => sub.formId === form._id && sub.referred === true
                            )
                              ? "Already Referred"
                              : "Refer candidate"}
                        </button>

                        {submissions?.some(
                          (sub) => sub.formId === form._id && sub.referred === true
                        ) && (
                            <Link
                              to={`/employee/referral/form/submission?formId=${form._id}`}
                              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              Check out form submission
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs text-slate-500">
            {forms.length} active {forms.length === 1 ? "form" : "forms"}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

};

export default CandidateReferModal;
