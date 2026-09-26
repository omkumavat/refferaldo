import express from 'express';
const router = express.Router();

import {register,login,forgotPassword,resetPassword, verifyEmail,logout,me} from '../controllers/authController.js';
import {body} from 'express-validator';
import v from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/register', [body('name').trim().notEmpty(), body('email').isEmail().normalizeEmail(), body('password').isLength({
    min: 1
}), body('role').optional().isIn(['candidate', 'employee'])], v, register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], v, authLimiter, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);
router.post('/verify-email', [body('token').isString().notEmpty()], v, verifyEmail);
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], v, authLimiter, forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({
    min: 8
})], v, resetPassword);
export default router;