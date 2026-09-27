import express from 'express';
const router = express.Router();

import {authMiddleware} from '../middleware/authMiddleware.js';
import {getProfile} from '../controllers/userController.js';

router.use(authMiddleware);
router.get('/profile/:id', getProfile);
// router.put('/profile', c.updateProfile);
// router.get('/', require('../middleware/roleMiddleware')('admin'), c.listUsers);
// router.delete('/account', c.deleteAccount);
export default router;