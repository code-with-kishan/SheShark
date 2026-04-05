/**
 * Safety & Security Routes
 */

import { Router } from 'express';
import * as safetyController from '../controllers/safety';
import { authMiddleware, requireAuth } from '../middleware/auth';

const router = Router();

// Panic alerts
router.post('/panic', authMiddleware, requireAuth, safetyController.createPanicAlert);
router.get('/panic', authMiddleware, requireAuth, safetyController.getPanicAlerts);
router.put('/panic/:id', authMiddleware, requireAuth, safetyController.cancelPanicAlert);

// Safety reports
router.post('/report', authMiddleware, requireAuth, safetyController.reportSafetyIssue);
router.post('/report/public', authMiddleware, safetyController.reportSafetyIssuePublic);
router.get('/report', authMiddleware, requireAuth, safetyController.getSafetyReports);
router.get('/report/admin', authMiddleware, requireAuth, safetyController.getAllSafetyReportsForAdmin);

// Route safety ratings
router.post('/route-safety', authMiddleware, requireAuth, safetyController.rateRouteSafety);
router.get('/route-safety', authMiddleware, safetyController.getRouteSafetyRatings);
router.get('/route-safety/suggest', authMiddleware, safetyController.suggestSaferRoute);

// Emergency services
router.get('/police-stations', authMiddleware, safetyController.findNearestPoliceStation);

// Emergency contacts
router.get('/emergency-contacts', authMiddleware, requireAuth, safetyController.getEmergencyContacts);
router.put('/emergency-contacts', authMiddleware, requireAuth, safetyController.updateEmergencyContacts);

export default router;
