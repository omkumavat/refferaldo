// Mock candidates (used in Employee Candidate Discovery + Company Candidate Pool)
export const candidates = [
  {
    id: "c1",
    name: "Rahul Sharma",
    headline: "Senior Software Engineer · Payments",
    location: "Bangalore, India",
    experience: "5 years",
    targetRole: "Senior SWE — Backend",
    match: 94,
    photo:
      "https://images.unsplash.com/photo-1782323709687-43675cbddd46?crop=entropy&cs=srgb&fm=jpg&w=400&q=80",
    skills: ["Go", "PostgreSQL", "Distributed Systems", "Kafka", "gRPC"],
    resumeUrl: "#",
    verifications: { email: true, phone: true, resume: true, profile: 92 },
    summary:
      "Backend engineer with 5 years shipping high-throughput services at fintech companies. Owned Razorpay's payout ledger from 200 TPS to 8k TPS.",
    experienceItems: [
      {
        company: "Razorpay",
        role: "Senior Software Engineer",
        period: "2022 — Present",
        detail:
          "Lead engineer for Payouts ledger. Owned migration to event-sourced architecture.",
      },
      {
        company: "Freshworks",
        role: "Software Engineer",
        period: "2020 — 2022",
        detail: "Built billing service handling 20M invoices/month.",
      },
    ],
    education: [
      { school: "IIIT Hyderabad", degree: "B.Tech, Computer Science", year: "2020" },
    ],
    projects: [
      { name: "OpenLedger", detail: "Open-source double-entry ledger in Go. 1.4k GitHub stars." },
    ],
  },
  {
    id: "c2",
    name: "Priya Venkatesh",
    headline: "Staff Product Designer",
    location: "Remote · India",
    experience: "8 years",
    targetRole: "Staff / Principal Designer",
    match: 91,
    photo:
      "https://images.pexels.com/photos/7580837/pexels-photo-7580837.jpeg?auto=compress&cs=tinysrgb&w=400",
    skills: ["Product Design", "Design Systems", "Prototyping", "User Research"],
    resumeUrl: "#",
    verifications: { email: true, phone: true, resume: true, profile: 96 },
    summary:
      "Product designer focused on complex enterprise SaaS. Led design system for a 200+ product company.",
    experienceItems: [
      { company: "Freshworks", role: "Principal Designer", period: "2021 — Present", detail: "Owns design system + platform surfaces." },
      { company: "Zoho", role: "Senior Designer", period: "2018 — 2021", detail: "Designed 6 apps in Zoho One." },
    ],
    education: [{ school: "NID Ahmedabad", degree: "M.Des Interaction Design", year: "2016" }],
    projects: [{ name: "OpenDS", detail: "Public design tokens library for SaaS teams." }],
  },
  {
    id: "c3",
    name: "Marcus Chen",
    headline: "Lead DevOps Architect",
    location: "Singapore",
    experience: "10 years",
    targetRole: "Principal SRE / Platform Lead",
    match: 88,
    photo:
      "https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=srgb&fm=jpg&w=400&q=80",
    skills: ["Kubernetes", "Terraform", "AWS", "Go", "Observability"],
    resumeUrl: "#",
    verifications: { email: true, phone: true, resume: true, profile: 88 },
    summary:
      "Platform engineer with a decade of experience running large fleets on Kubernetes.",
    experienceItems: [
      { company: "Grab", role: "Lead SRE", period: "2020 — Present", detail: "Platform team of 12." },
      { company: "Shopee", role: "Senior SRE", period: "2016 — 2020", detail: "Owned edge & CDN." },
    ],
    education: [{ school: "NUS Singapore", degree: "B.Eng Computer Engineering", year: "2014" }],
    projects: [{ name: "kubectl-drift", detail: "Detects drift between manifests and cluster state." }],
  },
  {
    id: "c4",
    name: "Elena Rostova",
    headline: "Senior Frontend Engineer",
    location: "Berlin, Germany",
    experience: "6 years",
    targetRole: "Staff Frontend Engineer",
    match: 90,
    photo:
      "https://images.unsplash.com/photo-1701096374092-bb70915fdc5c?crop=entropy&cs=srgb&fm=jpg&w=400&q=80",
    skills: ["React", "TypeScript", "Next.js", "Design Systems", "Motion"],
    resumeUrl: "#",
    verifications: { email: true, phone: false, resume: true, profile: 84 },
    summary:
      "Frontend specialist with a passion for craft and performance. Built design systems consumed by 40+ teams.",
    experienceItems: [
      { company: "N26", role: "Senior Frontend Engineer", period: "2021 — Present", detail: "Led migration to Next.js App Router." },
      { company: "Zalando", role: "Frontend Engineer", period: "2018 — 2021", detail: "Owned checkout UI." },
    ],
    education: [{ school: "TU Berlin", degree: "M.Sc Computer Science", year: "2018" }],
    projects: [{ name: "motion-lab", detail: "Interactive motion learning site." }],
  },
  {
    id: "c5",
    name: "Aarav Sharma",
    headline: "Fullstack Engineer",
    location: "Pune, India",
    experience: "4 years",
    targetRole: "Senior Fullstack",
    match: 87,
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&w=400&q=80",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    resumeUrl: "#",
    verifications: { email: true, phone: true, resume: true, profile: 78 },
    summary: "Product-minded fullstack engineer. Shipped 3 zero-to-one products at seed-stage startups.",
    experienceItems: [
      { company: "Groww", role: "SDE II", period: "2022 — Present", detail: "Owned mutual funds surface." },
      { company: "Airmeet", role: "SDE I", period: "2020 — 2022", detail: "Built event backend." },
    ],
    education: [{ school: "COEP Pune", degree: "B.Tech IT", year: "2020" }],
    projects: [{ name: "trades.dev", detail: "Realtime paper trading playground." }],
  },
  {
    id: "c6",
    name: "Sofía Alvarez",
    headline: "Product Manager",
    location: "Madrid, Spain",
    experience: "6 years",
    targetRole: "Senior / Group PM",
    match: 79,
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&w=400&q=80",
    skills: ["Product Strategy", "Growth", "Analytics", "SQL"],
    resumeUrl: "#",
    verifications: { email: true, phone: true, resume: true, profile: 90 },
    summary: "PM with experience in growth and marketplace products.",
    experienceItems: [
      { company: "Cabify", role: "Senior PM", period: "2020 — Present", detail: "Led rider growth pod." },
    ],
    education: [{ school: "IE Business School", degree: "MBA", year: "2019" }],
    projects: [{ name: "growth-playbook", detail: "Newsletter with 8k subscribers." }],
  },
];

export const getCandidateById = (id) => candidates.find((c) => c.id === id);
