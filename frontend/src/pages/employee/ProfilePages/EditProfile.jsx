
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Loader2,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const EditProfile = ({
  profile,
  setProfile,
  onClose,
  onSave,
  saving,
}) => {
  const [errors, setErrors] = useState({});

  const designation = profile?.designation || "";
  const department = profile?.department || "";
  const employmentStatus = profile?.employmentStatus || "active";

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, saving]);

  const update = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
      form: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!designation.trim()) {
      nextErrors.designation = "Designation is required.";
    } else if (designation.trim().length < 2) {
      nextErrors.designation =
        "Designation must be at least 2 characters.";
    } else if (designation.trim().length > 100) {
      nextErrors.designation =
        "Designation cannot exceed 100 characters.";
    }

    if (!department.trim()) {
      nextErrors.department = "Department is required.";
    } else if (department.trim().length > 100) {
      nextErrors.department =
        "Department cannot exceed 100 characters.";
    }

    if (!["active", "inactive"].includes(employmentStatus)) {
      nextErrors.employmentStatus =
        "Please select a valid employment status.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (saving || !validate()) return;

    try {
      // Supports either synchronous or asynchronous parent handlers.
      await onSave();
    } catch (error) {
      setErrors({
        form:
          error?.message ||
          "Unable to save your profile. Please try again.",
      });
    }
  };

  const verificationStatus =
    profile?.verificationStatus || "pending";

  const verificationStyles = {
    verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-neutral-200 bg-neutral-50 px-5 py-5 sm:px-7">
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-emerald-400 shadow-sm">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h2
                  id="edit-profile-title"
                  className="text-xl font-bold tracking-tight text-neutral-900"
                >
                  Edit Profile
                </h2>
                <p className="mt-1 text-sm leading-5 text-neutral-500">
                  Keep your professional details up to date.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close edit profile"
              className="rounded-lg p-2 text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="space-y-6 px-5 py-6 sm:px-7">
          {errors.form && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{errors.form}</p>
            </div>
          )}

          {/* Designation */}
          <div>
            <label
              htmlFor="profile-designation"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Designation <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="profile-designation"
                type="text"
                value={designation}
                onChange={(e) =>
                  update("designation", e.target.value)
                }
                placeholder="e.g. Senior Software Engineer"
                maxLength={100}
                autoComplete="organization-title"
                aria-invalid={!!errors.designation}
                aria-describedby={
                  errors.designation
                    ? "designation-error"
                    : "designation-hint"
                }
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
                  errors.designation
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                    : "border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />
            </div>

            <div className="mt-1.5 flex items-start justify-between gap-3">
              {errors.designation ? (
                <p
                  id="designation-error"
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {errors.designation}
                </p>
              ) : (
                <p
                  id="designation-hint"
                  className="text-xs text-neutral-500"
                >
                  Your current professional role.
                </p>
              )}

              <span className="shrink-0 text-xs text-neutral-400">
                {designation.length}/100
              </span>
            </div>
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="profile-department"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Department <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Building2
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                id="profile-department"
                type="text"
                value={department}
                onChange={(e) =>
                  update("department", e.target.value)
                }
                placeholder="e.g. Engineering"
                maxLength={100}
                autoComplete="organization"
                aria-invalid={!!errors.department}
                aria-describedby={
                  errors.department ? "department-error" : undefined
                }
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-4 ${
                  errors.department
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                    : "border-neutral-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                }`}
              />
            </div>

            {errors.department && (
              <p
                id="department-error"
                role="alert"
                className="mt-1.5 text-xs text-red-600"
              >
                {errors.department}
              </p>
            )}
          </div>

          {/* Employment status */}
          <div>
            <label
              htmlFor="profile-employment-status"
              className="mb-2 block text-sm font-semibold text-neutral-800"
            >
              Employment Status
            </label>

            <div className="relative">
              <select
                id="profile-employment-status"
                value={employmentStatus}
                onChange={(e) =>
                  update("employmentStatus", e.target.value)
                }
                aria-invalid={!!errors.employmentStatus}
                className={`w-full appearance-none rounded-xl border bg-white py-3 pl-4 pr-11 text-sm text-neutral-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                  errors.employmentStatus
                    ? "border-red-400"
                    : "border-neutral-200"
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>

            {errors.employmentStatus && (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.employmentStatus}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  employmentStatus === "active"
                    ? "bg-emerald-500"
                    : "bg-neutral-400"
                }`}
              />
              <span className="text-xs text-neutral-500">
                {employmentStatus === "active"
                  ? "Currently employed"
                  : "Not currently employed"}
              </span>
            </div>
          </div>

          {/* Verification information */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Organization Verification
                  </h3>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                      verificationStyles[verificationStatus] ||
                      "bg-neutral-100 text-neutral-600 ring-neutral-200"
                    }`}
                  >
                    {verificationStatus === "verified" && (
                      <CheckCircle2 size={13} />
                    )}
                    {verificationStatus}
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-5 text-neutral-500">
                  Your organization admin manages this status.
                  It cannot be changed from your profile settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-neutral-500">
            <span className="text-red-500">*</span> Required fields
          </p>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
