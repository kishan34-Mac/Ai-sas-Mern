import express from 'express';
import {
  getJobMatches,
  getAllJobs,
  getJobById,
} from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/match/:resumeId', authenticate, getJobMatches);
router.get('/', authenticate, getAllJobs);
router.get('/:id', authenticate, getJobById);

export default router;
