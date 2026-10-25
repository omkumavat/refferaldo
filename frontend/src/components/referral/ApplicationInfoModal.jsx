
import React, { useState } from "react";
import {
    X,
    FileText,
    ExternalLink,
    ArrowLeft,
    Download,
    CalendarDays,
    Eye,
    Copy, Check
} from "lucide-react";

const ApplicationInfoModal = ({
    submission,
    questions = [],
    onClose,
}) => {
    // console.log(submission);
    if (!submission) return null;
    const [openedFile, setOpenedFile] = useState(null);

    const [copiedIndex, setCopiedIndex] = useState(null);

    const copyAnswer = async (value, index) => {
        try {
            await navigator.clipboard.writeText(String(formatAnswer(value) ?? ""));
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (error) {
            console.error("Failed to copy answer:", error);
        }
    };

    const formatAnswer = (value) => {
        if (value == null || value === "") return "Not provided";

        if (Array.isArray(value)) {
            return value.join(", ");
        }

        if (typeof value === "object") {
            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    const questionMap = new Map(
        questions.map((question) => [
            String(question._id || question.id),
            question,
        ])
    );

    const getFileUrl = (answer, question) => {
        console.log(question);


        if (
            question?.type === "file") {
            return `http://localhost:4000/public/${question?.form}/${question._id}.pdf` || null;
        }

        return null;
    };

    const getFileName = (answer, question) => {
        const value = answer.value;

        if (value && typeof value === "object") {
            if (value.originalname || value.name || value.filename) {
                return (
                    value.originalname ||
                    value.name ||
                    value.filename
                );
            }
        }

        if (typeof value === "string" && value.trim()) {
            try {
                const pathname = new URL(value).pathname;
                return decodeURIComponent(pathname.split("/").pop()) ||
                    "Uploaded file";
            } catch {
                return value.split("/").pop() || "Uploaded file";
            }
        }

        if (/resume/i.test(question?.question || "")) {
            return "Candidate resume";
        }

        return "Uploaded file";
    };

    const openFile = (url, name) => {
        if (!url) return;

        setOpenedFile({ url, name });
    };

    // Same modal, alternate file-view state. Returning to the table
    // preserves the selected submission and its answers.
    if (openedFile) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                onClick={() => setOpenedFile(null)}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Uploaded file"
                    className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b border-slate-200 p-4">
                        <button
                            type="button"
                            onClick={() => setOpenedFile(null)}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            <ArrowLeft size={17} />
                            Back to application
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close application details"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <FileText className="shrink-0 text-emerald-600" size={20} />
                            <span className="truncate text-sm font-semibold text-slate-800">
                                {openedFile.name}
                            </span>
                        </div>

                        <a
                            href={openedFile.url}
                            download
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Download size={14} />
                            Download
                        </a>
                    </div>

                    <div className="min-h-[50vh] flex-1 overflow-auto bg-slate-100 p-4">
                        {/\.(pdf)(\?.*)?$/i.test(openedFile.url) ? (
                            <iframe
                                src={openedFile.url}
                                title={openedFile.name}
                                className="h-[65vh] w-full rounded-lg border border-slate-200 bg-white"
                            />
                        ) : (
                            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl bg-white p-6 text-center">
                                <FileText size={36} className="text-slate-400" />
                                <p className="text-sm text-slate-600">
                                    Preview isn't available for this file type.
                                </p>
                                <a
                                    href={openedFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-emerald-700 hover:underline"
                                >
                                    Open file <ExternalLink size={14} className="inline" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-5"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-modal-title"
                className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                            <FileText size={21} />
                        </div>

                        <div>
                            <h2
                                id="application-modal-title"
                                className="text-lg font-bold text-slate-900"
                            >
                                Application Details
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {submission.form?.title || "Referral application"} ·{" "}
                                {submission.answers?.length || 0} responses
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close application details"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Candidate summary */}
                <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50 p-5 sm:grid-cols-3">
                    <div>
                        <p className="text-xs text-slate-500">Candidate</p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                            {submission.name || submission.candidate?.name || "—"}
                        </p>
                    </div>

                    {/* <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 break-all text-sm font-medium text-slate-800">
              {submission.email || submission.candidate?.email || "—"}
            </p>
          </div> */}

                    <div>
                        <p className="text-xs text-slate-500">Submitted on</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                            <CalendarDays size={14} />
                            {submission.createdAt
                                ? new Date(submission.createdAt).toLocaleString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>

                {/* Answers table */}
                <div className="flex-1 overflow-auto p-5">
                    <h3 className="mb-4 text-sm font-semibold text-slate-900">
                        Submitted Form Responses
                    </h3>

                    {submission.answers?.length ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full min-w-[700px] border-collapse text-left">
                                <thead className="bg-slate-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="w-16 border-b border-slate-200 px-4 py-3">
                                            Sr. No.
                                        </th>
                                        <th className="w-[24%] border-b border-slate-200 px-4 py-3">
                                            Question
                                        </th>
                                        <th className="w-[26%] border-b border-slate-200 px-4 py-3">
                                            Placeholder
                                        </th>
                                        <th className="w-[26%] border-b border-slate-200 px-4 py-3">
                                            Question type
                                        </th>
                                        <th className="border-b border-slate-200 px-4 py-3">
                                            Answer
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {submission.answers.map((answer, index) => {
                                        const questionId = String(
                                            answer.question?._id ||
                                            answer.question?.id ||
                                            answer.question ||
                                            ""
                                        );

                                        const question =
                                            typeof answer.question === "object"
                                                ? answer.question
                                                : questionMap.get(questionId);

                                        const questionText =
                                            question?.question || `Question ${index + 1}`;

                                        const isFile = question?.type === "file";
                                        const fileUrl = isFile
                                            ? getFileUrl(answer, question)
                                            : null;

                                        return (
                                            <tr
                                                key={answer._id || questionId || index}
                                                className="align-top"
                                            >
                                                <td className="px-4 py-4 text-sm text-slate-500">
                                                    {index + 1}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {questionText}
                                                    </p>
                                                    {question?.required && (
                                                        <span className="mt-1 inline-block text-[11px] text-red-500">
                                                            Required
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-4 text-sm leading-5 text-slate-500">
                                                    {question?.placeholder || "—"}
                                                </td>

                                                <td className="px-4 py-4 text-sm leading-5 text-slate-500">
                                                    {question?.type || "—"}
                                                </td>

                                                <td className="px-4 py-4">
                                                    {isFile ? (
                                                        fileUrl ? (
                                                            <div className="flex max-w-xs items-center gap-3 rounded-lg border border-slate-200 bg-white p-2.5">
                                                                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
                                                                    <FileText size={18} />
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-xs font-semibold text-slate-800">
                                                                        {getFileName(answer, question)}
                                                                    </p>
                                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                                        Uploaded file
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openFile(
                                                                            fileUrl,
                                                                            getFileName(answer, question)
                                                                        )
                                                                    }
                                                                    title="View file"
                                                                    className="rounded-md p-2 text-emerald-700 hover:bg-emerald-50"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">
                                                                No file URL available
                                                            </span>
                                                        )
                                                    ) : (
                                                        <div className="flex flex-wrap">
                                                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                                                {formatAnswer(answer.value)}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyAnswer(answer.value, index)}
                                                                title={copiedIndex === index ? "Copied!" : "Copy answer"}
                                                                className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                            >
                                                                {copiedIndex === index ? (
                                                                    <Check size={16} className="text-green-600" />
                                                                ) : (
                                                                    <Copy size={16} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                            No custom answers were submitted.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 p-4">
                    <span className="text-xs text-slate-400">
                        Status: {submission.status || "new"}
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                        Back to submissions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationInfoModal;
