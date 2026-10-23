import express from "express";

import {
  getFormSubmissions,
  submitReferral,
  updateSubmissionStatus,
  getBestMatches,
   getMostReferredCandidates,
  getAvailableReferralForms,
  referCandidateToForm,
} from "../controllers/referralSubmissionController.js";
import {uploadReferralFiles} from '../middleware/referralFiles.js';

const router = express.Router();

router.post(
  "/:slug",
  uploadReferralFiles,
  submitReferral
);

router.get(
  "/:formId/submissions",
  getFormSubmissions
)

router.patch(
  "/:submissionId/status",
  updateSubmissionStatus
)

router.get(
  "/:formId/best-matches",
  getBestMatches
)

router.post(
  "/:submissionId/refer",
  updateSubmissionStatus,
)

router.get(
  "/candidates/most-referred",
  getMostReferredCandidates
);

router.get(
  "/referral-forms/available/:userId/:candidateId",
  getAvailableReferralForms
);

router.post(
  "/referral-forms/:formId/refer/:candidateId",
  referCandidateToForm
);

export default router;