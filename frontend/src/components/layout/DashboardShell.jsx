import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Bell, Search, Menu, X, ChevronDown, User, LogOut } from "lucide-react";

export const DashboardShell = ({ role = "candidate", roleLabel, userName = "Rahul", sidebar = [], children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const [localUser] = useState(
            JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
        );

  const roleSwitch = [
    { label: "Candidate", to: "/candidate/dashboard", key: "candidate" },
    { label: "Employee", to: "/employee/dashboard", key: "employee" },
    { label: "Company", to: "/company/dashboard", key: "company" },
    { label: "Admin", to: "/admin/dashboard", key: "admin" },
  ];

  const handleLogout = async () => {
    try {
      // Call backend logout API
      await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        // `${API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      // Clear any frontend auth data if you store it
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Close dropdown
      setShowUserMenu(false);

      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Optional: still clear frontend session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex-shrink-0 border-r border-slate-200 bg-white transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-slate-900">Referly</span>
          </Link>
          <button className="lg:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3 py-4">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{roleLabel || role}</p>
          <nav className="space-y-0.5">
            {sidebar.map((item) => {
              const Icon = item.icon;
              const linkTo = item.requiresId
                ? `${item.to}/${localUser?.id.slice(0,4)}-${localUser?.id.slice(4,9)}/private`
                : item.to;
              return (
                <NavLink
                  key={linkTo}
                  to={linkTo}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                  data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Switch view</p>
            <div className="space-y-0.5">
              {roleSwitch.map((r) => (
                <Link
                  key={r.key}
                  to={r.to}
                  className={`block px-3 py-1.5 rounded-md text-xs font-medium ${location.pathname.startsWith(`/${r.key}`)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  data-testid={`role-switcher-${r.key}`}
                >
                  {r.label} view
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button className="lg:hidden p-2 rounded text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(true)} data-testid="open-sidebar">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search jobs, candidates, companies..." className="field pl-9 py-2 text-sm" data-testid="global-search" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative" data-testid="notifications-bell">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>
            <div className="relative">
              {/* User Button */}
              <div
                className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:cursor-pointer"
                data-testid="user-menu"
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden md:block leading-tight">
                  <p className="text-sm font-semibold text-slate-900">
                    {userName}
                  </p>

                  <p className="text-[11px] text-slate-500 capitalize">
                    {roleLabel || role}
                  </p>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 hidden md:block transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 h-22 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">

                  {/* Profile */}
                  <Link
                    to={`/${role}/profile`}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Profile</span>
                  </Link>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-100" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2 lg:hidden">
          {sidebar.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium ${isActive ? "text-emerald-700" : "text-slate-500"}`
                }
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.label.split(" ")[0]}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
