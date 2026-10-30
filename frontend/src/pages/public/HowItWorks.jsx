
import React from "react";
import { Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import {
  Search,
  FileText,
  UserCheck,
  Building2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  UserRound,
  BriefcaseBusiness,
  ClipboardCheck,
  SlidersHorizontal,
  Send,
  Eye,
  BadgeCheck,
  GitBranch,
  LockKeyhole,
  CircleHelp,
  Target,
  Zap,
  CircleCheck,
} from "lucide-react";

const workflows = [
  {
    number: "01",
    icon: UserRound,
    title: "For candidates",
    subtitle: "Find opportunities. Get noticed. Move forward.",
    description:
      "Build your professional profile, discover relevant jobs, and connect with employees who can help you get referred.",
    color: "emerald",
    steps: [
      {
        icon: ShieldCheck,
        title: "Create and verify your account",
        description:
          "Sign up, verify your account, and complete your candidate profile with your skills, experience, education, and resume.",
      },
      {
        icon: Search,
        title: "Discover relevant opportunities",
        description:
          "Browse available company jobs and employee-created referral forms. Explore role requirements and use AI match scores, when available, to understand how your profile aligns with a role.",
      },
      {
        icon: FileText,
        title: "Submit a referral form",
        description:
          "Open a published referral form, answer the employer- or employee-defined questions, and submit your details and resume. You can track your submission as it progresses.",
      },
      {
        icon: UserCheck,
        title: "Get reviewed by an employee",
        description:
          "The employee reviews your profile, resume, skills, and form responses before deciding whether to refer you. Submitting a form does not guarantee a referral.",
      },
      {
        icon: TrendingUp,
        title: "Track your progress",
        description:
          "Follow available status updates, such as under review, shortlisted, rejected, or referred. Interview and hiring decisions remain with the employer.",
      },
    ],
  },
  {
    number: "02",
    icon: Users,
    title: "For employees and referrers",
    subtitle: "Use your professional experience to help candidates.",
    description:
      "Discover suitable candidates, review referral requests, or create your own referral forms for roles at your company.",
    color: "blue",
    steps: [
      {
        icon: BadgeCheck,
        title: "Verify your employee identity",
        description:
          "Create your employee account, complete your professional profile, and complete the required employment verification process. Corporate email OTP verification can help establish your association with a company.",
      },
      {
        icon: ClipboardCheck,
        title: "Review candidate submissions",
        description:
          "Open incoming applications, inspect answers to custom questions, review resumes and candidate profiles, and decide whether a candidate is suitable for referral.",
      },
      {
        icon: UserRound,
        title: "Refer a candidate directly",
        description:
          "You do not always need a submitted form. Browse candidate profiles and, where the platform permits, initiate a referral directly for a suitable candidate.",
      },
      {
        icon: SlidersHorizontal,
        title: "Create a custom referral form",
        description:
          "Build a form for a job at your company. Add a role title, description, required experience, skills, and custom questions using text fields, dropdowns, radio buttons, checkboxes, and other supported field types.",
      },
      {
        icon: Send,
        title: "Publish and manage referrals",
        description:
          "Publish your form when it is ready, review submissions, update candidate statuses, and keep referral activity organized in your dashboard.",
      },
    ],
  },
  // {
  //   number: "03",
  //   icon: Building2,
  //   title: "For companies",
  //   subtitle: "Establish trust before listing opportunities.",
  //   description:
  //     "Company accounts provide a structured way to present job opportunities and make them available to candidates and verified referrers.",
  //   color: "slate",
  //   steps: [
  //     {
  //       icon: Building2,
  //       title: "Register your company",
  //       description:
  //         "Create a company account and provide the organization details needed for the platform's company verification process.",
  //     },
  //     {
  //       icon: ShieldCheck,
  //       title: "Complete company verification",
  //       description:
  //         "Submit the required information for review. Company job listings should become publicly available only after the required verification and approval checks are satisfied.",
  //     },
  //     {
  //       icon: BriefcaseBusiness,
  //       title: "Create and list job opportunities",
  //       description:
  //         "Add job details such as role, location, experience, required skills, employment type, and description so candidates understand the opportunity.",
  //     },
  //     {
  //       icon: Eye,
  //       title: "Review candidates and referrals",
  //       description:
  //         "Manage the hiring pipeline using available application and referral information. Review candidate submissions and coordinate next steps through the supported workflow.",
  //     },
  //     {
  //       icon: CheckCircle2,
  //       title: "Manage hiring outcomes",
  //       description:
  //         "Keep application statuses organized and update candidates as their referral or hiring progress changes.",
  //     },
  //   ],
  // },
];

const platformFeatures = [
  {
    icon: ShieldCheck,
    title: "Verification and trust",
    description:
      "Candidate account verification, employee employment verification, and company verification help establish a more trustworthy referral ecosystem.",
  },
  {
    icon: Sparkles,
    title: "AI-powered matching",
    description:
      "Where available, matching highlights relevant skills and potential gaps so candidates and referrers can evaluate role fit more easily.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible referral forms",
    description:
      "Employees can tailor questions to a particular role instead of relying on one generic application form.",
  },
  {
    icon: Eye,
    title: "Profile-first referrals",
    description:
      "Employees can assess a candidate's professional profile and, where supported, initiate a referral without waiting for a form submission.",
  },
  {
    icon: GitBranch,
    title: "Referral status tracking",
    description:
      "Follow the progress of submissions and referrals through the status updates available on the platform.",
  },
  {
    icon: LockKeyhole,
    title: "Structured candidate information",
    description:
      "Profiles, resumes, and form responses keep relevant candidate information organized for review.",
  },
];

const verificationItems = [
  {
    role: "Candidates",
    icon: UserRound,
    description:
      "Verify your account and provide an accurate profile, contact information, and professional background.",
    badge: "Candidate verification",
  },
  {
    role: "Employees",
    icon: UserCheck,
    description:
      "Complete the required employee verification process before using features restricted to verified referrers.",
    badge: "Employment verification",
  },
  // {
  //   role: "Companies",
  //   icon: Building2,
  //   description:
  //     "Complete company verification and the applicable approval process before publishing company job listings.",
  //   badge: "Company verification",
  // },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function JourneyCard({ workflow }) {
  const Icon = workflow.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm ">
      <div className="border-b border-slate-100 p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-emerald-700">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-widest text-emerald-700">
              JOURNEY {workflow.number}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {workflow.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-600">
              {workflow.subtitle}
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          {workflow.description}
        </p>
      </div>

      <div className="p-6 sm:p-7">
        <ol className="relative space-y-7">
          {workflow.steps.map((step, index) => {
            const StepIcon = step.icon;

            return (
              <li key={step.title} className="relative flex gap-4">
                {index !== workflow.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-11 h-[calc(100%+12px)] w-px bg-slate-200"
                  />
                )}

                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                  <StepIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h4 className="mt-1 font-semibold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </article>
  );
}

export const HowItWorks = () => (
  <>
  <div className="min-h-screen page-container py-1">
    <PublicNav />

    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full  blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200  px-4 py-2 text-sm font-medium text-whi-800 shadow-sm">
              <Sparkles className="h-4 w-4" />
              A clearer path to employee referrals
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-850 sm:text-5xl lg:text-6xl">
              Good opportunities start with{" "}
              <span className="text-emerald-700">the right connection.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              refermy.life connects candidates looking for opportunities,
              employees willing to refer talent, and companies building their
              teams. Explore jobs, create custom referral forms, review
              profiles, and manage referrals in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/public/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Explore opportunities
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Get started
              </Link>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Referrals are not guaranteed. Hiring decisions remain with the
              employer.
            </p>
          </div>

          {/* At-a-glance workflow */}
          <div className="mx-auto mt-14 grid max-w-5xl grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: UserRound,
                title: "Candidates",
                text: "Discover jobs and submit applications",
              },
              {
                icon: Users,
                title: "Employees",
                text: "Review profiles and make referrals",
              },
              // {
              //   icon: Building2,
              //   title: "Companies",
              //   text: "Verify organizations and list jobs",
              // },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three journeys */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Three ways to use refermy.life"
          title="Choose your journey"
          description="Each account type has a different purpose. Here is how the process works from registration to referral and hiring."
        />

        <div className="mt-10 grid grid-cols-1 items-start justify-center gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {workflows.map((workflow) => (
            <JourneyCard key={workflow.number} workflow={workflow} />
          ))}
        </div>
      </section>

      {/* Referral form explainer */}
      <section className="border-y border-slate-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <SectionHeading
              eyebrow="Built for each role"
              title="Every referral form can ask the right questions."
              description="A backend developer role may need different information from a product designer or data analyst. Employees can create role-specific referral forms instead of collecting the same generic information for every opportunity."
            />

            <div className="mt-7 space-y-4">
              {[
                "Set the role title, job description, experience requirements, and skills.",
                "Add questions relevant to the opportunity and mark important fields as required.",
                "Choose from supported question types such as text, email, dropdown, radio button, checkbox, and file upload.",
                "Preview the form, publish it when ready, and review candidate responses in one place.",
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-6 text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form preview illustration */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  Example referral form
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Backend Developer
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Illustrative form preview
                </p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full name *
                </label>
                <div className="mt-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-400">
                  Enter your full name
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Years of experience *
                </label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-400">
                  Select experience
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Skills
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Node.js", "MongoDB", "REST APIs"].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Upload resume *
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 p-3">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    Select a resume file
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Role-specific questions
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Employees can add custom questions to gather the details
                  needed to evaluate a candidate for this role.
                </p>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                This is a non-interactive illustration, not a live form.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and verification */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Trust comes first"
          title="Verification matters at every level."
          description="Different account types have different responsibilities. The required verification and approval checks help establish who is participating and which organizations can publish opportunities."
        />

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {verificationItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.role}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {item.badge}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {item.role}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-sm leading-6 text-amber-900">
            Verification helps establish trust, but it does not guarantee a
            job, referral, interview, or hiring outcome. Candidates should
            review opportunities carefully and share information only through
            the platform's intended workflows.
          </p>
        </div>
      </section>

      {/* Platform features */}
      <section className="border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow="One connected platform"
            title="More than a job listing website."
            description="Refermy.life brings candidate discovery, employee-led referrals, customizable forms, and referral tracking together."
          />

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            <Target className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next opportunity could start with a referral.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Complete your profile, explore opportunities, or join as an
            employee referrer. Build meaningful connections through a more
            structured referral process.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Find opportunities
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-slate-400 hover:bg-white/5"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  </div>
  <Footer />
  </>
);
