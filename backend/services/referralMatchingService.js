import CandidateProfile from "../models/CandidateProfile.js";
import ReferralQuestion from "../Models/ReferralQuestion.js";
import ReferralMatch from "../Models/Match.js";

const normalize = (value) =>
  String(value || "").trim().toLowerCase();

const asArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

export const calculateReferralMatch = async ({
  form,
  submission,
}) => {
  const profile = submission.candidate
    ? await CandidateProfile.findOne({
        user: submission.candidate,
      }).lean()
    : null;

  const questions = await ReferralQuestion.find({
    form: form._id,
  }).lean();

  const answerByQuestion = new Map(
    submission.answers.map((answer) => [
      String(answer.question),
      answer.value,
    ])
  );

  // Adapt these field names to your actual ReferralForm
  // and CandidateProfile schemas.
  const requiredSkills = asArray(form.skills);
  const candidateSkills = asArray(profile?.skills);

  const candidateSkillSet = new Set(
    candidateSkills.map(normalize)
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkillSet.has(normalize(skill))
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkillSet.has(normalize(skill))
  );

  const skillScore = requiredSkills.length
    ? (matchedSkills.length / requiredSkills.length) * 50
    : 25;

  // Give credit for relevant answers to custom questions.
  // This is a basic relevance heuristic, not an AI semantic evaluation.
  let answeredWeight = 0;
  let totalWeight = 0;
  const matchedCriteria = [];

  for (const question of questions) {
    if (!question.required) continue;

    totalWeight += 1;

    const value = answerByQuestion.get(
      String(question._id)
    );

    const isAnswered =
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0);

    if (isAnswered) {
      answeredWeight += 1;
      matchedCriteria.push(
        `Answered: ${question.question}`
      );
    }
  }

  const answerScore = totalWeight
    ? (answeredWeight / totalWeight) * 25
    : 25;

  // Experience comparison, if both fields are available.
  let experienceScore = 0;
  const requiredExperience = Number(form.experienceMin || 0);
  const candidateExperience = Number(
    profile?.experienceYears ?? -1
  );

  if (candidateExperience >= 0) {
    experienceScore =
      candidateExperience >= requiredExperience ? 15 : 5;
  }

  // Small bonus for having a usable profile.
  const profileScore = profile ? 10 : 0;

  const score = Math.min(
    100,
    Math.round(
      skillScore + answerScore + experienceScore + profileScore
    )
  );

  const result = await ReferralMatch.findOneAndUpdate(
    { submission: submission._id },
    {
      $set: {
        form: form._id,
        submission: submission._id,
        candidate: submission.candidate || null,
        score,
        matchedSkills,
        missingSkills,
        matchedCriteria,
        explanation:
          `${matchedSkills.length} of ${requiredSkills.length} required skills matched. ` +
          `${answeredWeight} of ${totalWeight} required questions answered.`,
        generatedAt: new Date(),
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  return result;
};