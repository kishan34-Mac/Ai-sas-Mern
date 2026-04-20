import express from 'express';
import {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
  registerValidation,
  loginValidation,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
