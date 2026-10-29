import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, MailCheck } from "lucide-react";

export const Thankyou = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const returnUrl = params.get("returnUrl");
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative bg-slate-900">
        <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=srgb&fm=jpg&w=900&q=80" alt="Team" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative p-12 h-full flex flex-col justify-between text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
            <span className="text-lg font-bold">refermy.life</span>
          </Link>
          <div>
            <p className="text-2xl font-semibold leading-snug max-w-md">"I found an employee at the company and got my profile referred within a day."</p>
            <p className="text-sm text-white/70 mt-4">— Aarav Sharma, Fullstack Engineer at Coinbase</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md text-center">

          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <MailCheck className="w-8 h-8 text-emerald-600" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Thank you for signing up!
          </h1>

          <p className="text-slate-500 mt-3 leading-relaxed">
            Your refermy.life account has been created successfully.
            We just need to verify your email address before you can
            continue.
          </p>

          <div className="mt-8 text-left bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">
              Verify your email
            </h2>

            <div className="space-y-4">

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Check your inbox for an email from{" "}
                  <span className="font-semibold text-slate-800">
                    refermy.life
                  </span>
                  .
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Open the email and click the{" "}
                  <span className="font-semibold text-slate-800">
                    Verify Email
                  </span>{" "}
                  button.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Once verified, your account will be activated and
                  you can continue to your refermy.life dashboard.
                </p>
              </div>

            </div>
          </div>

          {/* Expiry / Spam info */}
          <div className="mt-5">
            <p className="text-xs text-slate-500 leading-relaxed">
              The verification link is valid for{" "}
              <span className="font-semibold text-slate-700">
                15 minutes
              </span>
              .
              <br />
              Didn't receive the email? Check your spam or junk folder.
            </p>
          </div>

          {/* Login */}
          <div className="mt-8">
            <Link
              to={`/login?returnUrl=${returnUrl}`}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Return to login
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}