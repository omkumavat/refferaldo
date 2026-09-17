import express from 'express';
const router = express.Router();

import auth from '../middleware/authMiddleware.js';
import c from '../controllers/notificationController.js';
router.use(auth);
router.get('/', c.list);
router.patch('/:id/read', c.read);
router.patch('/read-all', c.readAll);
export default router;