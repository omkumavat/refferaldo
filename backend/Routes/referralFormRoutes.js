import express from "express";

import {
    createReferralForm,
    getMyReferralForms,
    getMyReferralForm,
    updateReferralForm,
    publishReferralForm,
    updateReferralStatus,
    getPublicReferralForm,
    getCandidateReferralForms,
    getFormsPublic
} from "../controllers/referralFormController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createReferralForm
);

router.get(
    "/my/:id",
    // authMiddleware,
    getMyReferralForms
);

router.get(
  "/candidate/forms/available/:userId",
  authMiddleware,
  requireRole("candidate"),
  getCandidateReferralForms
);

router.get(
  "/forms/public",
  getFormsPublic
);

router.get(
    "/:id",
    authMiddleware,
    getMyReferralForm
);

router.put(
    "/:id",
    authMiddleware,
    updateReferralForm
);

router.patch(
    "/:id/publish",
    authMiddleware,
    publishReferralForm
);

router.patch(
    "/:id/status",
    authMiddleware,
    updateReferralStatus
);

router.get(
    "/public/:slug",
    getPublicReferralForm
);

export default router;