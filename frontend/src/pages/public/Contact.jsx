
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Footer, PublicNav } from "../../components/layout/PublicNav";

const contactTopics = [
  "General Inquiry",
  "Job Referral Support",
  "Account & Profile",
  "Company Partnership",
  "Report a Problem",
  "Feedback & Suggestions",
  "Other",
];

const contactMethods = [
  {
    icon: "✉",
    title: "Email us",
    description: "Have a detailed question? Drop us an email.",
    value: "hello@yourdomain.com",
    href: "mailto:hello@yourdomain.com",
    color: "slate",
  },
  {
    icon: "🤝",
    title: "Partnerships",
    description: "Interested in bringing your company to Referly?",
    value: "Let's collaborate",
    href: "#contact-form",
    color: "pink",
  },
  {
    icon: "💡",
    title: "Share an idea",
    description: "Help us make referrals better for everyone.",
    value: "We are listening",
    href: "#contact-form",
    color: "blue",
  },
];

const faqs = [
  {
    question: "How can I get help with a job referral?",
    answer:
      "Choose Job Referral Support in the contact form and explain your situation. Include the job title or referral link if available.",
  },
  {
    question: "I found a bug or technical issue. What should I do?",
    answer:
      "Select Report a Problem and describe what happened, what you expected, and the steps needed to reproduce it. Please don't include passwords or sensitive personal information.",
  },
  {
    question: "Can my company partner with Referly?",
    answer:
      "Absolutely! Select Company Partnership and tell us about your company, hiring needs, and how you would like to collaborate.",
  },
  {
    question: "How long will it take to receive a response?",
    answer:
      "We aim to respond as soon as possible. Response times may vary depending on the nature and volume of inquiries.",
  },
];

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General Inquiry",
    subject: "",
    message: "",
    contactPreference: "Email",
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.consent) {
      toast.error("Please confirm that we may use your details to respond.");
      return;
    }

    setSubmitting(true);

    const recipient = "hello@yourdomain.com"; // Replace with your real email.
    const subject = encodeURIComponent(
      `[Referly] ${form.topic}: ${form.subject}`
    );

    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone || "Not provided"}\n` +
        `Topic: ${form.topic}\n` +
        `Preferred contact: ${form.contactPreference}\n\n` +
        `Message:\n${form.message}`
    );

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Opens the user's configured email application.
    window.location.href = mailtoUrl;

    toast.info(
      "Your email app should open with your message. Send the email there to complete your inquiry."
    );

    setSubmitting(false);
  };

  return (
    <>
    <div className="min-h-screen page-container py-1">
        <PublicNav/>
     
      <main className="page-container">
        {/* Hero */}
        <section className="relative mx-auto max-w-4xl py-16 text-center sm:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-400/20 bg-slate-400/[0.07] px-4 py-2 text-xs font-semibold tracking-wide text-slate-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            YOUR VOICE MATTERS HERE
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Let's start a{" "}
            <span className="text-gradient">conversation.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Have a question, an idea, or something you'd like us to improve?
            We're building a better way to discover opportunities through
            people, and we'd love to hear from you.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Real people, real connections
            </span>
            <span className="flex items-center gap-2">
              <span className="text-slate-400">✦</span>
              Every suggestion counts
            </span>
          </div>
        </section>

        {/* Contact content */}
        <section className="mx-auto grid max-w-7xl gap-8 pb-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          {/* Left information panel */}
          <aside className="space-y-6">
            <div className="card overflow-hidden p-6 sm:p-8">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-400/20 bg-slate-500/10 text-2xl">
                💌
              </div>

              <h2 className="text-2xl font-semibold text-white">
                We'd love to hear from you.
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Whether you're a candidate looking for your next opportunity,
                an employee ready to make a referral, or a company looking
                for great talent — there's a place for you here.
              </p>

              <div className="mt-7 space-y-5">
                {contactMethods.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group flex items-start gap-4 rounded-xl border border-transparent p-3 no-underline transition hover:border-slate-400/15 hover:bg-slate-400/[0.05]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-400/15 bg-slate-500/10 text-xl">
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-100">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-300 transition group-hover:text-slate-200">
                        {item.value}
                        <span className="ml-2">↗</span>
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Brand statement */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-400/20  p-6 sm:p-8">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-slate-500/15 blur-3xl" />

              <div className="relative">
                <span className="text-3xl text-slate-300">“</span>

                <h3 className="mt-1 text-2xl font-semibold leading-snug text-white">
                  Your next big break could start with a simple conversation.
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  At Referly, we believe opportunities shouldn't just depend
                  on what you know, but also on the people willing to help
                  you grow.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#211633] bg-slate-500 text-sm font-bold text-white">
                      C
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#211633] bg-fuchsia-500 text-sm font-bold text-white">
                      E
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#211633] bg-indigo-500 text-sm font-bold text-white">
                      R
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    Candidates. Employees. Opportunities.
                  </span>
                </div>
              </div>
            </div>

            {/* Response expectations */}
            <div className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="text-xl">🔒</span>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Your information matters
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  We use the details you provide to address your inquiry.
                  Avoid including passwords or confidential information.
                </p>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div
            id="contact-form"
            className="card h-fit scroll-mt-24 p-6 sm:p-8"
          >
            <div className="mb-7">
              <span className="eyebrow">GET IN TOUCH</span>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill in the details below and tell us how we can help.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="form-label">
                    Full name <span className="text-slate-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={updateField}
                    placeholder="Your full name"
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="form-label">
                    Email address <span className="text-slate-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Phone and preferred contact */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-phone" className="form-label">
                    Phone number
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      (Optional)
                    </span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={form.phone}
                    onChange={updateField}
                    placeholder="+91 98765 43210"
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-preference"
                    className="form-label"
                  >
                    Preferred contact method
                  </label>
                  <select
                    id="contact-preference"
                    name="contactPreference"
                    value={form.contactPreference}
                    onChange={updateField}
                    className="form-input"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Either">Either is fine</option>
                  </select>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label htmlFor="contact-topic" className="form-label">
                  What can we help you with?
                  <span className="text-slate-400"> *</span>
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  required
                  value={form.topic}
                  onChange={updateField}
                  className="form-input"
                >
                  {contactTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className="form-label">
                  Subject <span className="text-slate-400">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  minLength={3}
                  maxLength={150}
                  value={form.subject}
                  onChange={updateField}
                  placeholder="A short summary of your inquiry"
                  className="form-input"
                />
              </div>

              {/* Message */}
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="contact-message" className="form-label mb-0">
                    Your message <span className="text-slate-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {form.message.length}/2000
                  </span>
                </div>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={form.message}
                  onChange={updateField}
                  placeholder="Tell us a little more about what you need..."
                  className="form-input min-h-36 resize-y"
                />
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={updateField}
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-slate-500"
                />
                <span className="text-xs leading-6 text-slate-400">
                  I agree that Referly may use the information I've provided
                  to respond to my inquiry.{" "}
                  <span className="text-slate-300">*</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full !py-3.5 text-sm sm:w-auto sm:min-w-52"
              >
                {submitting ? "Preparing message..." : "Send your message"}
                <span aria-hidden="true">↗</span>
              </button>

              <p className="text-xs leading-5 text-slate-500">
                This form opens your default email application. Your message
                is not submitted to a server from this page.
              </p>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl border-t border-white/[0.07] py-16 sm:py-20">
          <div className="text-center">
            <span className="eyebrow">QUICK ANSWERS</span>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Before you reach out
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              You might find what you're looking for right here.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-[#302640] p-5 transition hover:border-slate-500/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-200 marker:hidden">
                  {faq.question}
                  <span className="shrink-0 text-xl text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pr-6 text-sm leading-7 text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400">
              Still have a question?
            </p>
            <a
              href="mailto:hello@yourdomain.com"
              className="mt-2 inline-flex items-center gap-2 font-medium text-slate-300 hover:text-slate-200"
            >
              Email our team <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
    </div>
     <footer className="border-t border-white/[0.07]">
        <div className="page-container flex flex-col items-center justify-between gap-4 py-7 text-center sm:flex-row sm:text-left">
          <Link to="/" className="text-lg font-bold text-white no-underline">
            referly<span className="text-slate-400">.</span>
          </Link>

          <p className="text-xs text-slate-500">
            Built around people. Powered by opportunities.
          </p>

          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            Back to home ↑
          </Link>
        </div>
      </footer>
    <Footer/>
    </>
  );
}

export default Contact;
