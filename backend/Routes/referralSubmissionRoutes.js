import express from "express";

import {
  getFormSubmissions,
  submitReferral,
  updateSubmissionStatus,
  getBestMatches
} from "../controllers/referralSubmissionController.js";

const router = express.Router();

router.post(
  "/:slug",
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
)

export default router;