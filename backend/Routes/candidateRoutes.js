import express from 'express';
const router = express.Router();

import {authMiddleware} from '../middleware/authMiddleware.js';
import {requireRole} from '../middleware/roleMiddleware.js';
import {uploadResume} from '../middleware/uploadMiddleware.js';
import uploadImage from "../middleware/uploadImage.js"
import {getProfile, updateProfile, resume, addCandidateProfile, parseResume, getMyReferralSubmissions, uploadProfilePhoto} from '../controllers/candidateController.js';
// import m from '../controllers/matchController.js';

import {body,param} from 'express-validator';
import v from '../middleware/validationMiddleware.js';

// router.get('/', authMiddleware, role('company', 'admin'), c.list);
router.get('/profile/private/:id', authMiddleware, requireRole('candidate'), getProfile);
router.get('/profile/public/:id', getProfile);
router.put('/profile/update', authMiddleware, requireRole('candidate'), [body('experienceYears').optional().isFloat({
    min: 0,
    max: 60
}), body('profileCompletion').optional().isInt({
    min: 0,
    max: 100
}), body('currentCompany').optional().isMongoId()], v, updateProfile);
router.post('/profile/resume/:id', authMiddleware, requireRole('candidate'), uploadResume.single('resume'), resume);
router.post('/profile/add/:userId/:section', authMiddleware, requireRole("candidate"), addCandidateProfile)
router.post('/profile/resume/parse/:id', authMiddleware, requireRole('candidate'), uploadResume.single('resume'), parseResume)
router.get('/referrals/submissions/:userId', authMiddleware, requireRole('candidate'), getMyReferralSubmissions);
router.patch('/upload/profile-photo/:userId', authMiddleware, requireRole('candidate'), uploadImage.single('photo'), uploadProfilePhoto)
// router.get('/referrals', auth, role('candidate'), c.referrals);
// router.post('/jobs/:jobId/apply', auth, role('candidate'), param('jobId').isMongoId(), v, c.apply);
// router.post('/jobs/:jobId/referral-request', auth, role('candidate'), [param('jobId').isMongoId(), body('employeeId').isMongoId(), body('message').optional().isLength({
//     max: 2000
// })], v, c.referralRequest);
// router.get('/recommended-jobs', auth, role('candidate'), c.recommended);
// router.get('/jobs/:jobId/match', auth, role('candidate'), param('jobId').isMongoId(), v, m.calculate);

router.get("/resume/download", authMiddleware, async (req, res) => {
  try {
    const filePath = `http://localhost:4000/public/resumes/${req.params.userId}`; 
    const username = req.user.name || "candidate"; 

    return res.download(filePath, `${username}-resume.pdf`)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to download resume",
    });
  }
});
export default router;