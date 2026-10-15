import mongoose from "mongoose";

const referralMatchSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralForm",
      required: true,
      index: true,
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralSubmission",
      required: true,
      unique: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      default: null,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: [String],
    missingSkills: [String],
    matchedCriteria: [String],
    explanation: String,
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

referralMatchSchema.index({ form: 1, score: -1 });

export default mongoose.models.ReferralMatch ||
  mongoose.model("ReferralMatch", referralMatchSchema);