import { ArrowUpRight, UserCheck, X } from "lucide-react";

export const SuccessCandidate = ({ successCandidate, setSuccessCandidate, setShowCandidateInfo }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="referral-success-title"
                    className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-2xl sm:p-8"
                  >
                    <button
                      type="button"
                      onClick={() => setSuccessCandidate(null)}
                      aria-label="Close"
                      className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={20} />
                    </button>
        
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                      <UserCheck size={30} />
                    </div>
        
                    <div className="text-center">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Referral submitted
                      </span>
        
                      <h2
                        id="referral-success-title"
                        className="mt-4 text-2xl font-bold tracking-tight text-slate-900"
                      >
                        Referral successful!
                      </h2>
        
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Your referral for{" "}
                        <span className="font-semibold text-slate-900">
                          {successCandidate.name ||
                            successCandidate.candidate?.name ||
                            "this candidate"}
                        </span>{" "}
                        has been submitted.
                      </p>
                    </div>
        
                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                      <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                          <UserCheck size={18} />
                        </div>
        
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Your privacy matters
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-600">
                            Your personal contact details, such as your email and phone
                            number, have not been shared with the candidate.
                          </p>
                        </div>
                      </div>
                    </div>
        
                    <button
                      type="button"
                      onClick={() => {
                        setShowCandidateInfo(successCandidate)
                        setSuccessCandidate(null);
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      View candidate personal info
                      <ArrowUpRight size={16} />
                    </button>
        
                    <button
                      type="button"
                      onClick={() => setSuccessCandidate(null)}
                      className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              
    )
}