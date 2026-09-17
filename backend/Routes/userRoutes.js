import express from 'express';
const router = express.Router();

import auth from '../middleware/authMiddleware.js';
import c from '../controllers/userController.js';

router.use(auth);
router.get('/profile', c.getProfile);
router.put('/profile', c.updateProfile);
router.get('/', require('../middleware/roleMiddleware')('admin'), c.listUsers);
router.delete('/account', c.deleteAccount);
export default router;