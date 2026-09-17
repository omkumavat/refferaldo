import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";

export const PublicNav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/jobs", label: "Find Jobs" },
    { to: "/companies", label: "Companies" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/employee/dashboard", label: "For Employees" },
    { to: "/company/dashboard", label: "For Companies" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">Referly</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "text-emerald-700 bg-emerald-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`
              }
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login" className="btn-ghost" data-testid="login-btn">Log in</Link>
          <Link to="/signup" className="btn-primary" data-testid="signup-btn">Sign up</Link>
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
            <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">Log in</Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary flex-1">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">Referly</span>
        </div>
        <p className="text-sm text-slate-500 mt-3 max-w-xs">The referral-first hiring marketplace. Get referred, get noticed, get hired.</p>
      </div>
      {[
        { title: "Product", items: [["Find Jobs", "/jobs"], ["Companies", "/companies"], ["How it works", "/how-it-works"]] },
        { title: "For teams", items: [["Employees", "/employee/dashboard"], ["Companies", "/company/dashboard"], ["Admin", "/admin/dashboard"]] },
        { title: "Company", items: [["About", "/how-it-works"], ["Login", "/login"], ["Sign up", "/signup"]] },
      ].map((col) => (
        <div key={col.title}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{col.title}</p>
          <ul className="space-y-2">
            {col.items.map(([label, to]) => (
              <li key={label}><Link to={to} className="text-sm text-slate-600 hover:text-emerald-700">{label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
      © 2026 Referly. Demo product. All company references are illustrative.
    </div>
  </footer>
);
