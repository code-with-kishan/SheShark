/**
 * Custom React Hooks for SheShark Platform
 * Reusable hooks for common functionality
 */

import { useEffect, useState, useCallback } from 'react';
import {
  authService,
  marketplaceService,
  safetyService,
  healthService,
  servicesService,
  aiService,
} from '@/services/api';

// ==================== AUTHENTICATION ====================

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('auth_token', response.data.token);
    setToken(response.data.token);
    setIsAuthenticated(true);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, token, login, logout };
};

// ==================== MARKETPLACE ====================

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (brand?: string, category?: string, search?: string) => {
    setLoading(true);
    try {
      const response = await marketplaceService.getProducts(brand, category, search);
      setProducts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await marketplaceService.getProduct(id);
        setProduct(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

// ==================== HEALTH ====================

export const useHealthModules = (category?: string) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await healthService.getHealthModules(category);
        setModules(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [category]);

  return { modules, loading, error };
};

export const useMoodHistory = (days?: number) => {
  const [history, setHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await healthService.getMoodHistory(days);
        setHistory(response.data.entries);
        setStatistics(response.data.statistics);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [days]);

  const refresh = useCallback(async () => {
    const response = await healthService.getMoodHistory(days);
    setHistory(response.data.entries);
    setStatistics(response.data.statistics);
  }, [days]);

  return { history, statistics, loading, error, refresh };
};

// ==================== SERVICES ====================

export const useServices = (category?: string) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getServices(category);
        setServices(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [category]);

  return { services, loading, error };
};

export const useEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await servicesService.getEarnings();
        setEarnings(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const refresh = useCallback(async () => {
    const response = await servicesService.getEarnings();
    setEarnings(response.data);
  }, []);

  return { earnings, loading, error, refresh };
};

// ==================== SAFETY ====================

export const usePanicAlert = () => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(async (location: any, contacts: string[]) => {
    setLoading(true);
    try {
      const response = await safetyService.triggerPanicAlert(location, contacts);
      setAlert(response.data);
      setIsTriggered(true);
    } catch (error) {
      console.error('Error triggering panic alert:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (alertId: string) => {
    setLoading(true);
    try {
      await safetyService.cancelPanicAlert(alertId);
      setIsTriggered(false);
      setAlert(null);
    } catch (error) {
      console.error('Error cancelling alert:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { isTriggered, alert, loading, trigger, cancel };
};

// ==================== AI ====================

export const useAI = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(async (message: string, mode?: string, language?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiService.chat(message, mode, language);
      setResponse(res.data.text);
      return res.data.text;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, error, chat };
};

export const useVoiceCommand = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const processCommand = useCallback(async (transcript: string, language?: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await aiService.processVoiceCommand(transcript, language);
      setResult(response.data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { isProcessing, result, error, processCommand };
};
