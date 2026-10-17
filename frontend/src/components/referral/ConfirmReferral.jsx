import { X } from "lucide-react";
export const ConfirmReferral = ({setSelected, busyId, selected, handleRefer}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="refer-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <h2
                        id="refer-title"
                        className="text-lg font-bold text-slate-900"
                    >
                        Confirm referral
                    </h2>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setSelected(null)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                    You're about to refer{" "}
                    <strong>{selected.name}</strong>. This should submit the
                    candidate to the configured referral workflow and update
                    their application status.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={busyId === selected._id}
                        onClick={handleRefer}
                        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {busyId === selected._id ? "Processing..." : "Confirm & Refer"}
                    </button>
                </div>
            </div>
        </div>
    )
}