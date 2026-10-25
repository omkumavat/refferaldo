import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    X,
    CheckCircle2,
    BriefcaseBusiness,
    ArrowRight,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import { FormPreview } from "../../components/referral/FormPreview";
import {
    getPublicReferralForm,
    submitReferralApplication,
} from "../../api/referralApi";

const FormPreviewToEmployee = () => {
    const { slug } = useParams();

    const [job, setJob] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [localUser] = useState(
        JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}")
    );

    useEffect(() => {
        let cancelled = false;

        const fetchForm = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPublicReferralForm(slug);

                // Supports either { job, questions } or { data: { job, questions } }
                const result = response.data || response;

                if (!result.form) {
                    throw new Error("Referral form was not found.");
                }

                console.log(result);


                if (cancelled) return;

                setJob(result.form);
                setQuestions(result.questions || []);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to load the application form."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (slug) fetchForm();

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: value,
        }));
    };


    const handleSubmit = async () => {
        setError("");

        // Validate required questions using your existing answers state.
        const missingQuestion = questions.find((question) => {
            if (!question.required) return false;

            const id = String(question._id || question.id);
            const answer = answers[id];

            if (question.type === "file") {
                return !(answer instanceof File);
            }

            return (
                answer == null ||
                answer === "" ||
                (Array.isArray(answer) && answer.length === 0)
            );
        });

        if (missingQuestion) {
            setError(
                `Please answer the required question: ${missingQuestion.question}`
            );
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            const formattedAnswers = [];

            // Applicant details expected by the backend.
            formData.append("userId", localUser?.id || "");
            formData.append("name", localUser?.name || "");
            formData.append("email", localUser?.email || "");
            formData.append("phone", localUser?.phone || "");

            for (const question of questions) {
                const questionId = String(question._id || question.id);
                const value = answers[questionId];

                if (question.type === "file") {
                    if (value instanceof File) {
                        // Field name MUST be the question ID.
                        formData.append(questionId, value);
                    }

                    // The backend will replace this answer with the saved file URL.
                    continue;
                }

                formattedAnswers.push({
                    questionId,
                    answer: value ?? "",
                });
            }

            formData.append(
                "answers",
                JSON.stringify(formattedAnswers)
            );


            await submitReferralApplication(slug, formData);

            setShowSuccess(true);
        } catch (err) {
            console.error(
                "Referral submission failed:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Application submission failed. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                    <p className="mt-3 text-sm text-slate-500">
                        Loading referral form...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                    <h1 className="mt-4 text-xl font-bold text-slate-900">
                        Unable to load referral
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">{error}</p>
                    <Link
                        to="/jobs"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Explore jobs <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-bold text-slate-900"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                            <BriefcaseBusiness size={19} />
                        </span>
                        refermy.life
                    </Link>

                    <Link
                        to="/jobs"
                        onClick={(e) => {
                            if (true) e.preventDefault();
                        }}
                        className={`text-sm font-medium ${true
                            ? "text-slate-400 cursor-not-allowed"
                            : "text-slate-600 hover:text-emerald-600"
                            }`}
                    >
                        Explore jobs
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
                <div className="mb-6">

                    <Link
                        to="/employee/referral/forms"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-300"
                    >
                        <span aria-hidden="true">←</span>
                        Back Referral forms
                    </Link>

                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                        Career opportunity
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Apply for a referral
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Complete the form below to submit your application for this
                        opportunity.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <FormPreview
                    job={job}
                    questions={questions}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />
            </main>

            {/* Success modal */}
            {showSuccess && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onClick={() => setShowSuccess(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="success-title"
                        className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            aria-label="Close success dialog"
                            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                        </div>

                        <div className="mt-5 text-center">
                            <h2
                                id="success-title"
                                className="text-2xl font-bold text-slate-900"
                            >
                                Application submitted!
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Your application for{" "}
                                <span className="font-semibold text-slate-800">
                                    {job?.title}
                                </span>{" "}
                                has been submitted successfully. Thank you for your
                                interest!
                            </p>
                        </div>

                        <div className="mt-7 space-y-3">
                            <Link
                                to="/jobs"
                                onClick={(e) => {
                                    if (true) e.preventDefault();
                                }}
                                className={`text-sm font-medium ${true
                                    ? "text-slate-400 cursor-not-allowed"
                                    : "text-slate-600 hover:text-emerald-600"
                                    }`}
                            >
                                Explore jobs
                            </Link>

                            <Link
                                to="/employee/dashboard"
                                className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Go to dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={() => setShowSuccess(false)}
                                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormPreviewToEmployee;