import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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

    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    preferredQualifications: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

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
    },

    experienceMax: {
      type: Number,
      min: 0,
    },

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

    referralReward: {
      type: Number,
      default: 0,
      min: 0,
    },

    applicationDeadline: Date,

    status: {
      type: String,
      enum: ["draft", "active", "paused", "closed"],
      default: "draft",
      index: true,
    },

    source: {
      type: String,
      enum: ["company", "imported", "employee"],
      default: "company",
    },

    /**
     * If this job came directly from a company
     * career portal.
     */
    externalJobUrl: {
      type: String,
      trim: true,
    },

    externalSource: {
      type: String,
      enum: [
        "greenhouse",
        "workday",
        "lever",
        "company",
        "other",
        null,
      ],
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({
  company: 1,
  status: 1,
});

jobSchema.index({
  skills: 1,
});

jobSchema.index({
  location: 1,
});

jobSchema.index({
  createdAt: -1,
});

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
  location: "text",
});

export default mongoose.model("Job", jobSchema);