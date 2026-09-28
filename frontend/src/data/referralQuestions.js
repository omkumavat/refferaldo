export const suggestedQuestions = [
  {
    id: "experience",
    label: "Years of experience",
    question: "How many years of relevant experience do you have?",
    type: "radio",
    required: true,
    options: [
      "Fresher",
      "0–1 years",
      "1–3 years",
      "3–5 years",
      "5+ years",
    ],
  },

  {
    id: "notice",
    label: "Notice period",
    question: "What is your current notice period?",
    type: "radio",
    required: true,
    options: [
      "Immediate",
      "15 days",
      "30 days",
      "60 days",
      "90+ days",
    ],
  },

  {
    id: "relocation",
    label: "Relocation",
    question: "Are you willing to relocate if required?",
    type: "radio",
    required: false,
    options: [
      "Yes",
      "No",
      "Maybe",
    ],
  },

  {
    id: "linkedin",
    label: "LinkedIn profile",
    question: "Please share your LinkedIn profile.",
    type: "url",
    required: false,
    placeholder: "https://linkedin.com/in/...",
  },

  {
    id: "github",
    label: "GitHub profile",
    question: "Please share your GitHub profile.",
    type: "url",
    required: false,
    placeholder: "https://github.com/...",
  },

  {
    id: "current-location",
    label: "Current location",
    question: "Where are you currently located?",
    type: "text",
    required: true,
    placeholder: "e.g. Pune, Maharashtra",
  },

  {
    id: "current-ctc",
    label: "Current CTC",
    question: "What is your current CTC?",
    type: "number",
    required: false,
    placeholder: "e.g. 800000",
  },

  {
    id: "expected-ctc",
    label: "Expected CTC",
    question: "What is your expected CTC?",
    type: "number",
    required: false,
    placeholder: "e.g. 1200000",
  },

  {
    id: "work-authorization",
    label: "Work authorization",
    question: "Are you legally authorized to work in this location?",
    type: "radio",
    required: true,
    options: ["Yes", "No"],
  },
];