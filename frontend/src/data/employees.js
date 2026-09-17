export const employees = [
  { id: "e1", name: "Priya Mehta", role: "Senior SWE", companyId: "stripe", email: "priya@stripe.com", verified: true, referrals: 7, hires: 2 },
  { id: "e2", name: "Rohit Iyer", role: "Engineering Manager", companyId: "vercel", email: "rohit@vercel.com", verified: true, referrals: 4, hires: 1 },
  { id: "e3", name: "Ana Costa", role: "Product Designer", companyId: "figma", email: "ana@figma.com", verified: true, referrals: 3, hires: 1 },
  { id: "e4", name: "Karan Malhotra", role: "SRE Lead", companyId: "datadog", email: "karan@datadoghq.com", verified: false, referrals: 0, hires: 0 },
  { id: "e5", name: "Nisha Patel", role: "PM", companyId: "razorpay", email: "nisha@razorpay.com", verified: true, referrals: 6, hires: 2 },
];

export const getEmployeeById = (id) => employees.find((e) => e.id === id);
