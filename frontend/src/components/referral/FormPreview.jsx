import React from "react";
import {
  MapPin,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

export const FormPreview = ({ job, questions }) => {
  const experience = () => {
    if (!job.experienceMin && !job.experienceMax) {
      return null;
    }

    if (
      job.experienceMin &&
      job.experienceMax
    ) {
      return `${job.experienceMin}–${job.experienceMax} years`;
    }

    if (job.experienceMin) {
      return `${job.experienceMin}+ years`;
    }

    return `Up to ${job.experienceMax} years`;
  };

  const salary = () => {
    if (!job.salaryMin && !job.salaryMax) {
      return null;
    }

    const format = (value) =>
      Number(value).toLocaleString("en-IN");

    if (job.salaryMin && job.salaryMax) {
      return `₹${format(job.salaryMin)} – ₹${format(
        job.salaryMax
      )}`;
    }

    if (job.salaryMin) {
      return `₹${format(job.salaryMin)}+`;
    }

    return `Up to ₹${format(job.salaryMax)}`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden">
      {/* Preview header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Live preview
          </span>
        </div>

        <span className="text-[11px] text-slate-400">
          Public form
        </span>
      </div>

      {/* Form */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="p-6 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {job.title || "Your job title"}
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {job.description ||
                "Your job description will appear here."}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {job.location && (
                <span className="preview-chip">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              )}

              <span className="preview-chip">
                <BriefcaseBusiness className="w-3 h-3" />
                {job.workMode}
              </span>

              {experience() && (
                <span className="preview-chip">
                  <Clock3 className="w-3 h-3" />
                  {experience()}
                </span>
              )}

              {salary() && (
                <span className="preview-chip">
                  <IndianRupee className="w-3 h-3" />
                  {salary()}
                </span>
              )}
            </div>

            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
                Apply for this referral
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Fill in the details below to submit your application.
              </p>
            </div>

            <div className="space-y-5">
              {questions.map((question, index) => (
                <PreviewQuestion
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </div>

            <button
              type="button"
              className="w-full mt-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
            >
              Submit application
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-slate-400">
              <CheckCircle2 className="w-3 h-3" />
              Powered by Referly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreviewQuestion = ({ question }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {question.question || "Your question"}

        {question.required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      {question.type === "textarea" && (
        <textarea
          disabled
          rows={3}
          placeholder={
            question.placeholder || "Your answer..."
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-xs"
        />
      )}

      {["text", "email", "phone", "number", "url"].includes(
        question.type
      ) && (
        <input
          disabled
          type={
            question.type === "number"
              ? "number"
              : question.type
          }
          placeholder={
            question.placeholder || "Your answer..."
          }
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-xs"
        />
      )}

      {question.type === "file" && (
        <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-400">
          Click to upload file
        </div>
      )}

      {question.type === "radio" && (
        <div className="space-y-2">
          {(question.options || []).map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-xs text-slate-600"
              >
                <input
                  type="radio"
                  disabled
                  name={question.id}
                />
                {option}
              </label>
            )
          )}
        </div>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2">
          {(question.options || []).map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-xs text-slate-600"
              >
                <input
                  type="checkbox"
                  disabled
                />
                {option}
              </label>
            )
          )}
        </div>
      )}

      {question.type === "select" && (
        <select
          disabled
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-400"
        >
          <option>Select an option</option>

          {(question.options || []).map(
            (option) => (
              <option key={option}>
                {option}
              </option>
            )
          )}
        </select>
      )}
    </div>
  );
};