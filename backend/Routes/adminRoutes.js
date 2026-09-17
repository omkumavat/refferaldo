import express from 'express';
const router = express.Router();

import auth from '../middleware/authMiddleware'
import role from '../middleware/roleMiddleware'
import c from '../controllers/adminController'

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

router.use(auth, role('admin'));
router.get('/users', c.users);
router.get('/companies', c.companies);
router.get('/jobs', c.jobs);
router.get('/referrals', c.referrals);
router.patch('/companies/:id/verify', [param('id').isMongoId(), body('status').optional().isIn(['verified', 'rejected', 'pending'])], v, c.verifyCompany);
router.patch('/employees/:id/verify', [param('id').isMongoId(), body('status').optional().isIn(['verified', 'rejected', 'pending'])], v, c.verifyEmployee);
router.patch('/jobs/:id/status', [param('id').isMongoId(), body('status').isIn(['draft', 'active', 'paused', 'closed'])], v, c.jobStatus);
export default router;