import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Send,
    Eye,
    Settings2,
    Loader2,
} from "lucide-react";

import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { JobDetailsForm } from "../../components/referral/JobDetailsForm";
import { SuggestedQuestions } from "../../components/referral/SuggestedQuestions";
import { QuestionBuilder } from "../../components/referral/QuestionBuilder";
import { FormPreview } from "../../components/referral/FormPreview";
import { getReferralById, updateReferral } from "../../api/referralApi";

const EMPTY_JOB = {
    title: "",
    description: "",
    location: "",
    workMode: "onsite",
    employmentType: "full-time",
    experienceMin: "",
    experienceMax: "",
    skills: [],
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: "",
    slug: "",
    status: "",
    department: "Engineering & Technology"
};

const DEFAULT_QUESTIONS = () => [
    {
        id: crypto.randomUUID(),
        question: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
        options: [],
    },
    {
        id: crypto.randomUUID(),
        question: "Email Address",
        type: "email",
        required: true,
        placeholder: "you@example.com",
        options: [],
    },
    {
        id: crypto.randomUUID(),
        question: "Resume",
        type: "file",
        required: true,
        placeholder: "",
        options: [],
    },
];

// ISO date -> yyyy-mm-dd for <input type="date">
const toDateInputValue = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
};

export const CreateReferral = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit"); // null when creating
    const isEdit = Boolean(editId);

    const [activeTab, setActiveTab] = useState("details");
    const [localUser] = useState(
        JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
    );

    const [job, setJob] = useState(EMPTY_JOB);
    const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

    const [loadingJob, setLoadingJob] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    // published === true only when the referral is ACTIVE.
    // Once active, the builder is locked and the publish/draft buttons are hidden.
    const [published, setPublished] = useState(false);
    const [publicLink, setPublicLink] = useState("");

    // Same link format the slug field shows in JobDetailsForm. Change the domain if needed.
    const buildPublicLink = (slug) =>
        `https://refer.com/${localUser?.id?.slice(0, 4)}-${slug}`;

    /* ---------------- QUESTIONS ---------------- */

    const addQuestion = (question) => {
        setQuestions((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                question: question.question || "",
                type: question.type || "text",
                required: question.required ?? false,
                placeholder: question.placeholder || "",
                options: question.options || [],
            },
        ]);
    };

    const updateQuestion = (id, updatedQuestion) => {
        setQuestions((prev) =>
            prev.map((question) =>
                question.id === id ? { ...question, ...updatedQuestion } : question
            )
        );
    };

    const deleteQuestion = (id) => {
        setQuestions((prev) => prev.filter((question) => question.id !== id));
    };

    const moveQuestion = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= questions.length) return;

        const updated = [...questions];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setQuestions(updated);
    };

    /* ---------------- LOAD (EDIT MODE) ---------------- */

    useEffect(() => {
        if (!isEdit) return;

        const loadJob = async () => {
            const res = await getReferralById(editId);

            if (!res.success) {
                console.error(res.error);
                navigate("/employee/refer-job");
                return;
            }

            const loaded = res.job;

            setJob({
                ...EMPTY_JOB,
                ...loaded,
                skills: loaded.skills || [],
                applicationDeadline: toDateInputValue(loaded.applicationDeadline),
            });

            if (loaded.questions) {
                setQuestions(
                    [...loaded.questions]
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((q) => ({
                            id: q._id || crypto.randomUUID(),
                            question: q.question || "",
                            type: q.type || "text",
                            required: q.required ?? false,
                            placeholder: q.placeholder || "",
                            options: q.options || [],
                        }))
                );
            }

            if (loaded.status === "active") {
                setPublished(true);
                setPublicLink(buildPublicLink(loaded.slug));
            }

            setLoadingJob(false);
        };

        loadJob();
    }, [editId]);

    /* ---------------- SAVE DRAFT / PUBLISH ---------------- */

    const handlePublish = async (stat) => {
        if (submitting || published) return;

        if (!job.title.trim()) {
            alert("Please enter a role name");
            return;
        }

        if (!job.location.trim()) {
            alert("Please enter a job location");
            return;
        }

        // if (stat === "active" && !job.slug.trim()) {
        //     alert("Please enter a slug for the public link");
        //     return;
        // }

        try {
            setSubmitting(true);

            const payload = {
                title: job.title,
                description: job.description,
                location: job.location,
                workMode: job.workMode,
                employmentType: job.employmentType,
                experienceMin: job.experienceMin,
                experienceMax: job.experienceMax,
                skills: job.skills,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                slug: job.slug,
                status: stat,
                department: job.department,
                applicationDeadline: job.applicationDeadline || null,
                questions: questions.map((question, index) => ({
                    question: question.question,
                    type: question.type,
                    options: question.options || [],
                    placeholder: question.placeholder || "",
                    required: question.required,
                    order: index,
                })),
            };
            console.log(payload);
            
            let formId;

            if (isEdit) {
                // updateReferral already returns { success, job, error }
                const result = await updateReferral(editId, payload);
                if (!result.success) {
                    throw new Error(result.error || "Failed to update referral");
                }
                formId = editId;
            } else {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/referrals`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(payload),
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to create referral");
                }

                formId = result.data._id;
            }

            if (stat === "draft") {
                navigate("/employee/refer-job");
                return;
            }

            const publishResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/referrals/${formId}/publish`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const publishResult = await publishResponse.json();

            if (!publishResponse.ok || !publishResult.success) {
                throw new Error(publishResult.message || "Failed to publish referral");
            }

            setJob((prev) => ({ ...prev, status: "active" }));
            setPublicLink(buildPublicLink(publishResult.data.slug));
            setPublished(true);
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- RENDER ---------------- */

    if (loadingJob) {
        return (
            <DashboardShell
                role="employee"
                roleLabel="Employee"
                sidebar={employeeSidebar}
                userName={localUser.name}
            >
                <div className="flex items-center justify-center py-32 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading referral...
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell
            role="employee"
            roleLabel="Employee"
            sidebar={employeeSidebar}
            userName={localUser.name}
        >
            <div className="max-w-7xl mx-auto">
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <Link
                            to="/employee/refer-job"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-3"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Refer a Job
                        </Link>

                        <h1 className="text-2xl font-bold text-slate-900">
                            {isEdit ? "Edit personal referral" : "Create personal referral"}
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Create a simple application form and share it with candidates.
                        </p>
                    </div>

                    {/* Hidden once the referral is published */}
                    {!published && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handlePublish("draft")}
                                disabled={submitting}
                                className="btn-secondary inline-flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save draft
                            </button>

                            <button
                                type="button"
                                onClick={() => handlePublish("active")}
                                disabled={submitting}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                {submitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                Publish form
                            </button>
                        </div>
                    )}
                </div>

                {/* Success: only for active referrals */}
                {published && (
                    <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-emerald-800">
                                    Your referral form is live!
                                </p>

                                <p className="text-sm text-emerald-700 mt-1 break-all">
                                    {publicLink}
                                </p>

                                <p className="text-xs text-emerald-700/80 mt-1">
                                    Published forms are locked and can no longer be edited.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(publicLink)}
                                className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-100 shrink-0"
                            >
                                Copy link
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile tabs */}
                <div className="lg:hidden flex bg-white border border-slate-200 rounded-xl p-1 mb-5">
                    <button
                        type="button"
                        onClick={() => setActiveTab("details")}
                        className={`flex-1 py-2 text-sm rounded-lg ${activeTab === "details"
                            ? "bg-slate-900 text-white"
                            : "text-slate-600"
                            }`}
                    >
                        <Settings2 className="w-4 h-4 inline mr-1.5" />
                        Builder
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("preview")}
                        className={`flex-1 py-2 text-sm rounded-lg ${activeTab === "preview"
                            ? "bg-slate-900 text-white"
                            : "text-slate-600"
                            }`}
                    >
                        <Eye className="w-4 h-4 inline mr-1.5" />
                        Preview
                    </button>
                </div>

                {/* Main */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6">
                    {/* Builder — a disabled fieldset disables every input/button inside it */}
                    <fieldset
                        disabled={published}
                        className={`min-w-0 space-y-6 border-0 p-0 m-0 ${published ? "opacity-60" : ""
                            } ${activeTab === "preview" ? "hidden lg:block" : ""}`}
                    >
                        <JobDetailsForm job={job} setJob={setJob} />

                        <SuggestedQuestions
                            questions={questions}
                            onAdd={addQuestion}
                        />

                        <QuestionBuilder
                            questions={questions}
                            onAdd={addQuestion}
                            onUpdate={updateQuestion}
                            onDelete={deleteQuestion}
                            onMove={moveQuestion}
                        />
                    </fieldset>

                    {/* Preview */}
                    <div
                        className={`lg:block ${activeTab === "details" ? "hidden lg:block" : ""
                            }`}
                    >
                        <div className="lg:sticky lg:top-6">
                            <FormPreview job={job} questions={questions} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};