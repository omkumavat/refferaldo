import React from "react";
import { Link } from "react-router-dom";
import { PublicNav, Footer } from "../../components/layout/PublicNav";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileCheck2,
  Fingerprint,
  GitBranch,
  Layers3,
  MoveUpRight,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserRoundCheck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { companies } from "../../data/companies";
import { testimonials } from "../../data/testimonials";

const steps = [
  {
    number: "01",
    title: "Build your profile",
    description:
      "Create your professional identity once. Keep your skills, experience, resume, and career goals ready for every opportunity.",
    icon: CircleUserRound,
    tag: "Your professional identity",
  },
  {
    number: "02",
    title: "Choose how to get referred",
    description:
      "Fill out an employee-created referral form, or let a verified employee refer you directly. No single path fits everyone.",
    icon: GitBranch,
    tag: "Two ways to connect",
  },
  {
    number: "03",
    title: "Move your application forward",
    description:
      "Keep your referral submissions organized, follow their status, and know where each opportunity stands.",
    icon: Target,
    tag: "Your career, in motion",
  },
];

const pathways = [
  {
    number: "01",
    title: "Create a referral form",
    description:
      "Build a custom form for a role, collect relevant candidate details, and share it with people who want a referral.",
    icon: FileCheck2,
    label: "CUSTOM REFERRAL FORMS",
  },
  {
    number: "02",
    title: "Refer someone directly",
    description:
      "Already know a suitable candidate? Use their profile to initiate a referral without making them complete a separate form.",
    icon: UserRoundCheck,
    label: "DIRECT REFERRALS",
  },
];

const benefits = [
  "One professional profile to maintain",
  "Custom forms for role-specific information",
  "Direct referrals without an extra form",
  "Organized submissions and status tracking",
];

export const Landing = () => {
  return (
    <>
    <div className="min-h-screen  bg-[#080B0A] text-white page-container py-2">
      <PublicNav />

      {/* HERO */}
      <section className="relative isolate">
        {/* Ambient background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0" />
          <div className="absolute inset-0 " />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:54px_54px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-32">
          {/* Left side */}
          <div className="relative z-10 lg:col-span-7">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              A better way to get referred
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px]">
              Good people.
              <br />
              Great opportunities.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Better connections.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
              Your next opportunity shouldn't get lost in a pile of applications.
              Connect with employees, get referred, and move your career forward
              — one meaningful connection at a time.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-semibold text-[#07120D] transition-all duration-300"
                data-testid="hero-find-job"
              >
                Explore opportunities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-medium text-white transition-all hover:border-emerald-400/40 hover:bg-white/[0.07]"
                data-testid="hero-signup"
              >
                Join the network
                <MoveUpRight className="h-4 w-4 text-emerald-400" />
              </Link>
            </div>

            <div className="mt-11 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Professional profiles
              </span>
              <span className="inline-flex items-center gap-2">
                <Workflow className="h-4 w-4 text-emerald-400" />
                Flexible referral flows
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                Free for candidates
              </span>
            </div>
          </div>

          {/* Right side: referral activity visualization */}
          <div className="relative mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none">
            <div className="absolute -inset-8 rounded-full bg-emerald-400/[0.07] blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#0E1311] shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <p className="text-xs text-zinc-500">REFERMY.LIFE / WORKSPACE</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Your referral network
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <Network className="h-4 w-4 text-emerald-400" />
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {/* Profile visualization */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.12] to-transparent p-5">
                  <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full border border-emerald-400/10" />
                  <div className="absolute -right-2 -top-4 h-24 w-24 rounded-full border border-emerald-400/10" />

                  <div className="relative flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-[#07120D]">
                      <CircleUserRound className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">
                        Your professional profile
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        Skills · Experience · Resume
                      </p>
                    </div>
                    <BadgeCheck className="ml-auto h-5 w-5 shrink-0 text-emerald-400" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Your skills", "Experience", "Resume"].map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Branches */}
                <div className="relative ml-7 border-l border-dashed border-emerald-400/30 py-5 pl-6">
                  <div className="absolute -left-[5px] top-7 h-2 w-2 rounded-full bg-emerald-400" />
                  <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-zinc-500">
                    TWO WAYS TO GET REFERRED
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-400/10">
                        <FileCheck2 className="h-5 w-5 text-slate-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          Fill a referral form
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Apply through a custom form
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                        <UserRoundCheck className="h-5 w-5 text-emerald-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          Get referred directly
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          An employee submits your profile
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Everything in one place
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Manage your referrals and track your submissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#151A17] p-4 shadow-2xl sm:flex lg:-left-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                <Fingerprint className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Your profile. Your journey.
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Built around real connections
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED COMPANIES */}
      <section className="border-y border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-emerald-400">
                EXPLORE YOUR NEXT MOVE
              </p>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
                Discover companies worth connecting with.
              </h2>
            </div>
            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-emerald-400"
            >
              Explore opportunities
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {companies.slice(0, 8).map((company) => (
              <div
                key={company.id}
                className="group flex min-w-0 flex-col items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-5 transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={company.symbol}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="max-w-full break-words text-center text-xs font-medium text-zinc-300 transition group-hover:text-white">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM / THE PROMISE */}
      <section className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full  blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
                A MORE HUMAN WAY TO HIRE
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                Less applying into the void.
                <span className="text-zinc-500">
                  {" "}
                  More meaningful connections.
                </span>
              </h2>
              <p className="mt-6 text-base leading-8 text-zinc-400">
                Finding the right role is only half the challenge. Knowing
                someone who can help you get your profile in front of the right
                people can make the journey more personal.
              </p>

              <Link
                to="/how-it-works"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                See how Refermy.life works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="lg:col-span-7 lg:pl-8">
              <div className="border-t border-white/10">
                {[
                  {
                    n: "01",
                    title: "Applications without context",
                    description:
                      "A resume alone may not communicate everything a candidate brings to the table.",
                    icon: Search,
                  },
                  {
                    n: "02",
                    title: "Disconnected referral processes",
                    description:
                      "Finding an employee, sharing information, and following up can become unnecessarily complicated.",
                    icon: GitBranch,
                  },
                  {
                    n: "03",
                    title: "A more organized connection",
                    description:
                      "Bring profiles, custom forms, direct referrals, and submission tracking into one workflow.",
                    icon: Network,
                  },
                ].map((item) => (
                  <div
                    key={item.n}
                    className="group grid grid-cols-[44px_1fr] gap-4 border-b border-white/10 py-7 transition-colors sm:grid-cols-[54px_1fr]"
                  >
                    <span className="pt-1 text-xs font-medium tracking-wider text-emerald-400/70">
                      {item.n}
                    </span>
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-medium text-white transition  sm:text-xl">
                          {item.title}
                        </h3>
                        <item.icon className="mt-1 h-5 w-5 shrink-0 text-zinc-600 transition " />
                      </div>
                      <p className="mt-2 max-w-lg text-sm leading-7 text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO REFERRAL PATHWAYS */}
      <section className="relative overflow-hidden border-y border-white/[0.07] py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
              FLEXIBLE BY DESIGN
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              One platform.
              <br />
              <span className="text-zinc-500">Two ways to refer.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
              Not every referral starts the same way. Sometimes you need a
              structured form. Sometimes you already know the right person.
              Refermy.life supports both.
            </p>
          </div>

          <div className="mt-16 grid gap-0 lg:grid-cols-2">
            {pathways.map((pathway, index) => (
              <div
                key={pathway.number}
                className={`group relative border-t border-white/10 py-9 sm:py-11 ${
                  index === 0
                    ? "lg:border-r lg:pr-12"
                    : "lg:pl-12"
                }`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 transition duration-300 group-hover:border-emerald-400/50 ">
                    <pathway.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium tracking-widest text-zinc-600">
                    {pathway.number}
                  </span>
                </div>

                <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-emerald-400/80">
                  {pathway.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {pathway.title}
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                  {pathway.description}
                </p>

                {index === 0 ? (
                  <div className="mt-8 max-w-md border-l-2 border-emerald-400/40 pl-5">
                    <p className="text-sm font-medium text-zinc-200">
                      A structured application experience
                    </p>
                    <p className="mt-1 text-xs leading-6 text-zinc-500">
                      Role details, required information, and candidate
                      responses in a format the employee defines.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 max-w-md border-l-2 border-emerald-400/40 pl-5">
                    <p className="text-sm font-medium text-zinc-200">
                      A shorter route to a referral
                    </p>
                    <p className="mt-1 text-xs leading-6 text-zinc-500">
                      Use an existing candidate profile to start the referral
                      process directly.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
                YOUR JOURNEY STARTS HERE
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                From profile to referral.
                <br />
                <span className="text-zinc-500">Without the confusion.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-zinc-500">
              A simple, organized process for candidates and employees to make
              professional connections more useful.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="absolute left-7 top-8 hidden h-px w-[calc(100%-56px)] bg-gradient-to-r from-emerald-400/50 via-emerald-400/20 to-transparent lg:block" />

            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/25 bg-[#080B0A]">
                    <step.icon className="h-6 w-6 text-emerald-400" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#080B0A] bg-emerald-400 text-[10px] font-bold text-[#07120D]">
                      {step.number.slice(1)}
                    </span>
                  </div>

                  <p className="mt-7 text-[10px] font-semibold tracking-[0.17em] text-emerald-400">
                    {step.tag.toUpperCase()}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOR EMPLOYEES */}
      <section className="relative border-y border-white/[0.07] py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
              FOR EMPLOYEES
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
              Your network is valuable.
              <span className="text-zinc-500">
                {" "}
                Make it count.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
              Help suitable candidates discover opportunities at your company.
              Create a custom referral form when you need structured responses,
              or refer a candidate directly when you already have the right
              profile.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Build and manage custom referral forms",
                "Refer candidates directly from their profiles",
                "Keep your professional and employee profile updated",
                "Manage referral submissions in one place",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-sm leading-6 text-zinc-300">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/employee/dashboard"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-semibold text-[#07120D] transition hover:bg-emerald-300"
            >
              Explore the employee experience
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Editorial, layered interface — not a card grid */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-full blur-3xl" />

            <div className="relative border-y border-white/10 py-7 sm:py-9">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                    <BriefcaseBusiness className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Employee workspace
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Your referrals, your way
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/20 px-3 py-1.5 text-[10px] font-medium text-emerald-300">
                  FLEXIBLE FLOW
                </span>
              </div>

              <div className="mt-9 space-y-0">
                <div className="flex items-start gap-4 border-t border-white/[0.08] py-6">
                  <span className="pt-1 text-xs text-zinc-600">01</span>
                  <div className="flex-1">
                    <p className="text-base font-medium text-white">
                      Design a referral form
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Choose the questions and details needed for a specific
                      opportunity.
                    </p>
                  </div>
                  <FileCheck2 className="mt-1 h-5 w-5 text-emerald-400" />
                </div>

                <div className="flex items-start gap-4 border-t border-white/[0.08] py-6">
                  <span className="pt-1 text-xs text-zinc-600">02</span>
                  <div className="flex-1">
                    <p className="text-base font-medium text-white">
                      Refer a candidate directly
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Skip the custom form when a candidate profile already
                      has the information you need.
                    </p>
                  </div>
                  <UserRoundCheck className="mt-1 h-5 w-5 text-emerald-400" />
                </div>

                <div className="flex items-start gap-4 border-y border-white/[0.08] py-6">
                  <span className="pt-1 text-xs text-zinc-600">03</span>
                  <div className="flex-1">
                    <p className="text-base font-medium text-white">
                      Keep submissions organized
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Review candidate details and follow referral progress
                      through your workspace.
                    </p>
                  </div>
                  <Layers3 className="mt-1 h-5 w-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR CANDIDATES */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full  blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-6">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
                FOR CANDIDATES
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                Your skills deserve
                <br />
                <span className="text-zinc-500">the right introduction.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
                Create your profile once, discover opportunities, and connect
                with employees who can refer you. Complete a custom referral
                form when required, or get referred directly through your
                existing profile.
              </p>

              <Link
                to="/jobs"
                className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Find your next opportunity
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="border-t border-white/10">
                {[
                  {
                    title: "One profile, multiple opportunities",
                    description:
                      "Maintain your skills, experience, and resume in one place.",
                    icon: CircleUserRound,
                  },
                  {
                    title: "Apply through custom referral forms",
                    description:
                      "Provide the role-specific information requested by an employee.",
                    icon: FileCheck2,
                  },
                  {
                    title: "Receive direct referrals",
                    description:
                      "Employees can use your profile to initiate a referral without an additional custom form.",
                    icon: UserRoundCheck,
                  },
                  {
                    title: "Keep track of your submissions",
                    description:
                      "Review your referral activity and the latest status available to you.",
                    icon: Target,
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="group flex gap-5 border-b border-white/10 py-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.035] transition-colors group-hover:bg-emerald-400/10">
                      <item.icon className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-medium text-white">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-zinc-700">
                          0{index + 1}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE FIRST */}
      <section className="  py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
                START WITH YOUR PROFILE
              </p>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                Good connections start with
                <span className="text-zinc-500"> the right information.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
                Your profile is the foundation of your referral journey. Keep
                your professional details current so candidates and employees
                can work with the information relevant to their role.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 blur-2xl" />
              <div className="relative space-y-0">
                {[
                  {
                    n: "01",
                    title: "Professional details",
                    detail: "Your identity and contact information",
                  },
                  {
                    n: "02",
                    title: "Skills and experience",
                    detail: "What you know and what you have worked on",
                  },
                  {
                    n: "03",
                    title: "Resume and career interests",
                    detail: "Your qualifications and opportunities of interest",
                  },
                ].map((item) => (
                  <div
                    key={item.n}
                    className="group flex items-center gap-5 border-t border-white/10 py-6 transition-colors last:border-b "
                  >
                    <span className="text-xs text-emerald-400">{item.n}</span>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-zinc-500">
                        {item.detail}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-emerald-400">
                PEOPLE FIRST
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Careers move forward
                <span className="text-zinc-500"> through connections.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Users className="h-4 w-4 text-emerald-400" />
              Built around professional connections
            </div>
          </div>

          <div className="mt-14 grid gap-0 md:grid-cols-2 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.name}
                className={`py-8 ${
                  index === 0
                    ? "border-y border-white/10 md:border-b-0 md:pt-8"
                    : "border-b border-white/10 md:border-y md:pt-8"
                }`}
              >
                <div className="flex items-center gap-1 text-emerald-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 text-lg leading-8 text-zinc-200 sm:text-xl">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full border border-white/10 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {testimonial.role} · {testimonial.context}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section> */}

      {/* FINAL CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#0D1511]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(16,185,129,0.16),transparent_50%)]" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full border border-emerald-400/[0.08]" />
          <div className="pointer-events-none absolute -bottom-24 -left-4 h-48 w-48 rounded-full border border-emerald-400/[0.08]" />

          <div className="relative grid items-center gap-10 px-7 py-14 sm:px-12 sm:py-16 lg:grid-cols-12 lg:px-16 lg:py-20">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-emerald-400">
                <Sparkles className="h-4 w-4" />
                YOUR NEXT CHAPTER STARTS HERE
              </div>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                Don't just apply.
                <br />
                <span className="text-emerald-400">Make a connection.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Create your profile, discover opportunities, and build
                meaningful connections through referrals.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4 lg:items-start lg:pl-4">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-semibold text-[#07120D] transition-all "
                data-testid="cta-signup"
              >
                Get started for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-4 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                See how it works
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
    <Footer />
    </>
  );
};
