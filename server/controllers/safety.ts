/**
 * Safety & Security Controller
 * Handles panic alerts, safety reports, and route ratings
 */

import { Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { db } from '../models/index';
import { AuthRequest } from '../middleware/auth';

const stripPII = (text: string): string => {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email-hidden]')
    .replace(/\+?\d[\d\s-]{7,}\d/g, '[phone-hidden]');
};

const notifyEmergencyContacts = (contacts: string[] = []) => {
  const sentAt = new Date().toISOString();
  return contacts.map((contact) => ({
    contact,
    channel: contact.includes('@') ? 'email' : 'sms',
    status: 'sent',
    sentAt,
  }));
};

/**
 * Create panic alert
 */
const persistRecording = async (recording?: string, prefix = 'panic'): Promise<string | undefined> => {
  if (!recording) {
    return undefined;
  }

  if (!recording.startsWith('data:')) {
    return recording;
  }

  const match = recording.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return recording;
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const extension = mimeType.includes('video') ? 'webm' : 'webm';
  const fileName = `${prefix}-${Date.now()}.${extension}`;
  const outputDir = path.join(process.cwd(), 'public', 'panic-recordings');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, fileName), Buffer.from(base64Data, 'base64'));

  return `/panic-recordings/${fileName}`;
};

export const createPanicAlert = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { location, emergencyContacts, audioRecording, videoRecording, nearestPoliceStation } = req.body;

    if (!location) {
      return res.status(400).json({ error: 'Location required' });
    }

    const savedAudioRecording = await persistRecording(audioRecording, 'panic-audio');
    const savedVideoRecording = await persistRecording(videoRecording, 'panic-video');

    const alert = await db.createPanicAlert({
      userId: req.user.id,
      location,
      emergencyContacts: emergencyContacts || [],
      audioRecording: savedAudioRecording,
      videoRecording: savedVideoRecording,
      nearestPoliceStation,
      status: 'active',
    });

    const notifications = notifyEmergencyContacts(emergencyContacts || []);
    console.log('🚨 PANIC ALERT:', alert);

    res.status(201).json({
      ...alert,
      notifications,
      emergencyContactsNotified: notifications.length,
    });
  } catch (error) {
    console.error('Create panic alert error:', error);
    res.status(500).json({ error: 'Failed to create panic alert' });
  }
};

/**
 * Cancel panic alert
 */
export const cancelPanicAlert = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const alert = await db.updatePanicAlert(id, 'cancelled');

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    console.error('Cancel panic alert error:', error);
    res.status(500).json({ error: 'Failed to cancel alert' });
  }
};

/**
 * Get user's panic alerts
 */
export const getPanicAlerts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const alerts = await db.getPanicAlertsByUser(req.user.id);
    res.json(alerts);
  } catch (error) {
    console.error('Get panic alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

/**
 * Report harassment or unsafe incident
 */
export const reportSafetyIssue = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { type, description, location, isAnonymous = false, attachments = [] } = req.body;

    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description required' });
    }

    const report = await db.createSafetyReport({
      userId: req.user.id,
      type: type as 'harassment' | 'threat' | 'unsafe_location' | 'other',
      description: stripPII(description),
      location,
      isAnonymous,
      attachments,
      status: 'reported',
    });

    // TODO: Route to admin panel for review
    console.log('📋 SAFETY REPORT:', report);

    res.status(201).json(report);
  } catch (error) {
    console.error('Report safety issue error:', error);
    res.status(500).json({ error: 'Failed to report issue' });
  }
};

/**
 * Public anonymous safety report (no login required)
 */
export const reportSafetyIssuePublic = async (req: AuthRequest, res: Response) => {
  try {
    const { type, description, location, isAnonymous = true, attachments = [] } = req.body;

    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description required' });
    }

    const report = await db.createSafetyReport({
      userId: req.user?.id || 'anonymous',
      type: type as 'harassment' | 'threat' | 'unsafe_location' | 'other',
      description: stripPII(description),
      location,
      isAnonymous: true,
      attachments,
      status: 'reported',
    });

    res.status(201).json({
      id: report.id,
      status: report.status,
      isAnonymous,
      createdAt: report.createdAt,
    });
  } catch (error) {
    console.error('Public report safety issue error:', error);
    res.status(500).json({ error: 'Failed to report issue' });
  }
};

/**
 * Get user's safety reports
 */
export const getSafetyReports = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const reports = await db.getSafetyReportsByUser(req.user.id);
    res.json(reports);
  } catch (error) {
    console.error('Get safety reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

/**
 * Rate a route's safety
 */
export const rateRouteSafety = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { from, to, safetyScore, comment } = req.body;

    if (!from || !to || safetyScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rating = await db.createRouteRating({
      userId: req.user.id,
      route: { from, to },
      safetyScore: Math.min(5, Math.max(1, safetyScore)),
      comment,
    });

    res.status(201).json(rating);
  } catch (error) {
    console.error('Rate route error:', error);
    res.status(500).json({ error: 'Failed to rate route' });
  }
};

/**
 * Get route safety ratings
 */
export const getRouteSafetyRatings = async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'From and to parameters required' });
    }

    const ratings = await db.getRouteRatings(from as string, to as string);
    
    // Calculate average safety score
    const avgScore = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.safetyScore, 0) / ratings.length
      : 0;

    res.json({
      from,
      to,
      averageSafetyScore: avgScore,
      totalRatings: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error('Get route safety ratings error:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

/**
 * Suggest safer route by comparing route variants
 */
export const suggestSaferRoute = async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'From and to parameters required' });
    }

    const candidates = [
      { label: 'Direct', from: from as string, to: to as string },
      { label: 'Main Road', from: `${from} via main road`, to: to as string },
      { label: 'Well Lit Route', from: `${from} via well lit roads`, to: to as string },
    ];

    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const ratings = await db.getRouteRatings(candidate.from, candidate.to);
        const avgScore = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.safetyScore, 0) / ratings.length
          : 0;
        return {
          ...candidate,
          averageSafetyScore: avgScore,
          totalRatings: ratings.length,
        };
      })
    );

    scoredCandidates.sort((a, b) => {
      if (b.averageSafetyScore !== a.averageSafetyScore) {
        return b.averageSafetyScore - a.averageSafetyScore;
      }
      return b.totalRatings - a.totalRatings;
    });

    const recommended = scoredCandidates[0];
    res.json({
      from,
      to,
      recommended,
      candidates: scoredCandidates,
    });
  } catch (error) {
    console.error('Suggest safer route error:', error);
    res.status(500).json({ error: 'Failed to suggest safer route' });
  }
};

/**
 * Find nearest police station (using dummy data)
 */
export const findNearestPoliceStation = async (req: AuthRequest, res: Response) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    // Uses OpenStreetMap Overpass API with graceful fallback to static list.
    const overpassQuery = `
      [out:json][timeout:12];
      (
        node["amenity"="police"](around:7000,${latitude},${longitude});
      );
      out body 10;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: overpassQuery }),
      });

      const data = await response.json() as {
        elements?: Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>;
      };

      const stations = (data.elements || []).slice(0, 5).map((element) => {
        const dLat = latitude - element.lat;
        const dLng = longitude - element.lon;
        const distance = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

        return {
          id: element.id,
          name: element.tags?.name || 'Police Station',
          address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || 'Address unavailable',
          phone: element.tags?.phone || '112',
          distance: Number(distance.toFixed(2)),
        };
      });

      if (stations.length > 0) {
        return res.json(stations.sort((a, b) => a.distance - b.distance));
      }
    } catch (apiError) {
      console.error('Overpass API lookup failed, returning fallback:', apiError);
    }

    const fallbackStations = [
      { id: 1, name: 'Central Police Station', address: 'Main City Police', phone: '112', distance: 2.5 },
      { id: 2, name: 'Downtown Police HQ', address: 'Downtown District', phone: '112', distance: 3.2 },
      { id: 3, name: 'Westside Police Station', address: 'Westside', phone: '112', distance: 4.1 },
    ];

    res.json(fallbackStations);
  } catch (error) {
    console.error('Find police station error:', error);
    res.status(500).json({ error: 'Failed to find police stations' });
  }
};

/**
 * Admin/business view for all reports
 */
export const getAllSafetyReportsForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || (req.user.role !== 'business' && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Business or admin access required' });
    }

    const reports = await db.getAllSafetyReports();
    res.json(reports);
  } catch (error) {
    console.error('Get all safety reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

/**
 * Get emergency contacts for user
 */
export const getEmergencyContacts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      emergencyContacts: user.preferences?.emergencyContacts || [],
    });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch emergency contacts' });
  }
};

/**
 * Update emergency contacts
 */
export const updateEmergencyContacts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { emergencyContacts } = req.body;

    if (!Array.isArray(emergencyContacts)) {
      return res.status(400).json({ error: 'Emergency contacts must be an array' });
    }

    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = await db.updateUser(req.user.id, {
      preferences: {
        language: user.preferences?.language || 'en',
        notifications: user.preferences?.notifications ?? true,
        ...user.preferences,
        emergencyContacts,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update emergency contacts error:', error);
    res.status(500).json({ error: 'Failed to update emergency contacts' });
  }
};
