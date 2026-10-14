import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Send,
    Eye,
    Settings2,
} from "lucide-react";

import { DashboardShell } from "../../components/layout/DashboardShell";
import { employeeSidebar } from "./Dashboard";
import { JobDetailsForm } from "../../components/referral/JobDetailsForm";
import { SuggestedQuestions } from "../../components/referral/SuggestedQuestions";
import { QuestionBuilder } from "../../components/referral/QuestionBuilder";
import { FormPreview } from "../../components/referral/FormPreview";

export const CreateReferral = () => {
    const [activeTab, setActiveTab] = useState("details");
    const [localUser] = useState(
        JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
    )
    const [publicLink, setPublicLink] = useState("");
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit"); // null when creating
    const isEdit = Boolean(editId);

    const [job, setJob] = useState({
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
        slug: ""
    });

    const [questions, setQuestions] = useState([
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
    ]);

    const [published, setPublished] = useState(false);

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
                question.id === id
                    ? { ...question, ...updatedQuestion }
                    : question
            )
        );
    };

    const deleteQuestion = (id) => {
        setQuestions((prev) =>
            prev.filter((question) => question.id !== id)
        );
    };

    const moveQuestion = (index, direction) => {
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= questions.length) return;

        const updated = [...questions];

        [updated[index], updated[newIndex]] = [
            updated[newIndex],
            updated[index],
        ];

        setQuestions(updated);
    };

    // const publicLink = useMemo(() => {
    //     const slug = job.title
    //         ? job.title
    //             .toLowerCase()
    //             .trim()
    //             .replace(/[^a-z0-9]+/g, "-")
    //             .replace(/^-|-$/g, "")
    //         : "your-referral";

    //     return `https://referly.app/apply/${slug}-x82kd`;
    // }, [job.title]);

    const handlePublish = async () => {
        try {
            if (!job.title.trim()) {
                alert("Please enter a role name");
                return;
            }

            const payload = {
                title: job.title,
                description: job.description,
                location: job.location,

                workMode: job.workMode,

                employmentType:
                    job.employmentType,

                experienceMin:
                    job.experienceMin,

                experienceMax:
                    job.experienceMax,

                skills: job.skills,

                salaryMin:
                    job.salaryMin,

                salaryMax:
                    job.salaryMax,

                applicationDeadline:
                    job.applicationDeadline || null,

                questions: questions.map(
                    (question, index) => ({
                        question: question.question,
                        type: question.type,
                        options: question.options || [],
                        placeholder:
                            question.placeholder || "",
                        required:
                            question.required,
                        order: index,
                    })
                ),
            };

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/referrals`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",

                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Failed to create referral"
                );
            }

            const formId = result.data._id;

            // Publish after creation
            const publishResponse =
                await fetch(
                    `${import.meta.env.VITE_API_URL}/referrals/${formId}/publish`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

            const publishResult =
                await publishResponse.json();

            if (
                !publishResponse.ok ||
                !publishResult.success
            ) {
                throw new Error(
                    publishResult.message ||
                    "Failed to publish referral"
                );
            }

            const publicUrl = job.slug

            setPublished(true);

            setPublicLink(publicUrl);

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Failed to create referral"
            );
        }
    };

    useEffect(() => {
  if (!isEdit) return;

  const loadJob = async () => {
    const res = await getReferralById(editId);
    if (res.success) {
      setJob(res.job); // your existing form state
    } else {
      console.error(res.error);
      navigate("/employee/refer-job"); // bad or foreign id: leave the page
    }
    setLoadingJob(false);
  };

  loadJob();
}, [editId]);

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
                            Create personal referral
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Create a simple application form and share it with candidates.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => console.log("Draft", { job, questions })}
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save draft
                        </button>

                        <button
                            onClick={handlePublish}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Publish form
                        </button>
                    </div>
                </div>

                {/* Success */}
                {published && (
                    <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-emerald-800">
                                    Your referral form is ready!
                                </p>

                                <p className="text-sm text-emerald-700 mt-1 break-all">
                                    {publicLink}
                                </p>
                            </div>

                            <button
                                onClick={() => navigator.clipboard.writeText(publicLink)}
                                className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                                Copy link
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile tabs */}
                <div className="lg:hidden flex bg-white border border-slate-200 rounded-xl p-1 mb-5">
                    <button
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
                    {/* Builder */}
                    <div
                        className={`space-y-6 ${activeTab === "preview" ? "hidden lg:block" : ""
                            }`}
                    >
                        <JobDetailsForm
                            job={job}
                            setJob={setJob}
                        />

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
                    </div>

                    {/* Preview */}
                    <div
                        className={`lg:block ${activeTab === "details" ? "hidden lg:block" : ""
                            }`}
                    >
                        <div className="lg:sticky lg:top-6">
                            <FormPreview
                                job={job}
                                questions={questions}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
};