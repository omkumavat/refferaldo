import express from 'express';
const router = express.Router();

import auth from '../middleware/authMiddleware';
import role from '../middleware/roleMiddleware';
import verify from '../middleware/employeeVerificationMiddleware';
import c from '../controllers/companyReferralController';

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

const companyContext = (req, res, next) => req.user.role === 'employee' ? verify(req, res, next) : next();
router.use(auth, role('company', 'employee', 'admin'));
router.get('/referrals', companyContext, c.list);
router.get('/referrals/analytics', companyContext, c.analytics);
router.get('/referrals/:id', companyContext, param('id').isMongoId(), v, c.get);
router.patch('/referrals/:id/status', companyContext, [param('id').isMongoId(), body('status').isIn(['submitted', 'under-review', 'interview', 'offer', 'hired', 'rejected'])], v, c.status);
export default router;