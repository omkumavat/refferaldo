
import React, { useState } from "react";
import {
  X,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Save,
  Loader2,
  BriefcaseBusiness,
  GraduationCap,
  FolderKanban,
  Award,
  BadgeCheck,
  UserRound,
  Plus,
  Link as LinkIcon,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

/* -------------------- HELPERS -------------------- */

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
};

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const textareaClass = `${inputClass} resize-y leading-6`;

const EditProfile = ({
  profile,
  setProfile,
  onClose,
  onSave,
  saving,
  onDelete,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});

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

  const updateItem = (section, item, field, value) => {
    setProfile((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((current) => {
        const sameItem =
          current === item ||
          (item._id && current._id === item._id) ||
          (item.id && current.id === item.id);

        return sameItem
          ? { ...current, [field]: value }
          : current;
      }),
    }));
  };

  const removeItem = (section, item) => {
    const id = item._id ?? item.id;

    setProfile((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter(
        (current) => current !== item &&
          !(id && (current._id === id || current.id === id))
      ),
    }));

    onDelete?.(section, id);
  };

  const addItem = (section, defaults) => {
    setProfile((prev) => ({
      ...prev,
      [section]: [
        ...(prev[section] || []),
        { ...defaults, id: crypto.randomUUID() },
      ],
    }));
  };

  const addSkill = (e) => {
    e.preventDefault();

    const skill = skillInput.trim();

    if (!skill) return;

    if (skill.length > 50) {
      setErrors((prev) => ({
        ...prev,
        skills: "Skills must be 50 characters or fewer.",
      }));
      return;
    }

    if (
      (profile?.skills || []).some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        skills: "This skill has already been added.",
      }));
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), skill],
    }));

    setSkillInput("");
    setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const removeSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((item) => item !== skill),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if ((profile?.headline || "").length > 150) {
      nextErrors.headline = "Headline cannot exceed 150 characters.";
    }

    if ((profile?.bio || "").length > 2000) {
      nextErrors.bio = "Bio cannot exceed 2,000 characters.";
    }

    if (
      profile?.experienceYears !== "" &&
      profile?.experienceYears != null &&
      (!Number.isFinite(Number(profile.experienceYears)) ||
        Number(profile.experienceYears) < 0 ||
        Number(profile.experienceYears) > 60)
    ) {
      nextErrors.experienceYears =
        "Experience must be between 0 and 60 years.";
    }

    const urlFields = [
      "github",
      "linkedin",
      "portfolio",
      "leetcode",
      "codechef",
      "codeforces",
    ];

    urlFields.forEach((key) => {
      const value = profile?.[key]?.trim();

      if (!value) return;

      try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        nextErrors[key] = "Enter a valid URL starting with https://.";
      }
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave();
  };

  const verificationStatus =
    profile?.verificationStatus || "pending";

  const statusClasses = {
    verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
  };

  const sections = [
    { label: "Basic information", id: "basic" },
    { label: "Skills", id: "skills" },
    { label: "Experience", id: "experience" },
    { label: "Education", id: "education" },
    { label: "Projects", id: "projects" },
    { label: "Achievements", id: "achievements" },
    { label: "Certifications", id: "certifications" },
    { label: "Social links", id: "social" },
  ];

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="mx-auto flex min-h-full max-w-5xl items-start justify-center sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          className="my-auto flex max-h-[94vh] w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:rounded-3xl"
        >
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
            <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-emerald-400">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2
                    id="edit-profile-title"
                    className="text-xl font-bold tracking-tight text-neutral-150 sm:text-2xl"
                  >
                    Edit candidate profile
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-neutral-500">
                    Showcase your experience, skills and achievements.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                aria-label="Close edit profile"
                className="rounded-xl p-2 text-neutral-500 transition hover:text-neutral-900 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto px-5 pb-4 sm:px-7">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#edit-${section.id}`}
                  className="shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </header>

          {/* Scrollable form */}
          <div className="overflow-y-auto px-4 py-5 sm:px-7 sm:py-7">
            {errors.form && (
              <div
                role="alert"
                className="mb-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="shrink-0" />
                {errors.form}
              </div>
            )}

            <div className="space-y-6">
              {/* BASIC INFORMATION */}
              <Section
                id="edit-basic"
                icon={<UserRound size={19} />}
                title="Basic information"
                description="Introduce yourself and describe your professional background."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Professional headline"
                    value={profile?.headline}
                    onChange={(v) => update("headline", v)}
                    placeholder="e.g. Full-Stack Developer | React & Node.js"
                    hint="A short introduction shown on your profile."
                    maxLength={150}
                    error={errors.headline}
                  />

                  <Field
                    label="Current position"
                    value={profile?.currentPosition}
                    onChange={(v) => update("currentPosition", v)}
                    placeholder="e.g. Software Engineer"
                  />

                  <Field
                    label="Years of experience"
                    type="number"
                    min={0}
                    max={60}
                    value={profile?.experienceYears}
                    onChange={(v) =>
                      update(
                        "experienceYears",
                        v === "" ? "" : Number(v)
                      )
                    }
                    placeholder="e.g. 3"
                    hint="Enter 0 if you are a fresher."
                    error={errors.experienceYears}
                  />

                  <Field
                    label="Current company ID"
                    value={profile?.currentCompany}
                    onChange={(v) => update("currentCompany", v)}
                    placeholder="Company record ID"
                    hint="Internal company reference, if applicable."
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Professional bio"
                      type="textarea"
                      rows={4}
                      value={profile?.bio}
                      onChange={(v) => update("bio", v)}
                      placeholder="Tell recruiters about your background, strengths, career interests and the impact you've made..."
                      hint={`${(profile?.bio || "").length}/2000 characters`}
                      maxLength={2000}
                      error={errors.bio}
                    />
                  </div>
                </div>
              </Section>

              {/* SKILLS */}
              <Section
                id="edit-skills"
                icon={<BadgeCheck size={19} />}
                title="Skills"
                description="Add the technical and professional skills you want recruiters to discover."
              >
                <form onSubmit={addSkill}>
                  <label
                    htmlFor="candidate-skill"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Add a skill
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="candidate-skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. React, Python, SQL, Communication"
                      maxLength={50}
                      className={inputClass}
                    />

                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-150 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-100"
                    >
                      <Plus size={17} />
                      Add skill
                    </button>
                  </div>
                </form>

                {errors.skills && (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {errors.skills}
                  </p>
                )}

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Your skills
                    </p>
                    <span className="text-xs text-neutral-400">
                      {profile?.skills?.length || 0} added
                    </span>
                  </div>

                  {profile?.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove ${skill}`}
                            className="rounded-md p-0.5 text-emerald-700 hover:bg-red-100 hover:text-red-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<BadgeCheck size={21} />}
                      title="No skills added yet"
                      description="Add skills to help recruiters understand what you do best."
                    />
                  )}
                </div>
              </Section>

              {/* EXPERIENCE */}
              <EditableList
                id="edit-experience"
                icon={<BriefcaseBusiness size={19} />}
                title="Work experience"
                description="Show where you've worked and the impact you've made."
                items={profile?.experience}
                emptyText="Add your internships, jobs or relevant work experience."
                addLabel="Add experience"
                onAdd={() =>
                  addItem("experience", {
                    position: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                }
                onDelete={(item) => removeItem("experience", item)}
                render={(item, index) => (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Job title"
                      value={item.position}
                      onChange={(v) =>
                        updateItem("experience", item, "position", v)
                      }
                      placeholder="e.g. Software Developer Intern"
                    />

                    <Field
                      label="Company"
                      value={item.company}
                      onChange={(v) =>
                        updateItem("experience", item, "company", v)
                      }
                      placeholder="e.g. Acme Technologies"
                    />

                    <Field
                      label="Start date"
                      type="date"
                      value={toDateInputValue(item.startDate)}
                      onChange={(v) =>
                        updateItem("experience", item, "startDate", v)
                      }
                    />

                    <Field
                      label="End date"
                      type="date"
                      value={toDateInputValue(item.endDate)}
                      onChange={(v) =>
                        updateItem("experience", item, "endDate", v)
                      }
                      hint="Leave blank for your current role."
                      min={toDateInputValue(item.startDate) || undefined}
                    />

                    <div className="md:col-span-2">
                      <Field
                        label="Responsibilities and achievements"
                        type="textarea"
                        rows={3}
                        value={item.description}
                        onChange={(v) =>
                          updateItem("experience", item, "description", v)
                        }
                        placeholder="Describe your responsibilities, technologies used, contributions and measurable results..."
                      />
                    </div>
                  </div>
                )}
              />

              {/* EDUCATION */}
              <EditableList
                id="edit-education"
                icon={<GraduationCap size={19} />}
                title="Education"
                description="Add your degrees, courses and academic qualifications."
                items={profile?.education}
                emptyText="Add your college, university or relevant academic qualification."
                addLabel="Add education"
                onAdd={() =>
                  addItem("education", {
                    degree: "",
                    institution: "",
                    startDate: "",
                    endDate: "",
                  })
                }
                onDelete={(item) => removeItem("education", item)}
                render={(item) => (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Degree or qualification"
                      value={item.degree}
                      onChange={(v) =>
                        updateItem("education", item, "degree", v)
                      }
                      placeholder="e.g. B.E. Computer Engineering"
                    />

                    <Field
                      label="Institution"
                      value={item.institution}
                      onChange={(v) =>
                        updateItem("education", item, "institution", v)
                      }
                      placeholder="e.g. Pune Institute of Computer Technology"
                    />

                    <Field
                      label="Start date"
                      type="date"
                      value={toDateInputValue(item.startDate)}
                      onChange={(v) =>
                        updateItem("education", item, "startDate", v)
                      }
                    />

                    <Field
                      label="Graduation / end date"
                      type="date"
                      value={toDateInputValue(item.endDate)}
                      onChange={(v) =>
                        updateItem("education", item, "endDate", v)
                      }
                      hint="Enter your expected graduation date if applicable."
                      min={toDateInputValue(item.startDate) || undefined}
                    />
                  </div>
                )}
              />

              {/* PROJECTS */}
              <EditableList
                id="edit-projects"
                icon={<FolderKanban size={19} />}
                title="Projects"
                description="Highlight projects that demonstrate your skills and experience."
                items={profile?.projects}
                emptyText="Add a personal, academic or professional project."
                addLabel="Add project"
                onAdd={() =>
                  addItem("projects", {
                    name: "",
                    link: "",
                    technologies: [],
                    description: "",
                  })
                }
                onDelete={(item) => removeItem("projects", item)}
                render={(item) => (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Project name"
                      value={item.name}
                      onChange={(v) =>
                        updateItem("projects", item, "name", v)
                      }
                      placeholder="e.g. AI-Powered Job Referral Platform"
                    />

                    <Field
                      label="Project URL"
                      value={item.link}
                      onChange={(v) =>
                        updateItem("projects", item, "link", v)
                      }
                      placeholder="https://github.com/username/project"
                      icon={<LinkIcon size={16} />}
                    />

                    <div className="md:col-span-2">
                      <Field
                        label="Technologies"
                        value={Array.isArray(item.technologies)
                          ? item.technologies.join(", ")
                          : item.technologies || ""}
                        onChange={(v) =>
                          updateItem(
                            "projects",
                            item,
                            "technologies",
                            v.split(",").map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="React, Node.js, Express, MongoDB"
                        hint="Separate technologies with commas."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Field
                        label="Project description"
                        type="textarea"
                        rows={3}
                        value={item.description}
                        onChange={(v) =>
                          updateItem("projects", item, "description", v)
                        }
                        placeholder="What problem does it solve? What did you build, and what was your contribution?"
                      />
                    </div>
                  </div>
                )}
              />

              {/* ACHIEVEMENTS */}
              <EditableList
                id="edit-achievements"
                icon={<Award size={19} />}
                title="Achievements"
                description="Showcase awards, competitions, milestones and recognition."
                items={profile?.achievements}
                emptyText="Add hackathon wins, awards, contest rankings or notable achievements."
                addLabel="Add achievement"
                onAdd={() =>
                  addItem("achievements", {
                    title: "",
                    organization: "",
                    year: "",
                    description: "",
                  })
                }
                onDelete={(item) => removeItem("achievements", item)}
                render={(item) => (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Achievement title"
                      value={item.title}
                      onChange={(v) =>
                        updateItem("achievements", item, "title", v)
                      }
                      placeholder="e.g. National Hackathon Finalist"
                    />

                    <Field
                      label="Organization"
                      value={item.organization}
                      onChange={(v) =>
                        updateItem("achievements", item, "organization", v)
                      }
                      placeholder="e.g. Hackathon organizer"
                    />

                    <Field
                      label="Year"
                      type="number"
                      min={1900}
                      max={2100}
                      value={item.year}
                      onChange={(v) =>
                        updateItem(
                          "achievements",
                          item,
                          "year",
                          v === "" ? "" : Number(v)
                        )
                      }
                      placeholder="e.g. 2025"
                    />

                    <div className="md:col-span-2">
                      <Field
                        label="Details"
                        type="textarea"
                        rows={3}
                        value={item.description}
                        onChange={(v) =>
                          updateItem("achievements", item, "description", v)
                        }
                        placeholder="Briefly describe what you achieved and why it matters."
                      />
                    </div>
                  </div>
                )}
              />

              {/* CERTIFICATIONS */}
              <EditableList
                id="edit-certifications"
                icon={<BadgeCheck size={19} />}
                title="Certifications"
                description="List relevant professional certificates and completed courses."
                items={profile?.certifications}
                emptyText="Add certifications that support your professional skills."
                addLabel="Add certification"
                onAdd={() =>
                  addItem("certifications", {
                    name: "",
                    issuer: "",
                    issueDate: "",
                    credentialUrl: "",
                  })
                }
                onDelete={(item) => removeItem("certifications", item)}
                render={(item) => (
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Certification name"
                      value={item.name}
                      onChange={(v) =>
                        updateItem("certifications", item, "name", v)
                      }
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                    />

                    <Field
                      label="Issuing organization"
                      value={item.issuer}
                      onChange={(v) =>
                        updateItem("certifications", item, "issuer", v)
                      }
                      placeholder="e.g. Amazon Web Services"
                    />

                    <Field
                      label="Issue date"
                      type="date"
                      value={toDateInputValue(item.issueDate)}
                      onChange={(v) =>
                        updateItem("certifications", item, "issueDate", v)
                      }
                    />

                    <Field
                      label="Credential URL"
                      value={item.credentialUrl}
                      onChange={(v) =>
                        updateItem(
                          "certifications",
                          item,
                          "credentialUrl",
                          v
                        )
                      }
                      placeholder="https://example.com/verify/credential"
                    />
                  </div>
                )}
              />

              {/* SOCIAL LINKS */}
              <Section
                id="edit-social"
                icon={<Globe size={19} />}
                title="Social and developer links"
                description="Help recruiters explore your work, professional network and coding profiles."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="GitHub"
                    value={profile?.github}
                    onChange={(v) => update("github", v)}
                    icon={<Github size={17} />}
                    placeholder="https://github.com/your-username"
                    error={errors.github}
                  />

                  <Field
                    label="LinkedIn"
                    value={profile?.linkedin}
                    onChange={(v) => update("linkedin", v)}
                    icon={<Linkedin size={17} />}
                    placeholder="https://linkedin.com/in/your-profile"
                    error={errors.linkedin}
                  />

                  <Field
                    label="Portfolio website"
                    value={profile?.portfolio}
                    onChange={(v) => update("portfolio", v)}
                    icon={<Globe size={17} />}
                    placeholder="https://yourportfolio.com"
                    error={errors.portfolio}
                  />

                  <Field
                    label="LeetCode"
                    value={profile?.leetcode}
                    onChange={(v) => update("leetcode", v)}
                    icon={<Globe size={17} />}
                    placeholder="https://leetcode.com/u/username"
                    error={errors.leetcode}
                  />

                  <Field
                    label="CodeChef"
                    value={profile?.codechef}
                    onChange={(v) => update("codechef", v)}
                    icon={<Globe size={17} />}
                    placeholder="https://www.codechef.com/users/username"
                    error={errors.codechef}
                  />

                  <Field
                    label="Codeforces"
                    value={profile?.codeforces}
                    onChange={(v) => update("codeforces", v)}
                    icon={<Globe size={17} />}
                    placeholder="https://codeforces.com/profile/username"
                    error={errors.codeforces}
                  />
                </div>
              </Section>

              {/* VERIFICATION */}
              <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <BadgeCheck size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold text-neutral-900">
                        Profile verification
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                          statusClasses[verificationStatus] ||
                          "bg-neutral-100 text-neutral-600 ring-neutral-200"
                        }`}
                      >
                        {verificationStatus}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm leading-6 text-neutral-500">
                      Verification is managed by the relevant organization
                      or administrator. This field cannot be edited here.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <footer className="sticky bottom-0 z-20 flex flex-col-reverse gap-3 border-t border-neutral-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs text-neutral-500">
              Changes take effect after you save your profile.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving profile...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save profile
                  </>
                )}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

/* -------------------- REUSABLE COMPONENTS -------------------- */

const Section = ({ id, icon, title, description, children }) => (
  <section
    id={id}
    className="scroll-mt-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"
  >
    <div className="mb-6 flex items-start gap-3 border-b border-neutral-100 pb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-bold text-neutral-900">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-neutral-500">
          {description}
        </p>
      </div>
    </div>

    {children}
  </section>
);

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
  maxLength,
  rows = 4,
  error,
}) => (
  <div className="min-w-0">
    <label className="mb-2 block text-sm font-semibold text-neutral-800">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </span>
      )}

      {type === "textarea" ? (
        <textarea
          rows={rows}
          value={value ?? ""}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`${textareaClass} ${icon ? "pl-10" : ""} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : ""
          }`}
        />
      ) : (
        <input
          type={type}
          min={min}
          max={max}
          maxLength={maxLength}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`${inputClass} ${icon ? "pl-10" : ""} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : ""
          }`}
        />
      )}
    </div>

    {error ? (
      <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        {error}
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-xs leading-5 text-neutral-500">
        {hint}
      </p>
    ) : null}
  </div>
);

const EmptyState = ({ icon, title, description }) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-8 text-center">
    <div className="mb-3 text-neutral-400">{icon}</div>
    <p className="text-sm font-semibold text-neutral-700">{title}</p>
    <p className="mt-1 max-w-sm text-xs leading-5 text-neutral-500">
      {description}
    </p>
  </div>
);

const EditableList = ({
  id,
  icon,
  title,
  description,
  items,
  render,
  onDelete,
  emptyText,
  addLabel,
  onAdd,
}) => (
  <Section
    id={id}
    icon={icon}
    title={title}
    description={description}
  >
    <div className="space-y-4">
      {items?.length ? (
        items.map((item, index) => (
          <article
            key={item._id ?? item.id ?? `${id}-${index}`}
            className="rounded-xl border border-neutral-200 p-4 sm:p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-neutral-600 ring-1 ring-neutral-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-neutral-800">
                  {title} entry
                </span>
              </div>

              <button
                type="button"
                onClick={() => onDelete(item)}
                aria-label={`Remove ${title} entry ${index + 1}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-2.5 py-2 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>

            {render(item, index)}
          </article>
        ))
      ) : (
        <EmptyState
          icon={icon}
          title={`No ${title.toLowerCase()} added`}
          description={emptyText}
        />
      )}

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700"
      >
        <Plus size={17} />
        {addLabel}
      </button>
    </div>
  </Section>
);

export default EditProfile;
