/**
 * Authentication Controller
 */

import { Request, Response } from 'express';
import { db, User } from '../models/index';
import { generateToken } from '../middleware/auth';
import bcrypt from 'bcryptjs';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, role = 'customer', phone, location } = req.body;

    // Validate input
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.createUser({
      email,
      passwordHash,
      displayName,
      role: role as 'customer' | 'business',
      phone,
      location,
      preferences: {
        language: 'en',
        notifications: true,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.email, user.role);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Demo auth for rapid testing
 */
export const demoLogin = async (req: Request, res: Response) => {
  try {
    const { role = 'customer', email, displayName } = req.body;

    const demoEmail = email || `demo-${role}@sheshark.app`;
    const demoName = displayName || `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`;

    let user = await db.getUserByEmail(demoEmail);

    if (!user) {
      user = await db.createUser({
        email: demoEmail,
        displayName: demoName,
        role: role as 'customer' | 'business',
        preferences: {
          language: 'en',
          notifications: true,
        },
      });
    }

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ error: 'Demo login failed' });
  }
};
 
