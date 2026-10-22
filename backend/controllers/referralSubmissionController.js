import ReferralForm from "../models/Referral.js";
import ReferralQuestion from "../Models/ReferralQuestion.js";
import ReferralSubmission from "../Models/Application.js"
import ReferralMatch from "../Models/Match.js";
import CandidateProfile from "../models/CandidateProfile.js";
import User from "../models/User.js";
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

    const candidate = await User.findOne({
      _id: userId,
      role: "candidate",
      isActive: { $ne: false },
    }).select("name email phone");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found or inactive",
      });
    }

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

const getEmployeeCompanyId = async (userId) => {
  const employee = await Employee.findOne({ user: userId })
    .select("company")
    .lean();

  return employee?.company?._id || employee?.company || null;
};

// GET /api/employee/candidates/most-referred
export const getMostReferredCandidates = async (req, res) => {
  try {
    const ranked = await ReferralSubmission.aggregate([
      {
        $match: {
          status: "referred",
          candidate: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$candidate",
          referralCount: { $sum: 1 },
        },
      },
      { $sort: { referralCount: -1, _id: 1 } },
      { $limit: 20 },
    ]);

    if (!ranked.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // if(ranked.length === 0){
    //    const 
    // }

    const ids = ranked.map((item) => item._id);

    const [users, profiles] = await Promise.all([
      User.find({
        _id: { $in: ids },
        role: "candidate",
      })
        .select("name email phone location photo")
        .lean(),

      CandidateProfile.find({ user: { $in: ids } }).lean(),
    ]);

    const userMap = new Map(
      users.map((user) => [String(user._id), user])
    );

    const profileMap = new Map(
      profiles.map((profile) => [String(profile.user), profile])
    );

    // Preserve referral ranking after retrieving user/profile records.
    const data = ranked
      .map(({ _id, referralCount }) => {
        const user = userMap.get(String(_id));
        if (!user) return null;

        const profile = profileMap.get(String(_id)) || {};

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          location: user.location || "",
          photo: user.photo || "",
          headline: profile.headline || "",
          experience: `${profile.experienceYears ?? 0} years`,
          skills: profile.skills || [],
          match: 0,
          referralCount,
          verificationStatus: profile.verificationStatus || "pending",
          verifications: {
            email: Boolean(user.isEmailVerified),
          },
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getMostReferredCandidates:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates.",
    });
  }
};

// GET /api/employee/referral-forms/available
export const getAvailableReferralForms = async (req, res) => {
  try {
    // const companyId = await getEmployeeCompanyId(req.params.id);

    // if (!companyId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your employee account is not linked to a company.",
    //   });
    // }

    const forms = await ReferralForm.find({
      createdBy: req.params.userId,
      status: "active",
      $or: [
        { deadline: null },
        { deadline: { $exists: false } },
        { deadline: { $gte: new Date() } },
      ],
    })
      .select(
        "title description job location workMode employmentType experience skills deadline submissions"
      )
      .sort({ createdAt: -1 })
      .lean();

    const submissions = await ReferralSubmission.find({
      form: { $in: forms.map((f) => f._id) },
      candidate: req.params.candidateId,
      status: "referred",
    }).lean();

    const submissionMap = submissions.map((sub) => ({
      formId: sub.form.toString(),
      referred: true
    }));

    return res.status(200).json({
      success: true,
      data: {
        forms,
        submissions: submissionMap,
      }
    });
  } catch (error) {
    console.error("getAvailableReferralForms:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral forms.",
    });
  }
};

export const referCandidateToForm = async (req, res) => {
  try {
    const { formId, candidateId } = req.params;

    if (
      !mongoose.isValidObjectId(formId) ||
      !mongoose.isValidObjectId(candidateId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid form or candidate ID.",
      });
    }

    // const companyId = await getEmployeeCompanyId(candidateId);

    // if (!companyId) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your employee account is not linked to a company.",
    //   });
    // }

    const [form, candidate] = await Promise.all([
      ReferralForm.findOne({
        _id: formId,
        // company: companyId,
        status: "active",
      }),
      User.findOne({
        _id: candidateId,
        role: "candidate",
        isActive: { $ne: false },
      }).select("name email phone"),
    ]);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Active referral form not found for your company.",
      });
    }

    if (form.deadline && new Date(form.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "The referral form deadline has passed.",
      });
    }

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    const duplicate = await ReferralSubmission.exists({
      form: formId,
      candidate: candidateId,
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This candidate has already been submitted to this form.",
      });
    }

    const submission = await ReferralSubmission.create({
      form: form._id,
      candidate: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      answers: [],
      status: "referred",
    });

    await ReferralForm.updateOne(
      { _id: form._id },
      { $inc: { submissions: 1 } }
    );

    return res.status(201).json({
      success: true,
      message: "Candidate referred successfully.",
      data: {
        submissionId: submission._id,
        candidateId: candidate._id,
        formId: form._id,
        status: submission.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This candidate has already been submitted to this form.",
      });
    }

    console.error("referCandidateToForm:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to refer candidate.",
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