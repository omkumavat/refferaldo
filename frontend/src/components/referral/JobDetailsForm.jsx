import React, { useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
} from "lucide-react";


export const JobDetailsForm = ({ job, setJob }) => {
  const [localUser] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  )
  const update = (field, value) => {
    setJob((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const sanitizeSlug = (value) =>
    value
      .replace(/\s/g, "-")                 // each space -> "-"
      .replace(/[^a-zA-Z0-9\-_/]/g, "");

  const addSkill = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = e.target.value.trim();

    if (!value) return;

    if (!job.skills.includes(value)) {
      update("skills", [...job.skills, value]);
    }

    e.target.value = "";
  };

  const removeSkill = (skill) => {
    update(
      "skills",
      job.skills.filter((item) => item !== skill)
    );
  };

  return (
    <section className="card p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <BriefcaseBusiness className="w-5 h-5" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Job details
          </h2>

          <p className="text-sm text-slate-500 mt-0.5">
            Keep it short. Candidates should understand the opportunity
            quickly.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Role */}
        <div>
          <label className="form-label">
            Role name <span className="text-red-500">*</span>
          </label>

          <input
            value={job.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="form-input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="form-label">
            Short description
          </label>

          <textarea
            value={job.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Tell candidates what this opportunity is about..."
            className="form-input resize-none"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Department <span className="text-red-500">*</span>
            </label>

            <select
              value={job.department}
              onChange={(e) =>
                update("department", e.target.value)
              }
              className="form-input"
            >
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Product Management">Product Management</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Design & User Experience (UI/UX)">Design & User Experience (UI/UX)</option>
              <option value="Sales & Business Development">Sales & Business Development</option>
              <option value="Marketing & Communications">Marketing & Communications</option>
              <option value="Human Resources & Recruitment">Human Resources & Recruitment</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Operations & Administration">Operations & Administration</option>
              <option value="Customer Support & Success">Customer Support & Success</option>
              <option value="Other">Other</option>

            </select>
          </div >
          <div>
            <label className="form-label">
              Location <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

              <input
                value={job.location}
                onChange={(e) =>
                  update("location", e.target.value)
                }
                placeholder="Pune, Maharashtra"
                className="form-input pl-9"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Work mode
            </label>

            <select
              value={job.workMode}
              onChange={(e) =>
                update("workMode", e.target.value)
              }
              className="form-input"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="Not disclose">Not disclose</option>
            </select>
          </div>
        </div >

        {/* Employment + Experience */}
        < div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
          <div>
            <label className="form-label">
              Employment type
            </label>

            <select
              value={job.employmentType}
              onChange={(e) =>
                update("employmentType", e.target.value)
              }
              className="form-input"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Experience required
            </label>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                value={job.experienceMin}
                onChange={(e) =>
                  update("experienceMin", e.target.value)
                }
                placeholder="Min years"
                className="form-input"
              />

              <input
                type="number"
                min="0"
                value={job.experienceMax}
                onChange={(e) =>
                  update("experienceMax", e.target.value)
                }
                placeholder="Max years"
                className="form-input"
              />
            </div>
          </div>
        </div >

        {/* Skills */}
        < div >
          <label className="form-label">
            Skills
          </label>

          <input
            onKeyDown={addSkill}
            placeholder="Type a skill and press Enter"
            className="form-input"
          />

          {
            job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )
          }
        </div >

        {/* Salary */}
        < div >
          <label className="form-label">
            Salary range
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

              <input
                type="number"
                min="0"
                value={job.salaryMin}
                onChange={(e) =>
                  update("salaryMin", e.target.value)
                }
                placeholder="Minimum"
                className="form-input pl-9"
              />
            </div>

            <div className="relative">
              <IndianRupee className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

              <input
                type="number"
                min="0"
                value={job.salaryMax}
                onChange={(e) =>
                  update("salaryMax", e.target.value)
                }
                placeholder="Maximum"
                className="form-input pl-9"
              />
            </div>
          </div>
        </div >

        {/* Deadline */}
        < div >
          <label className="form-label">
            Application deadline
          </label>

          <input
            type="date"
            value={job.applicationDeadline}
            onChange={(e) =>
              update(
                "applicationDeadline",
                e.target.value
              )
            }
            className="form-input"
          />
        </div >

        <div>
          <label className="form-label">
            Slug (only letters, numbers, -, _, / allowed)
          </label>

          <input
            value={job.slug}
            onChange={(e) => update("slug", sanitizeSlug(e.target.value))}
            placeholder="e.g. Frontend Developer"
            className="form-input"
          />
            {
              job.slug && (
                <p className="text-sm text-slate-500 mt-1">
                Job Link : https://refer.com/referral/job/apply/{localUser?.id.slice(0, 4)}-{job.slug}
                </p>
              )
            }
          
        </div>
      </div >
    </section >
  );
};