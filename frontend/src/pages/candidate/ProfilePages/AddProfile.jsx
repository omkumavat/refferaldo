import React, { useEffect, useState } from "react";
import {
  X,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  BadgeCheck,
} from "lucide-react";

/* ---------------------------------------------------------
   CONFIG — mirrors the CandidateProfile schema field-for-field
--------------------------------------------------------- */

const CONFIG = {
  experience: {
    title: "Add Experience",
    icon: Briefcase,
    fields: [
      { key: "position", label: "Position", placeholder: "Software Engineer" },
      { key: "company", label: "Company", placeholder: "Acme Corp" },
      { key: "startDate", label: "Start Date", type: "date" },
      {
        key: "endDate",
        label: "End Date",
        type: "date",
        required: false,
        hint: "Leave blank if this is your current role",
      },
      {
        key: "description",
        label: "Description",
        placeholder: "What did you work on?",
        textarea: true,
        required: false,
      },
    ],
  },

  education: {
    title: "Add Education",
    icon: GraduationCap,
    fields: [
      {
        key: "degree",
        label: "Degree",
        placeholder: "B.E. Computer Engineering",
      },
      {
        key: "institution",
        label: "Institution",
        placeholder: "Pune Institute of Computer Technology",
      },
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date", required: false },
    ],
  },

  project: {
    title: "Add Project",
    icon: FolderKanban,
    fields: [
      { key: "name", label: "Project Name", placeholder: "Referly" },
      {
        key: "technologies",
        label: "Technologies",
        placeholder: "React, Node.js, MongoDB",
        hint: "Comma-separated",
        required: false,
      },
      {
        key: "link",
        label: "Project URL",
        placeholder: "https://github.com/...",
        required: false,
      },
      {
        key: "description",
        label: "Description",
        placeholder: "Describe your project...",
        textarea: true,
        required: false,
      },
    ],
  },

  achievement: {
    title: "Add Achievement",
    icon: Award,
    fields: [
      { key: "title", label: "Title", placeholder: "Hackathon Winner" },
      {
        key: "organization",
        label: "Organization",
        placeholder: "Smart India Hackathon",
        required: false,
      },
      { key: "year", label: "Year", type: "number", placeholder: "2026" },
      {
        key: "description",
        label: "Description",
        placeholder: "What was the achievement about?",
        textarea: true,
        required: false,
      },
    ],
  },

  certification: {
    title: "Add Certification",
    icon: BadgeCheck,
    fields: [
      {
        key: "name",
        label: "Certification",
        placeholder: "AWS Cloud Practitioner",
      },
      {
        key: "issuer",
        label: "Issuer",
        placeholder: "Amazon Web Services",
      },
      { key: "issueDate", label: "Issue Date", type: "date" },
      {
        key: "credentialUrl",
        label: "Credential URL",
        placeholder: "https://...",
        required: false,
      },
    ],
  },
};

const AddProfile = ({ type, onClose, onAdd }) => {
  const [form, setForm] = useState({});
  const config = CONFIG[type];

  useEffect(() => {
    setForm({});
  }, [type]);

  if (!config) return null;

  const Icon = config.icon;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form, id: Date.now() };

    // Split technologies into an array to match the schema ([String])
    if (type === "project" && typeof payload.technologies === "string") {
      payload.technologies = payload.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Year should be stored as a Number to match the schema
    if (type === "achievement" && payload.year !== undefined) {
      payload.year = payload.year === "" ? undefined : Number(payload.year);
    }

    onAdd(payload);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </span>
            )}
            <h2 className="font-semibold text-lg text-slate-900">
              {config.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200/70 text-slate-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.label}
                {field.required === false && (
                  <span className="text-slate-400 font-normal"> (optional)</span>
                )}
              </label>

              {field.textarea ? (
                <textarea
                  rows={4}
                  value={form[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="input w-full resize-none"
                  required={field.required !== false}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="input w-full"
                  required={field.required !== false}
                />
              )}

              {field.hint && (
                <p className="text-xs text-slate-400 mt-1">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-3 border-t mt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              Add {config.title.replace("Add ", "")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;