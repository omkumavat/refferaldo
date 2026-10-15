import ReferralForm from "../models/Referral.js";
import ReferralQuestion from "../Models/ReferralQuestion.js";
import ReferralSubmission from "../Models/Application.js"
import ReferralMatch from "../Models/Match.js";
import mongoose from "mongoose";
import {
  calculateReferralMatch,
} from "../services/referralMatchingService.js";


export const submitReferral = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const {
      userId,
      name,
      email,
      phone,
      resumeUrl,
      answers = [],
    } = req.body;
    console.log(answers);


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

    const questions =
      await ReferralQuestion.find({
        form: form._id,
      }).lean();

    const answerMap = new Map();

    answers.forEach((answer) => {
      if (answer.question) {
        answerMap.set(
          String(answer.questionId),
          answer.answer
        );
      }
    });

    // Check required questions
    for (const question of questions) {
      console.log(question);

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

    const submission =
      await ReferralSubmission.create({
        form: form._id,

        candidate:
          userId || null,

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
            question: answer.questionId,
            value: answer.answer,
          })
        ),
      });

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

    await calculateReferralMatch({
      form,
      submission,
    });

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

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    const allowed = [
      "new",
      "reviewing",
      "shortlisted",
      "rejected",
      "referred",
      "hired",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission status",
      });
    }

    const submission = await ReferralSubmission.findByIdAndUpdate(
      submissionId,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    return res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const getFormSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const {
      status,
      search,
      minScore,
      maxScore,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { form: formId };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search?.trim()) {
      const regex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { name: regex },
        { email: regex },
      ];
    }

    const matchFilter = {};

    if (minScore !== undefined || maxScore !== undefined) {
      matchFilter.score = {};

      if (minScore !== undefined) {
        matchFilter.score.$gte = Number(minScore);
      }

      if (maxScore !== undefined) {
        matchFilter.score.$lte = Number(maxScore);
      }
    }

    const matches = await ReferralMatch.find(matchFilter)
      .select("submission score");

    if (Object.keys(matchFilter).length) {
      const ids = matches.map((item) => item.submission);
      filter._id = { $in: ids };
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : sort === "highest"
          ? { createdAt: -1 }
          : { createdAt: -1 };

    const [submissions, total] = await Promise.all([
      ReferralSubmission.find(filter)
        .populate("candidate", "name email avatar")
        .populate("form", "title")
        .sort(sortOption)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      ReferralSubmission.countDocuments(filter),
    ]);

    const submissionIds = submissions.map((item) => item._id);

    const matchDocs = await ReferralMatch.find({
      submission: { $in: submissionIds },
    })
      .select("submission score matchedSkills missingSkills explanation")
      .lean();

    const matchMap = new Map(
      matchDocs.map((item) => [
        String(item.submission),
        item,
      ])
    );

    return res.json({
      success: true,
      data: submissions.map((item) => ({
        ...item,
        match: matchMap.get(String(item._id)) || null,
      })),
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("getFormSubmissions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
};

export const getBestMatches = async (req, res) => {
  try {
    const { formId } = req.params;

    const matches = await ReferralMatch.find({ form: formId })
      .sort({ score: -1, generatedAt: -1 })
      .populate({
        path: "submission",
        select: "name email status createdAt candidate resumeUrl",
        populate: {
          path: "candidate",
          select: "name email avatar",
        },
      })
      .lean();

    return res.json({
      success: true,
      data: matches.filter((item) => item.submission),
    });
  } catch (error) {
    console.error("getBestMatches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch best matches",
    });
  }
};