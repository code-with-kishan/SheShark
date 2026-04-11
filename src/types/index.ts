/**
 * TypeScript Type Definitions for SheShark Platform
 */

// ==================== AUTH ====================

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'business';
  phone?: string;
  bio?: string;
  location?: string;
  preferences?: {
    language: 'en' | 'hi' | 'es';
    notifications: boolean;
    emergencyContacts?: string[];
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ==================== MARKETPLACE ====================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  modelUrl?: string;
  seller: {
    id: string;
    name: string;
  };
  brand?: string;
  category: 'products' | 'services' | 'courses';
  inStock: boolean;
  rating: number;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  products: string[];
  createdAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

// ==================== ORDERS ====================

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// ==================== SAFETY ====================

export interface SafetyReport {
  id: string;
  userId: string;
  type: 'harassment' | 'threat' | 'unsafe_location' | 'other';
  description: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  isAnonymous: boolean;
  attachments?: string[];
  status: 'reported' | 'under_review' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteRating {
  id: string;
  userId: string;
  route: {
    from: string;
    to: string;
  };
  safetyScore: number;
  comment?: string;
  createdAt: Date;
}

export interface PanicAlert {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  emergencyContacts: string[];
  audioRecording?: string;
  videoRecording?: string;
  nearestPoliceStation?: {
    name: string;
    address: string;
    phone: string;
    distance: number;
  };
  status: 'active' | 'cancelled' | 'resolved';
  createdAt: Date;
}

// ==================== HEALTH ====================

export interface HealthModule {
  id: string;
  title: string;
  category: 'periods' | 'pcos' | 'hygiene' | 'mental_health';
  content: string;
  translations?: Record<string, string>;
  imageUrl?: string;
  order: number;
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
  timestamp: Date;
}

export interface MoodStatistics {
  totalEntries: number;
  moodCounts: Record<string, number>;
  mostCommonMood?: string;
  averageDaysTracked: number;
}

// ==================== SERVICES ====================

export interface ServiceListing {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'cooking' | 'tutoring' | 'crafts' | 'consulting' | 'other';
  hourlyRate: number;
  availability: string[];
  bookings: Booking[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  startTime: Date;
  endTime: Date;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface AvailableSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
}

export interface EarningsData {
  totalEarnings: number;
  completedBookings: number;
  pendingBookings: number;
  servicesOffered: number;
  avgHourlyRate: number;
}

// ==================== API RESPONSES ====================

export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ==================== ENUMS ====================

export enum UserRole {
  CUSTOMER = 'customer',
  BUSINESS = 'business',
  ADMIN = 'admin',
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  SPANISH = 'es',
}

export enum MoodType {
  GREAT = 'great',
  GOOD = 'good',
  OKAY = 'okay',
  BAD = 'bad',
  TERRIBLE = 'terrible',
}

export enum SafetyReportType {
  HARASSMENT = 'harassment',
  THREAT = 'threat',
  UNSAFE_LOCATION = 'unsafe_location',
  OTHER = 'other',
}

export enum ServiceCategory {
  COOKING = 'cooking',
  TUTORING = 'tutoring',
  CRAFTS = 'crafts',
  CONSULTING = 'consulting',
  OTHER = 'other',
}

// ==================== CONTEXT ====================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
}

export interface StoreType {
  user: User | null;
  role: UserRole;
  language: Language;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  setLanguage: (language: Language) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}
 
