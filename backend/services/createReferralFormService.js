import ReferralForm from "../models/Referral.js";
import ReferralQuestion from "../models/Application.js";
import Job from "../models/Job.js";

export const createReferralFormService = async ({
  userId,
  data,
}) => {
  const {
    title,
    description,
    location,
    workMode,
    employmentType,
    experienceMin,
    experienceMax,
    skills,
    salaryMin,
    salaryMax,
    salaryCurrency,
    applicationDeadline,
    questions = [],
  } = data;

  const slugBase = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8);

  const slug = `${slugBase}-${randomPart}`;

  const referralForm = await ReferralForm.create({
    createdBy: userId,

    title,
    description,
    location,

    workMode: workMode || "onsite",

    employmentType:
      employmentType || "full-time",

    experienceMin:
      experienceMin !== undefined &&
      experienceMin !== ""
        ? Number(experienceMin)
        : 0,

    experienceMax:
      experienceMax !== undefined &&
      experienceMax !== ""
        ? Number(experienceMax)
        : undefined,

    skills: Array.isArray(skills) ? skills : [],

    salaryMin:
      salaryMin !== undefined &&
      salaryMin !== ""
        ? Number(salaryMin)
        : undefined,

    salaryMax:
      salaryMax !== undefined &&
      salaryMax !== ""
        ? Number(salaryMax)
        : undefined,

    salaryCurrency:
      salaryCurrency || "INR",

    applicationDeadline:
      applicationDeadline || undefined,

    slug,

    status: "draft",
  });

  if (questions.length > 0) {
    const questionDocuments = questions.map(
      (question, index) => ({
        form: referralForm._id,

        question: question.question,

        type: question.type,

        options: Array.isArray(question.options)
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

    await ReferralQuestion.insertMany(
      questionDocuments
    );
  }

  return ReferralForm.findById(
    referralForm._id
  ).populate({
    path: "createdBy",
    select: "name email avatar",
  });
};