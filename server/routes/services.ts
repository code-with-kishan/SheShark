/**
 * Services & Financial Independence Routes
 */

import { Router } from 'express';
import * as servicesController from '../controllers/services';
import { authMiddleware, requireAuth } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Service listings
router.get('/', servicesController.getServices);

// User-specific endpoints must come before dynamic :id routes
router.get('/user/bookings', servicesController.getBookings);
router.get('/user/earnings', servicesController.getEarnings);

// Available slots
router.get('/:id/available-slots', servicesController.getAvailableSlots);

router.get('/:id', servicesController.getService);
router.post('/', servicesController.createServiceListing);
router.put('/:id', servicesController.updateServiceListing);

// Bookings
router.post('/:id/book', servicesController.createBooking);

export default router;
 
