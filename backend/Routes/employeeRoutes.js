import express from 'express';
const router = express.Router();

import {authMiddleware} from '../middleware/authMiddleware.js';
import {requireRole} from '../middleware/roleMiddleware.js';
import verify from '../middleware/employeeVerificationMiddleware.js';
import {getEmployee} from '../controllers/employeeController.js';

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

// router.use(authMiddleware, requireRole("employee"), verify);
// router.get('/dashboard', c.dashboard);
router.get('/profile/:id', authMiddleware, requireRole("employee"), getEmployee)
// router.get('/jobs', c.jobs);
// router.get('/referral-requests', c.requests);
// router.get('/referral-requests/:id', [param('id').isMongoId()], v, c.request);
// router.post('/referral-requests/:id/accept', [param('id').isMongoId()], v, c.accept);
// router.post('/referral-requests/:id/reject', [param('id').isMongoId()], v, c.reject);
// router.post('/referrals', [body('referralRequestId').isMongoId()], v, c.createReferral);
// router.get('/referrals', c.referrals);
// router.get('/rewards', c.rewards);
export default router;