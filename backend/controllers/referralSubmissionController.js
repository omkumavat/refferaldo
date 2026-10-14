import ReferralForm from "../models/Referral.js";
import ReferralQuestion from "../Models/ReferralQuestion.js";
import ReferralSubmission from "../Models/Application.js"

// =====================================================
// SUBMIT PUBLIC REFERRAL
// =====================================================

export const submitReferral = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const {
      name,
      email,
      phone,
      resumeUrl,
      answers = [],
    } = req.body;

    // -----------------------------------------------
    // Find active form
    // -----------------------------------------------

    const form =
      await ReferralForm.findOne({
        slug,
        status: "active",
      });

    if (!form) {
      return res.status(404).json({
        success: false,
        message:
          "Referral form not found or is no longer accepting applications",
      });
    }

    // -----------------------------------------------
    // Deadline
    // -----------------------------------------------

    if (
      form.applicationDeadline &&
      new Date() >
        new Date(form.applicationDeadline)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application deadline has passed",
      });
    }

    // -----------------------------------------------
    // Required basic information
    // -----------------------------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // -----------------------------------------------
    // Prevent duplicate submission
    // -----------------------------------------------

    if (!form.allowMultipleSubmissions) {
      const existing =
        await ReferralSubmission.findOne({
          form: form._id,
          email: email.toLowerCase().trim(),
        });

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "You have already submitted an application for this referral.",
        });
      }
    }

    // -----------------------------------------------
    // Validate questions
    // -----------------------------------------------

    const questions =
      await ReferralQuestion.find({
        form: form._id,
      }).lean();

    const answerMap = new Map();

    answers.forEach((answer) => {
      if (answer.question) {
        answerMap.set(
          answer.question.toString(),
          answer.value
        );
      }
    });

    // Check required questions
    for (const question of questions) {
      if (!question.required) continue;

      const value = answerMap.get(
        question._id.toString()
      );

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) &&
          value.length === 0);

      if (isEmpty) {
        return res.status(400).json({
          success: false,
          message: `Please answer: ${question.question}`,
        });
      }
    }

    // -----------------------------------------------
    // Save submission
    // -----------------------------------------------

    const submission =
      await ReferralSubmission.create({
        form: form._id,

        candidate:
          req.user?._id || null,

        name: name.trim(),

        email: email
          .trim()
          .toLowerCase(),

        phone:
          phone?.trim() || undefined,

        resumeUrl:
          resumeUrl?.trim() || undefined,

        answers: answers.map(
          (answer) => ({
            question: answer.question,
            value: answer.value,
          })
        ),
      });

    // -----------------------------------------------
    // Increment submission count
    // -----------------------------------------------

    await ReferralForm.updateOne(
      {
        _id: form._id,
      },
      {
        $inc: {
          submissions: 1,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message:
        form.thankYouMessage ||
        "Application submitted successfully.",

      data: {
        id: submission._id,
      },
    });
  } catch (error) {
    console.error(
      "submitReferral:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit application",
      error: error.message,
    });
  }
};