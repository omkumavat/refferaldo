import React from "react";
import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

export const FormPreview = ({
  job = {},
  questions = [],
  mode = "preview",
  answers = {},
  onAnswerChange,
  onSubmit,
  submitting = false,
}) => {
  const isApplyMode = mode === "apply";
  console.log(job)

  const experience = () => {
    const min = job.experienceMin;
    const max = job.experienceMax;

    if (!min && !max) return null;
    if (!min && max) return `${min}–${max} years`;
    if (min) return `${min}+ years`;

    return `Up to ${max} years`;
  };

  const salary = () => {
    const min = job.salaryMin;
    const max = job.salaryMax;

    if (!min && !max) return null;

    const format = (value) =>
      Number(value).toLocaleString("en-IN");

    if (min && max)
      return `₹${format(min)} – ₹${format(max)}`;
    if (min) return `₹${format(min)}+`;

    return `Up to ₹${format(max)}`;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {isApplyMode ? "Application form" : "Live preview"}
          </span>
        </div>

        <span className="text-[11px] text-slate-400">
          {isApplyMode ? "Public form" : "Preview"}
        </span>
      </div>

      <div className="p-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {job.company?.name || "Your Company Name"}
              </h2>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {job.title || "Your job title"}
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-500">
              {job.description || ""}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {job.location && (
                <span className="preview-chip">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              )}

              {job.department && (
                <span className="preview-chip">
                  <BriefcaseBusiness className="h-3 w-3" />
                  {job.department}
                </span>
              )}

              {job.workMode && (
                <span className="preview-chip">
                  <BriefcaseBusiness className="h-3 w-3" />
                  {job.workMode}
                </span>
              )}

              {job.employmentType && (
                <span className="preview-chip">
                  <BriefcaseBusiness className="h-3 w-3" />
                  {job.employmentType}
                </span>
              )}

              {experience() && (
                <span className="preview-chip">
                  <Clock3 className="h-3 w-3" />
                  {experience()}
                </span>
              )}

              {salary() && (
                <span className="preview-chip">
                  <IndianRupee className="h-3 w-3" />
                  {salary()}
                </span>
              )}

              {job.applicationDeadline && (
                <span className="preview-chip">
                  <Clock3 className="h-3 w-3" />
                  Deadline:&nbsp;
                  {new Date(job?.applicationDeadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              )}
            </div>

            {job.skills?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {/* <span className="preview-chip">
                Skills required: 
                </span> */}
                {job.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
                Apply for this referral
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Fill in the details below to submit your application.
              </p>
            </div>

            <div className="space-y-5">
              {questions.map((question, index) => (
                <PreviewQuestion
                  key={question._id || question.id || index}
                  question={question}
                  index={index}
                  mode={mode}
                  value={
                    answers[question._id || question.id] ??
                    (question.type === "checkbox" ? [] : "")
                  }
                  onChange={(value) =>
                    onAnswerChange?.(
                      question._id || question.id,
                      value
                    )
                  }
                />
              ))}
            </div>

            {/* {isApplyMode && ( */}
            <button
              type="button"
              disabled={submitting || !isApplyMode}
              onClick={onSubmit}
              className="mt-6 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit application"}
            </button>
            {/* )} */}

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <CheckCircle2 className="h-3 w-3" />
              Powered by refermy.life
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewQuestion = ({
  question,
  mode,
  value,
  onChange,
}) => {
  const disabled = mode !== "apply";
  const options = question.options || [];

  const common =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 disabled:text-slate-400";

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
        {question.question || "Your question"}
        {question.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {question.type === "textarea" && (
        <textarea
          disabled={disabled}
          required={disabled ? false : question.required}
          rows={3}
          value={value}
          placeholder={question.placeholder || "Your answer..."}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )}

      {["text", "email", "phone", "number", "url"].includes(
        question.type
      ) && (
          <input
            disabled={disabled}
            required={disabled ? false : question.required}
            type={
              question.type === "phone"
                ? "tel"
                : question.type
            }
            value={value}
            placeholder={question.placeholder || "Your answer..."}
            onChange={(e) => onChange(e.target.value)}
            className={common}
          />
        )}

      {question.type === "file" && (
        <input
          disabled={disabled}
          required={disabled ? false : question.required}
          type="file"
          onChange={(e) =>
            onChange(e.target.files?.[0] || null)
          }
          className={common}
        />
      )}

      {question.type === "radio" && (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <input
                type="radio"
                disabled={disabled}
                required={!disabled && question.required}
                name={String(question._id || question.id)}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <input
                type="checkbox"
                disabled={disabled}
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];

                  onChange(
                    e.target.checked
                      ? [...current, option]
                      : current.filter((item) => item !== option)
                  );
                }}
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "select" && (
        <select
          disabled={disabled}
          required={!disabled && question.required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
