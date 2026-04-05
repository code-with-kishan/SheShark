/**
 * Health & Wellness Routes
 */

import { Router } from 'express';
import * as healthController from '../controllers/health';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Health modules (educational content)
router.get('/modules', healthController.getHealthModules);
router.get('/modules/:id', healthController.getHealthModule);

// Mood tracking
router.post('/mood', healthController.recordMood);
router.get('/mood-history', healthController.getMoodHistory);

// Mental health support
router.get('/mental-health-resources', healthController.getMentalHealthResources);
router.post('/mental-health-support', healthController.getMentalHealthSupport);

// Chat history persistence
router.get('/chat-history', healthController.getChatHistory);
router.post('/chat-history', healthController.saveChatHistory);
router.delete('/chat-history', healthController.clearChatHistory);

export default router;
