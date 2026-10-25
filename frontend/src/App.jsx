import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";
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
import ResumeOnboarding from './components/ResumeOnboarding'
import {Contact} from "./pages/public/Contact"
import {PublicJobs} from "./pages/public/PublicJobs"

// Candidate
import { CandidateDashboard } from "./pages/candidate/Dashboard";
import { CandidateProfile } from "./pages/candidate/Profile";
import { CandidateJobs } from "./pages/candidate/Jobs";
import { CandidateApplications } from "./pages/candidate/Applications";
import { CandidateReferrals } from "./pages/candidate/Referrals";
import { CandidateSaved } from "./pages/candidate/Saved";
import { CandidateNotifications } from "./pages/candidate/Notifications";
import { CandidateSettings } from "./pages/candidate/Settings";
import { CandidateProfilePublic } from "./pages/candidate/ProfilePublic";

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
import { EmployeeProfile } from './pages/employee/Profile'
import { ReferJob } from "./pages/employee/ReferJob";
import { CreateReferral } from "./pages/employee/CreateReferral";
import FormPreviewToEmployee from "./pages/employee/FormPreviewToEmployee"

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
import ApplyReferral from "./pages/public/ApplyReferral";
import ReferralAnalytics from "./pages/employee/ReferralAnalytics";
import { MyReferralForms } from "./components/referral/ReferralForms";

// Read the logged-in user from localStorage or sessionStorage.
function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (!storedUser) return null;

    const user = JSON.parse(storedUser);

    if (
      !user ||
      typeof user !== "object" ||
      typeof user.role !== "string"
    ) {
      return null;
    }

    return {
      ...user,
      role: user.role.trim().toLowerCase(),
    };
  } catch {
    return null;
  }
}

// Send each role to its own dashboard.
function getDashboardPath(role) {
  const dashboards = {
    candidate: "/candidate/dashboard",
    employee: "/employee/dashboard",
    company: "/company/dashboard",
    admin: "/admin/dashboard",
  };

  return dashboards[role] || "/";
}

// Protect authenticated routes and enforce allowed roles

function ProtectedRoute({ allowedRoles }) {
  const user = getStoredUser();
  const location = useLocation();

  // Not logged in: preserve the requested URL
  if (!user) {
    const returnUrl =
      location.pathname + location.search + location.hash;

    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
        state={{ returnUrl }}
        replace
      />
    );
  }

  // Logged in but unauthorized
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getDashboardPath(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
}


// Prevent logged-in users from visiting login/signup pages.
function PublicOnlyRoute() {
  const user = getStoredUser();

  if (user) {
    return (
      <Navigate
        to={getDashboardPath(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/talk-with-us" element={<Contact />} />
        <Route path="/public/jobs" element={<PublicJobs />} />

        {/* Public candidate profile */}
        <Route
          path="/candidate/profile/:id/public"
          element={<CandidateProfilePublic />}
        />

        {/* Guest-only routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route path="/verify" element={<EmailVerification />} />


        {/* Candidate routes */}
        <Route
          path="/candidate"
          element={<ProtectedRoute allowedRoles={["candidate"]} />}
        >
          {/* <Route
            index
            element={
              <Navigate to="/candidate" replace />
            }
          /> */}
          <Route path="apply/:slug" element={<ApplyReferral />} />
          <Route path="dashboard" element={<CandidateDashboard />} />
          <Route
            path="profile/:id/private"
            element={<CandidateProfile />}
          />
          <Route path="jobs" element={<CandidateJobs />} />
          <Route
            path="applications"
            element={<CandidateApplications />}
          />
          <Route path="referrals" element={<CandidateReferrals />} />
          <Route path="saved" element={<CandidateSaved />} />
          <Route
            path="notifications"
            element={<CandidateNotifications />}
          />
          <Route path="settings" element={<CandidateSettings />} />
          <Route
            path="resume-onboarding"
            element={<ResumeOnboarding />}
          />
        </Route>

        {/* Employee routes */}
        <Route
          path="/employee"
          element={<ProtectedRoute allowedRoles={["employee"]} />}
        >
          <Route
            index
            element={
              <Navigate to="/employee/dashboard" replace />
            }
          />
          <Route path = "form/preview/:slug" element={<FormPreviewToEmployee/>}/>
          {/* <Route path="dashboard" element={<EmployeeDashboard />} /> */}
          <Route path="candidates" element={<EmployeeCandidates />} />
          <Route
            path="candidates/:id"
            element={<EmployeeCandidateProfile />}
          />
          <Route path="referrals" element={<EmployeeReferrals />} />
          <Route path="jobs" element={<EmployeeJobs />} />
          <Route path="rewards" element={<EmployeeRewards />} />
          <Route path="verify" element={<EmployeeVerify />} />
          <Route
            path="notifications"
            element={<EmployeeNotifications />}
          />
          <Route path="settings" element={<EmployeeSettings />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="refer-job" element={<ReferJob />} />
          <Route
            path="refer-job/create"
            element={<CreateReferral />}
          />
          <Route
            path="referral/forms"
            element={<MyReferralForms />}
          />
          <Route
            path="referral/form/submission"
            element={<ReferralAnalytics />}
          />
        </Route>

        {/* Company routes */}
        <Route
          path="/company"
          element={<ProtectedRoute allowedRoles={["company"]} />}
        >
          <Route
            index
            element={
              <Navigate to="/company/dashboard" replace />
            }
          />
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="jobs" element={<CompanyJobs />} />
          <Route path="jobs/create" element={<CompanyCreateJob />} />
          <Route path="jobs/:id" element={<CompanyCreateJob />} />
          <Route path="referrals" element={<CompanyReferrals />} />
          <Route path="candidates" element={<CompanyCandidates />} />
          <Route path="employees" element={<CompanyEmployees />} />
          <Route path="analytics" element={<CompanyAnalytics />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} />}
        >
          <Route
            index
            element={
              <Navigate to="/admin/dashboard" replace />
            }
          />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="referrals" element={<AdminReferrals />} />
        </Route>

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
