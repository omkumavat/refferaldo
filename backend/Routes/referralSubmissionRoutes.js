import express from "express";

import {
  submitReferral,
} from "../controllers/referralSubmissionController.js";

const router = express.Router();

router.post(
  "/:slug",
  submitReferral
);

export default router;