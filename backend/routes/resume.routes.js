import express from 'express';
import {
  uploadResume,
  getAnalysis,
  getHistory,
  deleteResume,
} from '../controllers/resume.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/upload', authenticate, upload.single('resume'), uploadResume);
router.get('/analysis/:id', authenticate, getAnalysis);
router.get('/history', authenticate, getHistory);
router.delete('/:id', authenticate, deleteResume);

export default router;
