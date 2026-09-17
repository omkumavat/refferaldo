import express from 'express';
const router = express.Router();

import auth from '../middleware/authMiddleware';
import role from '../middleware/roleMiddleware';
import upload from '../middleware/uploadMiddleware';
import c from '../controllers/candidateController';
import m from '../controllers/matchController';

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

router.get('/', auth, role('company', 'admin'), c.list);
router.put('/profile', auth, role('candidate'), [body('experienceYears').optional().isFloat({
    min: 0,
    max: 60
}), body('profileCompletion').optional().isInt({
    min: 0,
    max: 100
}), body('currentCompany').optional().isMongoId()], v, c.profile);
router.post('/resume', auth, role('candidate'), upload.single('resume'), c.resume);
router.get('/applications', auth, role('candidate'), c.applications);
router.get('/referrals', auth, role('candidate'), c.referrals);
router.post('/jobs/:jobId/apply', auth, role('candidate'), param('jobId').isMongoId(), v, c.apply);
router.post('/jobs/:jobId/referral-request', auth, role('candidate'), [param('jobId').isMongoId(), body('employeeId').isMongoId(), body('message').optional().isLength({
    max: 2000
})], v, c.referralRequest);
router.get('/recommended-jobs', auth, role('candidate'), c.recommended);
router.get('/jobs/:jobId/match', auth, role('candidate'), param('jobId').isMongoId(), v, m.calculate);
export default router;