/**
 * Health & Wellness Controller
 * Handles health education, mood tracking, and mental health support
 */

import { Response } from 'express';
import { db } from '../models/index';
import { AuthRequest } from '../middleware/auth';

type StoredChatMessage = {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
};

const chatHistoryStore = new Map<string, Record<string, StoredChatMessage[]>>();

/**
 * Get all health modules
 */
export const getHealthModules = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;

    let modules;
    if (category) {
      modules = await db.getHealthModulesByCategory(category as string);
    } else {
      modules = await db.getHealthModules();
    }

    res.json(modules);
  } catch (error) {
    console.error('Get health modules error:', error);
    res.status(500).json({ error: 'Failed to fetch health modules' });
  }
};

/**
 * Get single health module
 */
export const getHealthModule = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const modules = await db.getHealthModules();
    const module = modules.find(m => m.id === id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    console.error('Get health module error:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

/**
 * Record mood entry
 */
export const recordMood = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { mood, notes } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const validMoods = ['great', 'good', 'okay', 'bad', 'terrible'];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ error: 'Invalid mood' });
    }

    const entry = await db.createMoodEntry({
      userId: req.user.id,
      mood: mood as 'great' | 'good' | 'okay' | 'bad' | 'terrible',
      notes,
      timestamp: new Date(),
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Record mood error:', error);
    res.status(500).json({ error: 'Failed to record mood' });
  }
};

/**
 * Get mood history
 */
export const getMoodHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { days = 30 } = req.query;
    const entries = await db.getMoodEntriesByUser(req.user.id, parseInt(days as string));

    // Calculate mood statistics
    const moodCounts = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0,
    };

    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });

    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    res.json({
      entries,
      statistics: {
        totalEntries: entries.length,
        moodCounts,
        mostCommonMood: mostCommonMood ? mostCommonMood[0] : null,
        averageDaysTracked: entries.length > 0 ? Math.round(days as number / entries.length) : 0,
      },
    });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
};

/**
 * Get mental health resources and coping strategies
 */
export const getMentalHealthResources = async (req: AuthRequest, res: Response) => {
  try {
    const resources = {
      copingStrategies: [
        {
          id: 1,
          title: 'Deep Breathing Exercise',
          description: 'Calm your nervous system with simple breathing',
          steps: [
            'Breathe in for 4 counts',
            'Hold for 4 counts',
            'Exhale for 4 counts',
            'Repeat 5-10 times',
          ],
          duration: '5 minutes',
        },
        {
          id: 2,
          title: 'Grounding Technique (5-4-3-2-1)',
          description: 'Bring yourself back to the present moment',
          steps: [
            'Notice 5 things you can see',
            'Notice 4 things you can touch',
            'Notice 3 things you can hear',
            'Notice 2 things you can smell',
            'Notice 1 thing you can taste',
          ],
          duration: '10 minutes',
        },
        {
          id: 3,
          title: 'Journaling',
          description: 'Express your feelings and thoughts on paper',
          steps: [
            'Find a quiet place',
            'Write freely without judgment',
            'Express your emotions',
            'Reflect on patterns',
          ],
          duration: '15 minutes',
        },
        {
          id: 4,
          title: 'Physical Activity',
          description: 'Release stress through movement',
          steps: [
            'Choose an activity you enjoy',
            'Start with 10-15 minutes',
            'Focus on how your body feels',
            'Increase duration gradually',
          ],
          duration: '20-30 minutes',
        },
      ],
      supportLines: [
        {
          name: 'Mental Health Helpline',
          number: '1-800-273-8255',
          availability: '24/7',
          languages: ['English', 'Spanish', 'Hindi'],
        },
        {
          name: 'Crisis Text Line',
          number: 'Text HOME to 741741',
          availability: '24/7',
          languages: ['English'],
        },
      ],
      professionalHelp: [
        {
          type: 'Therapist',
          description: 'Professional counseling for mental health',
          frequency: 'Weekly or as needed',
        },
        {
          type: 'Support Groups',
          description: 'Connect with others facing similar challenges',
          frequency: 'Weekly meetings',
        },
        {
          type: 'Psychiatrist',
          description: 'Medical treatment for mental health conditions',
          frequency: 'Monthly check-ups',
        },
      ],
    };

    res.json(resources);
  } catch (error) {
    console.error('Get mental health resources error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

/**
 * AI mental health support chat
 */
export const getMentalHealthSupport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { message, mood } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // TODO: Integrate with Gemini API for emotional support
    const supportResponse = {
      id: `support-${Date.now()}`,
      timestamp: new Date(),
      userMessage: message,
      mood,
      assistantResponse:
        'I hear you. Remember, your feelings are valid. Take a moment to breathe. Would you like to try one of our coping strategies?',
      suggestions: [
        'Try a grounding exercise',
        'Record your mood',
        'Contact a helpline',
        'Reach out to a friend',
      ],
    };

    res.json(supportResponse);
  } catch (error) {
    console.error('Get mental health support error:', error);
    res.status(500).json({ error: 'Failed to get support' });
  }
};

/**
 * Save and fetch AI chat history
 */
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const mode = (req.query.mode as string) || 'business';
    const userChats = chatHistoryStore.get(req.user.id) || {};
    res.json({ mode, messages: userChats[mode] || [] });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const saveChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { mode = 'business', role, text } = req.body;
    if (!text || !role) {
      return res.status(400).json({ error: 'mode, role, and text are required' });
    }

    const userChats = chatHistoryStore.get(req.user.id) || {};
    const modeChats = userChats[mode] || [];
    modeChats.push({
      role,
      text,
      timestamp: new Date().toISOString(),
    });

    userChats[mode] = modeChats.slice(-200);
    chatHistoryStore.set(req.user.id, userChats);

    res.status(201).json({ success: true, mode, total: userChats[mode].length });
  } catch (error) {
    console.error('Save chat history error:', error);
    res.status(500).json({ error: 'Failed to save chat history' });
  }
};

export const clearChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const mode = req.query.mode as string | undefined;
    const userChats = chatHistoryStore.get(req.user.id) || {};

    if (mode) {
      userChats[mode] = [];
    } else {
      Object.keys(userChats).forEach((key) => {
        userChats[key] = [];
      });
    }

    chatHistoryStore.set(req.user.id, userChats);
    res.json({ success: true });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
 
