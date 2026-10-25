import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, Bell, ChevronDown, ChevronUp, User, LogOut } from "lucide-react";

export const PublicNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [localUser] = useState(
    JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const links = [
    { to: "/public/jobs", label: "Find Jobs", requireRole: "candidate" },
    { to: "/companies", label: "Companies" },
    { to: "/how-it-works", label: "How It Works" },
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

      window.location.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);

      // Optional: still clear frontend session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.replace("/");
    };

  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight">refermy.life</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-emerald-700 bg-emerald-50" : "text-slate-600 hover:text-slate-900 hover:text-emerland-950"}`
              }
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          {
            localUser && localUser.id && localUser.role ? (
              <>
                <Link to="/talk-with-us" className="btn-primary" data-testid="signup-btn">Talk with Us</Link>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    {/* User Button */}
                    <div
                      className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:cursor-pointer"
                      data-testid="user-menu"
                      onClick={() => setShowUserMenu((prev) => !prev)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-semibold">
                        {localUser?.avatar ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-semibold shrink-0">
                            <img
                              src={`http://localhost:4000${localUser.avatar}`}
                              alt={localUser.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-semibold">
                            {localUser?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>

                      <div className="hidden md:block leading-tight">
                        <p className="text-sm font-semibold text-slate-900">
                          {localUser.name}
                        </p>

                        <p className="text-[11px] text-slate-500 capitalize">
                          {localUser.role || "NA"}
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
                          to={`/${localUser.role}/profile${localUser.role === "candidate" ? "/" + localUser.id + "/private" : ""}`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-2 py-1.5 text-sm text-slate-700  transition-colors"
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
                          className="w-full flex items-center gap-3 px-2 py-1.5 text-sm text-red-600  transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" data-testid="login-btn">Log in</Link>
                <Link to="/talk-with-us" className="btn-primary" data-testid="signup-btn">Talk with Us</Link>
              </>
            )
          }
        </div>
        <button
          className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            {
              localUser && localUser.id && localUser.role ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {/* User Button */}
                      <div
                        className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:cursor-pointer"
                        data-testid="user-menu"
                        onClick={() => setShowUserMenu((prev) => !prev)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xl font-semibold">
                          {localUser.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="hidden md:block leading-tight">
                          <p className="text-sm font-semibold text-slate-900">
                            {localUser.name}
                          </p>

                          <p className="text-[11px] text-slate-500 capitalize">
                            {localUser.role || "NA"}
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
                            to={`/${localUser.role}/profile${localUser.role === "candidate" ? "/" + localUser.id + "/private" : ""}`}
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
                            className="w-full flex items-center gap-3 px-2 py-1.5 text-sm text-red-600 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost" data-testid="login-btn">Log in</Link>
                  <Link to="/talk-with-us" className="btn-primary" data-testid="signup-btn">Talk with Us</Link>
                </>
              )
            }
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-[#080B0A]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">refermy.life</span>
        </div>
        <p className="text-sm mt-3 max-w-xs">The referral-first hiring marketplace. Get referred, get noticed, get hired.</p>
      </div>
      {[
        { title: "Product", items: [["Find Jobs", "/jobs"], ["How it works", "/how-it-works"]] },
        { title: "For teams", items: [["Employees", "/employee/profile"]] },
        { title: "Must do", items: [["Talk with us", "/talk-with-us"], ["Login", "/login"], ["Sign up", "/signup"]] },
      ].map((col) => (
        <div key={col.title}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3">{col.title}</p>
          <ul className="space-y-2">
            {col.items.map(([label, to]) => (
              <li key={label}><Link to={to} className="text-sm hover:text-emerald-700">{label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-100 py-5 text-center text-xs">
      © 2026 refermy.life. Demo product. All company references are illustrative.
    </div>
  </footer>
);