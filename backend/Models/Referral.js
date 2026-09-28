import mongoose from "mongoose";

const referralFormSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
      index: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    /**
     * Public URL identifier.
     *
     * Example:
     * /refer/apply/frontend-developer-8fj29k
     */
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    location: {
      type: String,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "onsite",
    },

    employmentType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ],
      default: "full-time",
    },

    experienceMin: {
      type: Number,
      min: 0,
      default: 0,
    },

    experienceMax: {
      type: Number,
      min: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    salaryMin: {
      type: Number,
      min: 0,
    },

    salaryMax: {
      type: Number,
      min: 0,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
    },

    applicationDeadline: Date,

    /**
     * Controls whether the public form can
     * receive submissions.
     */
    status: {
      type: String,
      enum: ["draft", "active", "paused", "closed"],
      default: "draft",
      index: true,
    },

    /**
     * Useful for analytics.
     */
    views: {
      type: Number,
      default: 0,
    },

    submissions: {
      type: Number,
      default: 0,
    },

    /**
     * Allow candidate to submit more than once?
     */
    allowMultipleSubmissions: {
      type: Boolean,
      default: false,
    },

    /**
     * Show employee/company information
     * on the public page.
     */
    showCompanyInfo: {
      type: Boolean,
      default: true,
    },

    /**
     * Optional custom thank-you message.
     */
    thankYouMessage: {
      type: String,
      default: "Thank you for your application.",
    },
  },
  {
    timestamps: true,
  }
);

referralFormSchema.index({
  createdBy: 1,
  status: 1,
});

referralFormSchema.index({
  company: 1,
  status: 1,
});

export default mongoose.model("ReferralForm", referralFormSchema);