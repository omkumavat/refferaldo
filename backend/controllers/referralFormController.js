import ReferralForm from "../models/Referral.js";
import ReferralQuestion from "../Models/ReferralQuestion.js";

import {
  createReferralFormService,
} from "../services/createReferralFormService.js";

export const createReferralForm = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const form =
      await createReferralFormService({
        userId,
        data: req.body,
      });

    return res.status(201).json({
      success: true,
      message:
        "Referral form created successfully",
      data: form,
    });
  } catch (error) {
    console.error(
      "createReferralForm:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create referral form",
      error: error.message,
    });
  }
};

export const getMyReferralForms = async (
  req,
  res
) => {
  try {
    const userId = req.params.id

    const forms =
      await ReferralForm.find({
        createdBy: userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    console.error(
      "getMyReferralForms:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch referral forms",
      error: error.message,
    });
  }
};


export const getMyReferralForm = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const form =
      await ReferralForm.findOne({
        _id: id,
        createdBy: req.user._id,
      }).lean();

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Referral form not found",
      });
    }

    const questions =
      await ReferralQuestion.find({
        form: form._id,
      })
        .sort({
          order: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      data: {
        ...form,
        questions,
      },
    });
  } catch (error) {
    console.error(
      "getMyReferralForm:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch referral form",
      error: error.message,
    });
  }
};


export const updateReferralForm = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const form =
      await ReferralForm.findOne({
        _id: id,
        createdBy: req.user._id,
      });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Referral form not found",
      });
    }

    // Don't allow editing closed forms
    if (form.status === "closed") {
      return res.status(400).json({
        success: false,
        message:
          "Closed referral forms cannot be edited",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "workMode",
      "employmentType",
      "experienceMin",
      "experienceMax",
      "skills",
      "salaryMin",
      "salaryMax",
      "salaryCurrency",
      "applicationDeadline",
      "allowMultipleSubmissions",
      "showCompanyInfo",
      "thankYouMessage",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        form[field] = req.body[field];
      }
    });

    await form.save();

    // Update questions if provided
    if (Array.isArray(req.body.questions)) {
      await ReferralQuestion.deleteMany({
        form: form._id,
      });

      const questions =
        req.body.questions.map(
          (question, index) => ({
            form: form._id,
            question: question.question,
            type: question.type,
            options:
              Array.isArray(question.options)
                ? question.options
                : [],
            placeholder:
              question.placeholder || "",
            required:
              Boolean(question.required),
            order:
              question.order !== undefined
                ? question.order
                : index,
          })
        );

      if (questions.length > 0) {
        await ReferralQuestion.insertMany(
          questions
        );
      }
    }

    const updatedQuestions =
      await ReferralQuestion.find({
        form: form._id,
      }).sort({
        order: 1,
      });

    return res.status(200).json({
      success: true,
      message:
        "Referral form updated successfully",

      data: {
        ...form.toObject(),
        questions: updatedQuestions,
      },
    });
  } catch (error) {
    console.error(
      "updateReferralForm:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update referral form",
      error: error.message,
    });
  }
};

export const publishReferralForm = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const form =
      await ReferralForm.findOne({
        _id: id,
        createdBy: req.user._id,
      });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Referral form not found",
      });
    }

    if (!form.title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required",
      });
    }

    const questionCount =
      await ReferralQuestion.countDocuments({
        form: form._id,
      });

    if (questionCount === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Add at least one candidate question",
      });
    }

    form.status = "active";

    await form.save();

    return res.status(200).json({
      success: true,
      message:
        "Referral form published successfully",

      data: {
        id: form._id,
        slug: form.slug,
        status: form.status,
        publicUrl:
          `/apply/${form.slug}`,
      },
    });
  } catch (error) {
    console.error(
      "publishReferralForm:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to publish referral form",
      error: error.message,
    });
  }
};


export const updateReferralStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "draft",
      "active",
      "paused",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid referral status",
      });
    }

    const form =
      await ReferralForm.findOneAndUpdate(
        {
          _id: id,
          createdBy: req.user._id,
        },
        {
          status,
        },
        {
          new: true,
        }
      );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Referral form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Referral status updated successfully",
      data: form,
    });
  } catch (error) {
    console.error(
      "updateReferralStatus:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update referral status",
      error: error.message,
    });
  }
};

export const getPublicReferralForm = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const form =
      await ReferralForm.findOne({
        slug,
        status: "active",
      })
        .populate({
          path: "createdBy",
          select: "name avatar",
        })
        .populate({
          path: "company",
          select: "name logo",
        })
        .lean();

    if (!form) {
      return res.status(404).json({
        success: false,
        message:
          "Referral form not found or no longer active",
      });
    }

    const questions =
      await ReferralQuestion.find({
        form: form._id,
      })
        .sort({
          order: 1,
        })
        .select(
          "question type options placeholder required order"
        )
        .lean();

    // Don't expose internal analytics
    delete form.views;
    delete form.submissions;
    delete form.createdBy?.email;

    // Increment views
    await ReferralForm.updateOne(
      {
        _id: form._id,
      },
      {
        $inc: {
          views: 1,
        },
      }
    );

    return res.status(200).json({
      success: true,

      data: {
        form,
        questions,
      },
    });
  } catch (error) {
    console.error(
      "getPublicReferralForm:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load referral form",
      error: error.message,
    });
  }
};