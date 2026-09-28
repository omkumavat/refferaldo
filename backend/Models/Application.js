import mongoose from "mongoose";

const referralSubmissionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralForm",
      required: true,
      index: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ReferralQuestion",
          required: true,
        },

        value: mongoose.Schema.Types.Mixed,
      },
    ],

    status: {
      type: String,
      enum: [
        "new",
        "reviewing",
        "shortlisted",
        "rejected",
        "referred",
        "hired",
      ],
      default: "new",
      index: true,
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

referralSubmissionSchema.index({
  form: 1,
  createdAt: -1,
});

referralSubmissionSchema.index({
  email: 1,
});

export default mongoose.model(
  "ReferralSubmission",
  referralSubmissionSchema
);