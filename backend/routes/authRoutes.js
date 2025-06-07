import express from 'express';
import { register, login } from '../controllers/authController.js';
import { authValidationRules, handleValidationErrors } from '../middleware/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// @route  POST /auth/register
// @desc   Register a new user
// @access Public
router.post(
  '/register', 
  authLimiter,
  authValidationRules.register,
  handleValidationErrors,
  register
);

// @route  POST /auth/login
// @desc   Login a user
// @access Public
router.post(
  '/login', 
  authLimiter,
  authValidationRules.login,
  handleValidationErrors,
  login
);

export default router;