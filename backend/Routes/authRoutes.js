import express from 'express';
const router = express.Router();

import c from '../controllers/authController.js';
import {body} from 'express-validator';
import v from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware';

router.post('/register', [body('name').trim().notEmpty(), body('email').isEmail().normalizeEmail(), body('password').isLength({
    min: 8
}), body('role').optional().isIn(['candidate', 'employee', 'company'])], v, c.register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], v, authLimiter, c.login);
router.post('/logout', c.logout);
router.get('/me', require('../middleware/authMiddleware'), c.me);
router.post('/verify-email', [body('token').isString().notEmpty()], v, c.verifyEmail);
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], v, authLimiter, c.forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({
    min: 8
})], v, c.resetPassword);
export default router;