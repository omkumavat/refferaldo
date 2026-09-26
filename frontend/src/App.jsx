import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Public
import { Landing } from "./pages/public/Landing";
import { JobsList } from "./pages/public/JobsList";
import { JobDetails } from "./pages/public/JobDetails";
import { CompaniesList } from "./pages/public/CompaniesList";
import { CompanyDetails } from "./pages/public/CompanyDetails";
import { HowItWorks } from "./pages/public/HowItWorks";
import { Login } from "./pages/public/Login";
import { Signup } from "./pages/public/Signup";
import { ForgotPassword } from "./pages/public/ForgotPassword";
import { EmailVerification } from "./pages/public/EmailVerification";

// Candidate
import { CandidateDashboard } from "./pages/candidate/Dashboard";
import { CandidateProfile } from "./pages/candidate/Profile";
import { CandidateJobs } from "./pages/candidate/Jobs";
import { CandidateApplications } from "./pages/candidate/Applications";
import { CandidateReferrals } from "./pages/candidate/Referrals";
import { CandidateSaved } from "./pages/candidate/Saved";
import { CandidateNotifications } from "./pages/candidate/Notifications";
import { CandidateSettings } from "./pages/candidate/Settings";

// Employee
import { EmployeeDashboard } from "./pages/employee/Dashboard";
import { EmployeeCandidates } from "./pages/employee/Candidates";
import { EmployeeCandidateProfile } from "./pages/employee/CandidateProfile";
import { EmployeeReferrals } from "./pages/employee/Referrals";
import { EmployeeJobs } from "./pages/employee/Jobs";
import { EmployeeRewards } from "./pages/employee/Rewards";
import { EmployeeVerify } from "./pages/employee/Verify";
import { EmployeeNotifications } from "./pages/employee/Notifications";
import { EmployeeSettings } from "./pages/employee/Settings";

// Company
import { CompanyDashboard } from "./pages/company/Dashboard";
import { CompanyJobs } from "./pages/company/Jobs";
import { CompanyCreateJob } from "./pages/company/CreateJob";
import { CompanyReferrals } from "./pages/company/Referrals";
import { CompanyCandidates } from "./pages/company/Candidates";
import { CompanyEmployees } from "./pages/company/Employees";
import { CompanyAnalytics } from "./pages/company/Analytics";
import { CompanySettings } from "./pages/company/Settings";

// Admin
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminUsers } from "./pages/admin/Users";
import { AdminCompanies } from "./pages/admin/Companies";
import { AdminEmployees } from "./pages/admin/Employees";
import { AdminJobs } from "./pages/admin/Jobs";
import { AdminReferrals } from "./pages/admin/Referrals";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {
          localStorage.getItem("user") || sessionStorage.getItem("user") ? (
            <Route path="/login" element={<Navigate to="/" replace />} />
          ) : (
            <Route path="/login" element={<Login />} />
          )
        }
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<EmailVerification />} />

        {/* Candidate */}
        <Route path="/candidate" element={<Navigate to="/candidate/dashboard" replace />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
        <Route path="/candidate/referrals" element={<CandidateReferrals />} />
        <Route path="/candidate/saved" element={<CandidateSaved />} />
        <Route path="/candidate/notifications" element={<CandidateNotifications />} />
        <Route path="/candidate/settings" element={<CandidateSettings />} />

        {/* Employee */}
        <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/candidates" element={<EmployeeCandidates />} />
        <Route path="/employee/candidates/:id" element={<EmployeeCandidateProfile />} />
        <Route path="/employee/referrals" element={<EmployeeReferrals />} />
        <Route path="/employee/jobs" element={<EmployeeJobs />} />
        <Route path="/employee/rewards" element={<EmployeeRewards />} />
        <Route path="/employee/verify" element={<EmployeeVerify />} />
        <Route path="/employee/notifications" element={<EmployeeNotifications />} />
        <Route path="/employee/settings" element={<EmployeeSettings />} />

        {/* Company */}
        <Route path="/company" element={<Navigate to="/company/dashboard" replace />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/jobs" element={<CompanyJobs />} />
        <Route path="/company/jobs/create" element={<CompanyCreateJob />} />
        <Route path="/company/jobs/:id" element={<CompanyCreateJob />} />
        <Route path="/company/referrals" element={<CompanyReferrals />} />
        <Route path="/company/candidates" element={<CompanyCandidates />} />
        <Route path="/company/employees" element={<CompanyEmployees />} />
        <Route path="/company/analytics" element={<CompanyAnalytics />} />
        <Route path="/company/settings" element={<CompanySettings />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/companies" element={<AdminCompanies />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
