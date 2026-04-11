/**
 * Authentication Routes
 */

import { Router } from 'express';
import * as authController from '../controllers/auth';
import { authMiddleware, requireAuth } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Demo login (for rapid testing)
router.post('/demo-login', authController.demoLogin);

export default router;
 
