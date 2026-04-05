/**
 * Financial Independence & Services Controller
 * Handles skill monetization, service listings, and bookings
 */

import { Response } from 'express';
import { db } from '../models/index';
import { AuthRequest } from '../middleware/auth';

/**
 * Create service listing
 */
export const createServiceListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only business users can create service listings' });
    }

    const { title, description, category, hourlyRate, availability = [] } = req.body;

    if (!title || !description || !category || hourlyRate === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const service = await db.createServiceListing({
      userId: req.user.id,
      title,
      description,
      category: category as 'cooking' | 'tutoring' | 'crafts' | 'consulting' | 'other',
      hourlyRate,
      availability,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service listing error:', error);
    res.status(500).json({ error: 'Failed to create service listing' });
  }
};

/**
 * Get all available services
 */
export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const { category, userId } = req.query;

    let services = await db.getServiceListings();

    if (category) {
      services = services.filter(s => s.category === category);
    }

    if (userId) {
      services = services.filter(s => s.userId === userId);
    }

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

/**
 * Get single service
 */
export const getService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const services = await db.getServiceListings();
    const service = services.find(s => s.id === id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

/**
 * Update service listing
 */
export const updateServiceListing = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const services = await db.getServiceListings();
    const service = services.find(s => s.id === id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (service.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the service
    Object.assign(service, req.body, { updatedAt: new Date() });

    res.json(service);
  } catch (error) {
    console.error('Update service listing error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

/**
 * Create booking for a service
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { serviceId, startTime, endTime } = req.body;

    if (!serviceId || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const services = await db.getServiceListings();
    const service = services.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Calculate amount
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    const amount = service.hourlyRate * hours;

    const booking = await db.createBooking({
      serviceId,
      customerId: req.user.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      amount,
      status: 'pending',
    });

    // TODO: Send notification to service provider
    console.log('📅 NEW BOOKING:', booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

/**
 * Get user's bookings
 */
export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const bookings = await db.getBookingsByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

/**
 * Get service provider's earnings
 */
export const getEarnings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only business users can view earnings' });
    }

    const services = await db.getServiceListings();
    const userId = req.user.id;
    const userServices = services.filter(s => s.userId === userId);

    let totalEarnings = 0;
    let completedBookings = 0;
    let pendingBookings = 0;

    userServices.forEach(service => {
      service.bookings.forEach(booking => {
        if (booking.status === 'completed') {
          totalEarnings += booking.amount;
          completedBookings++;
        } else if (booking.status === 'pending') {
          pendingBookings++;
        }
      });
    });

    res.json({
      totalEarnings,
      completedBookings,
      pendingBookings,
      servicesOffered: userServices.length,
      avgHourlyRate: userServices.length > 0
        ? userServices.reduce((sum, s) => sum + s.hourlyRate, 0) / userServices.length
        : 0,
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

/**
 * Get available time slots for a service
 */
export const getAvailableSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID required' });
    }

    const services = await db.getServiceListings();
    const service = services.find(s => s.id === serviceId);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Generate time slots
    const slots = [];
    const selectedDate = new Date(date as string);

    // 9 AM to 6 PM in 1-hour slots
    for (let hour = 9; hour < 18; hour++) {
      const slotStart = new Date(selectedDate);
      slotStart.setHours(hour, 0, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if slot is already booked
      const isBooked = service.bookings.some(
        booking => booking.status !== 'cancelled' &&
          booking.startTime <= slotEnd &&
          booking.endTime >= slotStart
      );

      slots.push({
        start: slotStart,
        end: slotEnd,
        isAvailable: !isBooked,
      });
    }

    res.json(slots);
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
};
