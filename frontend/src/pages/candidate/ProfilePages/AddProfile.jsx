
import React, { useEffect, useId, useState } from "react";
import {
  X,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  BadgeCheck,
  CalendarDays,
  Link as LinkIcon,
  FileText,
  Plus,
  AlertCircle,
} from "lucide-react";

const CONFIG = {
  experience: {
    title: "Add Experience",
    subtitle: "Highlight your professional experience and responsibilities.",
    icon: Briefcase,
    fields: [
      { key: "position", label: "Position", placeholder: "e.g. Software Engineer" },
      { key: "company", label: "Company", placeholder: "e.g. Acme Technologies" },
      { key: "startDate", label: "Start Date", type: "date" },
      {
        key: "endDate",
        label: "End Date",
        type: "date",
        required: false,
        hint: "Leave blank if this is your current role.",
      },
      {
        key: "description",
        label: "Description",
        placeholder: "Describe your responsibilities, contributions, and impact...",
        textarea: true,
        required: false,
        rows: 4,
      },
    ],
  },

  education: {
    title: "Add Education",
    subtitle: "Add your academic background and qualifications.",
    icon: GraduationCap,
    fields: [
      {
        key: "degree",
        label: "Degree",
        placeholder: "e.g. B.E. Computer Engineering",
      },
      {
        key: "institution",
        label: "Institution",
        placeholder: "e.g. Pune Institute of Computer Technology",
      },
      { key: "startDate", label: "Start Date", type: "date" },
      {
        key: "endDate",
        label: "End Date",
        type: "date",
        required: false,
        hint: "Leave blank if you are currently studying.",
      },
    ],
  },

  project: {
    title: "Add Project",
    subtitle: "Showcase a project you have built or contributed to.",
    icon: FolderKanban,
    fields: [
      { key: "name", label: "Project Name", placeholder: "e.g. Refermy.life" },
      {
        key: "technologies",
        label: "Technologies",
        placeholder: "React, Node.js, MongoDB",
        hint: "Separate each technology with a comma.",
        required: false,
      },
      {
        key: "link",
        label: "Project URL",
        placeholder: "https://github.com/username/project",
        required: false,
      },
      {
        key: "description",
        label: "Description",
        placeholder: "What does your project do? Mention key features and your contribution...",
        textarea: true,
        required: false,
        rows: 4,
      },
    ],
  },

  achievement: {
    title: "Add Achievement",
    subtitle: "Share awards, competition results, and milestones.",
    icon: Award,
    fields: [
      { key: "title", label: "Achievement Title", placeholder: "e.g. Hackathon Finalist" },
      {
        key: "organization",
        label: "Organization",
        placeholder: "e.g. Smart India Hackathon",
        required: false,
      },
      {
        key: "year",
        label: "Year",
        type: "number",
        placeholder: "e.g. 2026",
        min: 1900,
      },
      {
        key: "description",
        label: "Description",
        placeholder: "Add details about your achievement...",
        textarea: true,
        required: false,
        rows: 3,
      },
    ],
  },

  certification: {
    title: "Add Certification",
    subtitle: "Include relevant certifications and professional credentials.",
    icon: BadgeCheck,
    fields: [
      {
        key: "name",
        label: "Certification Name",
        placeholder: "e.g. AWS Certified Cloud Practitioner",
      },
      {
        key: "issuer",
        label: "Issuing Organization",
        placeholder: "e.g. Amazon Web Services",
      },
      { key: "issueDate", label: "Issue Date", type: "date" },
      {
        key: "credentialUrl",
        label: "Credential URL",
        placeholder: "https://example.com/verify-credential",
        required: false,
      },
    ],
  },
};

const inputClasses =
  "block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm outline-none transition duration-150 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-100";

const labelClasses = "mb-2 block text-sm font-semibold text-slate-800";

const isValidUrl = (value) => {
  if (!value?.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const AddProfile = ({ type, onClose, onAdd }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const formId = useId();

  const config = CONFIG[type];

  useEffect(() => {
    setForm({});
    setErrors({});
    setSubmitting(false);
  }, [type]);

  if (!config) return null;

  const Icon = config.icon;

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));

    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    for (const field of config.fields) {
      const value = form[field.key];
      const isEmpty =
        value === undefined ||
        value === null ||
        String(value).trim() === "";

      if (field.required !== false && isEmpty) {
        nextErrors[field.key] = `${field.label} is required.`;
        continue;
      }

      if (isEmpty) continue;

      if (
        ["link", "credentialUrl"].includes(field.key) &&
        !isValidUrl(String(value))
      ) {
        nextErrors[field.key] = "Enter a valid URL starting with http:// or https://.";
      }

      if (field.key === "year") {
        const year = Number(value);
        const currentYear = new Date().getFullYear();

        if (!Number.isInteger(year) || year < 1900 || year > currentYear + 10) {
          nextErrors[field.key] = `Enter a valid year between 1900 and ${currentYear + 10}.`;
        }
      }
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      nextErrors.endDate = "End date cannot be earlier than start date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !validateForm()) return;

    const payload = { ...form, id: Date.now() };

    if (type === "project" && typeof payload.technologies === "string") {
      payload.technologies = payload.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);
    }

    if (type === "achievement" && payload.year !== undefined) {
      payload.year = payload.year === "" ? undefined : Number(payload.year);
    }

    try {
      setSubmitting(true);
      await onAdd(payload);
    } catch (error) {
      console.error("Failed to add profile item:", error);
      setErrors((previous) => ({
        ...previous,
        _form: "Unable to add this entry. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field, index) => {
    const fieldId = `${formId}-${field.key}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const hasError = Boolean(errors[field.key]);
    const isDate = field.type === "date";

    return (
      <div
        key={field.key}
        className={field.textarea ? "sm:col-span-2" : ""}
      >
        <label htmlFor={fieldId} className={labelClasses}>
          {field.label}
          {field.required === false ? (
            <span className="ml-1.5 font-normal text-slate-500">
              (Optional)
            </span>
          ) : (
            <span className="ml-1 text-rose-600">*</span>
          )}
        </label>

        <div className="relative">
          {isDate && (
            <CalendarDays
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            />
          )}

          {field.textarea ? (
            <textarea
              id={fieldId}
              name={field.key}
              rows={field.rows || 3}
              value={form[field.key] || ""}
              onChange={(event) =>
                updateField(field.key, event.target.value)
              }
              placeholder={field.placeholder}
              required={field.required !== false}
              aria-invalid={hasError}
              aria-describedby={[
                field.hint ? hintId : "",
                hasError ? errorId : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined}
              className={`${inputClasses} min-h-24 resize-y`}
            />
          ) : (
            <input
              id={fieldId}
              name={field.key}
              type={field.type || "text"}
              value={form[field.key] || ""}
              onChange={(event) =>
                updateField(field.key, event.target.value)
              }
              placeholder={isDate ? "Select date" : field.placeholder}
              required={field.required !== false}
              min={field.min}
              max={field.key === "year" ? new Date().getFullYear() + 10 : undefined}
              aria-invalid={hasError}
              aria-describedby={[
                field.hint ? hintId : "",
                hasError ? errorId : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined}
              className={`${inputClasses} ${
                isDate ? "pl-10" : ""
              } ${field.type === "number" ? "[appearance:textfield]" : ""}`}
            />
          )}
        </div>

        {field.hint && (
          <p id={hintId} className="mt-1.5 text-xs leading-5 text-slate-600">
            {field.hint}
          </p>
        )}

        {hasError && (
          <p
            id={errorId}
            className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-rose-600"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {errors[field.key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        aria-describedby={`${formId}-description`}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 pt-0.5">
              <h2
                id={`${formId}-title`}
                className="text-lg font-bold tracking-tight text-slate-50 sm:text-xl"
              >
                {config.title}
              </h2>
              <p
                id={`${formId}-description`}
                className="mt-1 max-w-lg text-sm leading-5 text-slate-600"
              >
                {config.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close form"
            className="shrink-0 rounded-xl border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/15 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Form body */}
        <form
          id={`${formId}-form`}
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-6 sm:px-7">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Fields marked with <span className="text-rose-600">*</span> are required.
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6">
              {config.fields.map(renderField)}
            </div>

            {errors._form && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{errors._form}</p>
              </div>
            )}

            {type === "project" && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <p className="text-xs leading-5 text-slate-600">
                  Tip: Include the problem you solved, the technologies you
                  used, and your individual contribution to the project.
                </p>
              </div>
            )}

            {type === "certification" && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4">
                <LinkIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <p className="text-xs leading-5 text-slate-600">
                  A public verification link helps employers validate your
                  credential. You can leave it blank if you do not have one.
                </p>
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs text-slate-500">
              You can edit this information later.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add {config.title.replace("Add ", "")}
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default AddProfile;
