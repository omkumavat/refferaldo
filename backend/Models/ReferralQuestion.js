import mongoose from "mongoose";

const referralQuestionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralForm",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "email",
        "phone",
        "number",
        "radio",
        "checkbox",
        "select",
        "url",
        "file",
      ],
      required: true,
    },

    options: [
      {
        type: String,
        trim: true,
      },
    ],

    placeholder: {
      type: String,
      trim: true,
    },

    required: {
      type: Boolean,
      default: false,
    },

    /**
     * Used to maintain question order.
     */
    order: {
      type: Number,
      default: 0,
    },

    /**
     * Allows future conditional questions.
     */
    conditional: {
      enabled: {
        type: Boolean,
        default: false,
      },

      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      operator: {
        type: String,
        enum: ["equals", "not_equals", "contains"],
        default: "equals",
      },

      value: String,
    },
  },
  {
    timestamps: true,
  }
);

referralQuestionSchema.index({
  form: 1,
  order: 1,
});

export default mongoose.model(
  "ReferralQuestion",
  referralQuestionSchema
);