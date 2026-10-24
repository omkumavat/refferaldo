import React, { useEffect, useState } from "react";
import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { getEmployeeProfile, updateEmployeeProfile } from "../../api/employeeApi";
import { VerificationBadge } from "../../components/Badges";
import { Building2, Briefcase, Layers, CalendarDays,Mail,Phone} from "lucide-react";

import EditProfile from "./ProfilePages/EditProfile";

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EmptyState = ({ text }) => <p className="text-sm text-slate-400">{text}</p>;

export const EmployeeProfile = () => {
  const [localUser] = useState(
    JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    )
  );

  const [profile, setProfile] = useState(null);
  const [user, setUser] =useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getEmployeeProfile(localUser?.id);

        if (response.success) {
            console.log(response)
          setProfile(response.profile);
          setUser(response.profile.user)
          setCompany(response.profile.company);
        } else {
          console.error("Failed to fetch employee profile:", response.error);
        }
      } catch (error) {
        console.error("Failed to fetch employee profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [localUser?.id]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const response = await updateEmployeeProfile(profile._id, profile);

      if (response.success) {
        setProfile(response.data);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to save employee profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell role="employee" roleLabel="Employee" sidebar={employeeSidebar}>
        <div className="flex items-center justify-center py-32 text-slate-500">
          Loading...
        </div>
      </DashboardShell>
    );
  }

  const companyName =
    profile?.company && typeof profile.company === "object"
      ? profile.company.name
      : null;

  return (
    <DashboardShell
      role="employee"
      userName={user.name}
      roleLabel="Employee"
      sidebar={employeeSidebar}
    >
      {/* HEADER */}
      <div className="card p-6">
        <div className="flex items-start gap-5 flex-col sm:flex-row">
          {user?.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-semibold shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {user?.name || "Unnamed Employee"}
              </h1>

              {profile?.verificationStatus === "verified" && (
                <VerificationBadge label="Verified" />
              )}
              {profile?.verificationStatus === "pending" && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Verification Pending
                </span>
              )}
              {profile?.verificationStatus === "rejected" && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Verification Rejected
                </span>
              )}

              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  profile?.employmentStatus === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {profile?.employmentStatus === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-slate-600 mt-0.5">
              {profile?.designation || (
                <span className="text-slate-400">No designation added</span>
              )}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
              {companyName && (
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {companyName}
                </span>
              )}
              {profile?.department && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> {profile.department}
                </span>
              )}
              {profile?.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> Joined{" "}
                  {formatDate(profile.createdAt)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              className="btn-primary text-xs"
              data-testid="edit-profile-btn"
              onClick={() => setEditing(true)}
            >
              Edit profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ROLE DETAILS */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Role Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Designation</span>
              <span className="font-medium text-slate-900">
                {profile?.designation || <EmptyState text="Not set" />}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Department</span>
              <span className="font-medium text-slate-900">
                {profile?.department || <EmptyState text="Not set" />}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Employment Status</span>
              <span className="font-medium text-slate-900 capitalize">
                {profile?.employmentStatus}
              </span>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          {/* VERIFICATION */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Verification</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                {user?.isEmailVerified ? (
                  <VerificationBadge label="Verified" />
                ) : (
                  <span className="text-xs text-slate-400">Not verified</span>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                {user?.isPhoneVerified ? (
                  <VerificationBadge label="Verified" />
                ) : (
                  <span className="text-xs text-slate-400">Not verified</span>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <Building2 className="w-3.5 h-3.5" /> Company
                </span>
                {company.verificationStatus!="pending" ? (
                  <VerificationBadge label="Verified" />
                ) : (
                  <span className="text-xs text-slate-400">Not verified</span>
                )}
              </li>
            </ul>
          </div>
          </aside>
          </div>
      {editing && (
        <EditProfile
          profile={profile}
          setProfile={setProfile}
          onClose={() => setEditing(false)}
          onSave={saveProfile}
          saving={saving}
        />
      )}
    </DashboardShell>
  );
};