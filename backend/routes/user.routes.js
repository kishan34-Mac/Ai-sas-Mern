import express from 'express';
import { updateProfile, getStats } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.get('/stats', authenticate, getStats);

export default router;
