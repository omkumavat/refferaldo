import React, { useState } from "react";
import {
  X,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Save,
  Loader2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  BadgeCheck,
} from "lucide-react";

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

// Convert any stored date value (ISO string / Date) into yyyy-mm-dd for <input type="date">
const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const EditProfile = ({
  profile,
  setProfile,
  onClose,
  onSave,
  saving,
  onDelete,
}) => {
  const [skillInput, setSkillInput] = useState("");

  const update = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update a single field on a single item inside one of the array sections
  const updateItem = (section, id, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((item) =>
        item._id === id || item.id === id
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const removeItem = (section, id) => {
    setProfile((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter(
        (item) => item._id !== id && item.id !== id
      ),
    }));
    onDelete?.(section, id);
  };

  /* ---------------- SKILLS ---------------- */

  const addSkill = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const skill = skillInput.trim();
    if (!skill) return;

    if (
      !profile.skills?.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill),
    }));
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">
          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-white border-b rounded-t-2xl">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Profile
                </h2>
                <p className="text-sm text-slate-500">
                  Keep your candidate profile accurate and up to date
                </p>
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
          </div>

          {/* CONTENT */}
          <div className="p-6 space-y-10">
            {/* BASIC INFORMATION */}
            <section>
              <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Basic Information" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Headline"
                  value={profile.headline}
                  onChange={(value) => update("headline", value)}
                  placeholder="e.g. Senior Backend Engineer"
                />

                <Field
                  label="Current Position"
                  value={profile.currentPosition}
                  onChange={(value) => update("currentPosition", value)}
                  placeholder="e.g. Software Engineer II"
                />

                <Field
                  label="Years of Experience"
                  type="number"
                  min={0}
                  max={60}
                  value={profile.experienceYears}
                  onChange={(value) =>
                    update("experienceYears", value === "" ? "" : Number(value))
                  }
                />

                <Field
                  label="Current Company ID"
                  value={profile.currentCompany}
                  onChange={(value) => update("currentCompany", value)}
                  placeholder="Company ObjectId"
                  hint="Internal reference to the Company record"
                />

                <div className="md:col-span-2">
                  <label className="label">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio || ""}
                    onChange={(e) => update("bio", e.target.value)}
                    className="input w-full resize-none"
                    placeholder="Tell recruiters about yourself..."
                  />
                </div>
              </div>
            </section>

            {/* SKILLS */}
            <section>
              <SectionTitle icon={<BadgeCheck className="w-4 h-4" />} title="Skills" />

              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type a skill and press Enter"
                className="input w-full"
              />

              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills?.length ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-600"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No skills added yet</p>
                )}
              </div>
            </section>

            {/* EXPERIENCE */}
            <EditableList
              icon={<Briefcase className="w-4 h-4" />}
              title="Experience"
              items={profile.experience}
              emptyText="No work experience added yet"
              onDelete={(id) => removeItem("experience", id)}
              render={(item) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Position"
                    value={item.position}
                    onChange={(v) => updateItem("experience", item._id ?? item.id, "position", v)}
                  />
                  <Field
                    label="Company"
                    value={item.company}
                    onChange={(v) => updateItem("experience", item._id ?? item.id, "company", v)}
                  />
                  <Field
                    label="Start Date"
                    type="date"
                    value={toDateInputValue(item.startDate)}
                    onChange={(v) => updateItem("experience", item._id ?? item.id, "startDate", v)}
                  />
                  <Field
                    label="End Date"
                    type="date"
                    value={toDateInputValue(item.endDate)}
                    onChange={(v) => updateItem("experience", item._id ?? item.id, "endDate", v)}
                    hint="Leave blank if this is your current role"
                  />
                  <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea
                      rows={3}
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem("experience", item._id ?? item.id, "description", e.target.value)
                      }
                      className="input w-full resize-none"
                      placeholder="What did you work on?"
                    />
                  </div>
                </div>
              )}
            />

            {/* EDUCATION */}
            <EditableList
              icon={<GraduationCap className="w-4 h-4" />}
              title="Education"
              items={profile.education}
              emptyText="No education added yet"
              onDelete={(id) => removeItem("education", id)}
              render={(item) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Degree"
                    value={item.degree}
                    onChange={(v) => updateItem("education", item._id ?? item.id, "degree", v)}
                  />
                  <Field
                    label="Institution"
                    value={item.institution}
                    onChange={(v) => updateItem("education", item._id ?? item.id, "institution", v)}
                  />
                  <Field
                    label="Start Date"
                    type="date"
                    value={toDateInputValue(item.startDate)}
                    onChange={(v) => updateItem("education", item._id ?? item.id, "startDate", v)}
                  />
                  <Field
                    label="End Date"
                    type="date"
                    value={toDateInputValue(item.endDate)}
                    onChange={(v) => updateItem("education", item._id ?? item.id, "endDate", v)}
                  />
                </div>
              )}
            />

            {/* PROJECTS */}
            <EditableList
              icon={<FolderKanban className="w-4 h-4" />}
              title="Projects"
              items={profile.projects}
              emptyText="No projects added yet"
              onDelete={(id) => removeItem("projects", id)}
              render={(item) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Project Name"
                    value={item.name}
                    onChange={(v) => updateItem("projects", item._id ?? item.id, "name", v)}
                  />
                  <Field
                    label="Link"
                    value={item.link}
                    onChange={(v) => updateItem("projects", item._id ?? item.id, "link", v)}
                    placeholder="https://..."
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Technologies"
                      value={item.technologies?.join(", ") || ""}
                      onChange={(v) =>
                        updateItem(
                          "projects",
                          item._id ?? item.id,
                          "technologies",
                          v
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="React, Node.js, MongoDB"
                      hint="Comma-separated"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea
                      rows={3}
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem("projects", item._id ?? item.id, "description", e.target.value)
                      }
                      className="input w-full resize-none"
                    />
                  </div>
                </div>
              )}
            />

            {/* ACHIEVEMENTS */}
            <EditableList
              icon={<Award className="w-4 h-4" />}
              title="Achievements"
              items={profile.achievements}
              emptyText="No achievements added yet"
              onDelete={(id) => removeItem("achievements", id)}
              render={(item) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Title"
                    value={item.title}
                    onChange={(v) => updateItem("achievements", item._id ?? item.id, "title", v)}
                  />
                  <Field
                    label="Organization"
                    value={item.organization}
                    onChange={(v) => updateItem("achievements", item._id ?? item.id, "organization", v)}
                  />
                  <Field
                    label="Year"
                    type="number"
                    value={item.year}
                    onChange={(v) =>
                      updateItem("achievements", item._id ?? item.id, "year", v === "" ? "" : Number(v))
                    }
                  />
                  <div className="md:col-span-2">
                    <label className="label">Description</label>
                    <textarea
                      rows={3}
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem("achievements", item._id ?? item.id, "description", e.target.value)
                      }
                      className="input w-full resize-none"
                    />
                  </div>
                </div>
              )}
            />

            {/* CERTIFICATIONS */}
            <EditableList
              icon={<BadgeCheck className="w-4 h-4" />}
              title="Certifications"
              items={profile.certifications}
              emptyText="No certifications added yet"
              onDelete={(id) => removeItem("certifications", id)}
              render={(item) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Name"
                    value={item.name}
                    onChange={(v) => updateItem("certifications", item._id ?? item.id, "name", v)}
                  />
                  <Field
                    label="Issuer"
                    value={item.issuer}
                    onChange={(v) => updateItem("certifications", item._id ?? item.id, "issuer", v)}
                  />
                  <Field
                    label="Issue Date"
                    type="date"
                    value={toDateInputValue(item.issueDate)}
                    onChange={(v) => updateItem("certifications", item._id ?? item.id, "issueDate", v)}
                  />
                  <Field
                    label="Credential URL"
                    value={item.credentialUrl}
                    onChange={(v) => updateItem("certifications", item._id ?? item.id, "credentialUrl", v)}
                    placeholder="https://..."
                  />
                </div>
              )}
            />

            {/* SOCIAL LINKS */}
            <section>
              <SectionTitle icon={<Globe className="w-4 h-4" />} title="Social Links" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  label="GitHub"
                  value={profile.github}
                  onChange={(value) => update("github", value)}
                  icon={<Github className="w-4 h-4" />}
                  placeholder="https://github.com/..."
                />
                <Field
                  label="LinkedIn"
                  value={profile.linkedin}
                  onChange={(value) => update("linkedin", value)}
                  icon={<Linkedin className="w-4 h-4" />}
                  placeholder="https://linkedin.com/in/..."
                />
                <Field
                  label="Portfolio"
                  value={profile.portfolio}
                  onChange={(value) => update("portfolio", value)}
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://..."
                />
                <Field
                  label="Leetcode"
                  value={profile.leetcode}
                  onChange={(value) => update("leetcode", value)}
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://..."
                />
                <Field
                  label="Codechef"
                  value={profile.codechef}
                  onChange={(value) => update("codechef", value)}
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://..."
                />
                <Field
                  label="Codeforces"
                  value={profile.codeforces}
                  onChange={(value) => update("codeforces", value)}
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="https://..."
                />
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-white border-t rounded-b-2xl px-6 py-4 flex justify-end gap-2">
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

/* ---------------------------------------------------------
   SMALL COMPONENTS
--------------------------------------------------------- */

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon,
  hint,
  min,
  max,
}) => (
  <div>
    <label className="label">{label}</label>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      <input
        type={type}
        min={min}
        max={max}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`input w-full ${icon ? "pl-9" : ""}`}
      />
    </div>

    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

const SectionTitle = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4">
    {icon && <span className="text-emerald-600">{icon}</span>}
    <h3 className="font-semibold text-slate-900">{title}</h3>
  </div>
);

const EditableList = ({ icon, title, items, render, onDelete, emptyText }) => (
  <section>
    <SectionTitle icon={icon} title={title} />

    <div className="space-y-3">
      {items?.length ? (
        items.map((item) => (
          <div
            key={item._id ?? item.id}
            className="border border-slate-200 rounded-xl p-4 flex gap-3"
          >
            <div className="flex-1">{render(item)}</div>

            <button
              type="button"
              onClick={() => onDelete(item._id ?? item.id)}
              className="text-slate-400 hover:text-red-500 shrink-0"
              aria-label={`Remove ${title} entry`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400">{emptyText}</p>
      )}
    </div>
  </section>
);

export default EditProfile;