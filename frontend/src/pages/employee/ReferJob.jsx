import React , {useState} from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  UserPlus,
  ArrowRight,
  Sparkles,
  Link2,
} from "lucide-react";

import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { MyReferralForms } from "../../components/referral/ReferralForms";

export const ReferJob = () => {
    const [localUser] = useState(
        JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
      )
  return (
    <DashboardShell
      role="employee"
      roleLabel="Employee"
      userName={localUser.name}
      sidebar={employeeSidebar}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Referral Center
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Refer a Job
          </h1>

          <p className="text-slate-600 mt-2 max-w-2xl">
            Help talented people find the right opportunity. Refer an existing
            company opening or quickly create your own referral form.
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Jobs */}
          <div className="group card p-7 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>

              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                Company
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mt-5">
              Refer a company job
            </h2>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Choose from open positions available at your company and refer a
              candidate directly.
            </p>

            <Link
              to="/employee/jobs"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View company jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Personal Referral */}
          <div className="group card p-7 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>

              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Quick Create
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mt-5">
              Create a personal referral
            </h2>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Create your own job referral form, add a few questions, and share
              a public application link.
            </p>

            <Link
              to="/employee/refer-job/create"
              className="btn-primary inline-flex items-center gap-2 mt-6"
            >
              Create referral form
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <MyReferralForms />

        {/* How it works */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-slate-900">
            How personal referrals work
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                icon: BriefcaseBusiness,
                title: "Create",
                text: "Add the role details and choose the questions you want candidates to answer.",
              },
              {
                icon: Link2,
                title: "Share",
                text: "Publish your form and get a public link that you can share anywhere.",
              },
              {
                icon: UserPlus,
                title: "Receive",
                text: "Candidates submit their details and you can review their applications.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="p-5 rounded-xl border border-slate-200 bg-white"
                >
                  <Icon className="w-5 h-5 text-emerald-600" />

                  <h4 className="font-semibold text-slate-900 mt-3">
                    {item.title}
                  </h4>

                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};