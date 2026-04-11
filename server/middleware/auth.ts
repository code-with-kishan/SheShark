/**
 * Authentication Middleware
 * Handles JWT token validation and role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sheshark-dev-secret-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'business' | 'admin';
  };
}

/**
 * Verify JWT token and attach user to request
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // For demo purposes, allow requests without token
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    next(); // Continue even if token is invalid (for public routes)
  }
};

/**
 * Require authentication
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

/**
 * Require specific role
 */
export const requireRole = (role: 'customer' | 'business') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, email: string, role: 'customer' | 'business'): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Validation middleware
 */
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors || error.message,
      });
    }
  };
};

/**
 * Error handler middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

/**
 * Rate limiting middleware (basic implementation)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    const entry = requestCounts.get(ip);
    
    if (entry && entry.resetTime > now) {
      entry.count++;
      if (entry.count > maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
      }
    } else {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    }
    
    next();
  };
};
 
