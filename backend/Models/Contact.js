
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    topic: {
      type: String,
      required: true,
      enum: [
        "General Inquiry",
        "Job Referral Support",
        "Account & Profile",
        "Company Partnership",
        "Report a Problem",
        "Feedback & Suggestions",
        "Other",
      ],
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    message: {
      type: String,
    //   required: true,
      trim: true,
    //   minlength: 10,
    //   maxlength: 2000,
    },

    contactPreference: {
      type: String,
      enum: ["Email", "Phone", "Either"],
      default: "Email",
    },

    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "Consent is required",
      },
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ createdAt: -1 });

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
