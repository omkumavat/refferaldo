import React from "react";
import { X, Save, Loader2 } from "lucide-react";

const EditProfile = ({ profile, setProfile, onClose, onSave, saving }) => {
  const update = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
              <p className="text-sm text-slate-500">Update your role details</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Designation</label>
              <input
                value={profile?.designation || ""}
                onChange={(e) => update("designation", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">Department</label>
              <input
                value={profile?.department || ""}
                onChange={(e) => update("department", e.target.value)}
                placeholder="e.g. Engineering"
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">Employment Status</label>
              <select
                value={profile?.employmentStatus || "active"}
                onChange={(e) => update("employmentStatus", e.target.value)}
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Read-only verification info — set by an admin/HR verifier, not self-editable */}
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Verification (set by your organization admin)
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-slate-900 capitalize">
                  {profile?.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
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