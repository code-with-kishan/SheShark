/**
 * In-Memory Database Models
 * Easily replaceable with MongoDB/Mongoose or PostgreSQL/Prisma
 * This structure is database-agnostic for flexibility
 */

import { randomUUID } from 'crypto';

// ==================== TYPES ====================
export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'business';
  phone?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    language: 'en' | 'hi' | 'es';
    notifications: boolean;
    emergencyContacts?: string[];
    moodCheckInFrequency?: 'daily' | 'weekly' | 'monthly';
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  modelUrl?: string; // .glb file URL
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

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  products: string[]; // product IDs
  createdAt: Date;
}

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
  safetyScore: number; // 1-5
  comment?: string;
  createdAt: Date;
}

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

export interface ServiceListing {
  id: string;
  userId: string; // Business woman offering service
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

// ==================== IN-MEMORY DATABASE ====================
export class Database {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private brands: Map<string, Brand> = new Map();
  private safetyReports: Map<string, SafetyReport> = new Map();
  private routeRatings: Map<string, RouteRating> = new Map();
  private healthModules: Map<string, HealthModule> = new Map();
  private moodEntries: Map<string, MoodEntry> = new Map();
  private serviceListings: Map<string, ServiceListing> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private panicAlerts: Map<string, PanicAlert> = new Map();

  // ========== USERS ==========
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // ========== PRODUCTS ==========
  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.brand === brand);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;
    const updated = { ...product, ...data, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  // ========== ORDERS ==========
  async createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.customerId === customerId);
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    const updated = { ...order, ...data, updatedAt: new Date() };
    this.orders.set(id, updated);
    return updated;
  }

  // ========== BRANDS ==========
  async createBrand(data: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> {
    const brand: Brand = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.brands.set(brand.id, brand);
    return brand;
  }

  async getBrandById(id: string): Promise<Brand | null> {
    return this.brands.get(id) || null;
  }

  async getBrandByName(name: string): Promise<Brand | null> {
    for (const brand of this.brands.values()) {
      if (brand.name.toLowerCase() === name.toLowerCase()) return brand;
    }
    return null;
  }

  async getAllBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  // ========== SAFETY ==========
  async createSafetyReport(data: Omit<SafetyReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<SafetyReport> {
    const report: SafetyReport = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.safetyReports.set(report.id, report);
    return report;
  }

  async getSafetyReportsByUser(userId: string): Promise<SafetyReport[]> {
    return Array.from(this.safetyReports.values()).filter(r => r.userId === userId);
  }

  async getAllSafetyReports(): Promise<SafetyReport[]> {
    return Array.from(this.safetyReports.values());
  }

  async createRouteRating(data: Omit<RouteRating, 'id' | 'createdAt'>): Promise<RouteRating> {
    const rating: RouteRating = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.routeRatings.set(rating.id, rating);
    return rating;
  }

  async getRouteRatings(from: string, to: string): Promise<RouteRating[]> {
    return Array.from(this.routeRatings.values()).filter(
      r => r.route.from === from && r.route.to === to
    );
  }

  // ========== HEALTH ==========
  async createHealthModule(data: Omit<HealthModule, 'id' | 'createdAt'>): Promise<HealthModule> {
    const module: HealthModule = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.healthModules.set(module.id, module);
    return module;
  }

  async getHealthModules(): Promise<HealthModule[]> {
    return Array.from(this.healthModules.values()).sort((a, b) => a.order - b.order);
  }

  async getHealthModulesByCategory(category: string): Promise<HealthModule[]> {
    return Array.from(this.healthModules.values()).filter(m => m.category === category);
  }

  async createMoodEntry(data: Omit<MoodEntry, 'id'>): Promise<MoodEntry> {
    const entry: MoodEntry = {
      ...data,
      id: randomUUID(),
    };
    this.moodEntries.set(entry.id, entry);
    return entry;
  }

  async getMoodEntriesByUser(userId: string, days: number = 30): Promise<MoodEntry[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Array.from(this.moodEntries.values())
      .filter(m => m.userId === userId && m.timestamp >= cutoffDate)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ========== SERVICES ==========
  async createServiceListing(data: Omit<ServiceListing, 'id' | 'createdAt' | 'updatedAt' | 'bookings'>): Promise<ServiceListing> {
    const service: ServiceListing = {
      ...data,
      id: randomUUID(),
      bookings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceListings.set(service.id, service);
    return service;
  }

  async getServiceListings(): Promise<ServiceListing[]> {
    return Array.from(this.serviceListings.values());
  }

  async getServiceListingsByCategory(category: string): Promise<ServiceListing[]> {
    return Array.from(this.serviceListings.values()).filter(s => s.category === category);
  }

  async createBooking(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const booking: Booking = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    
    // Update service listing
    const service = this.serviceListings.get(data.serviceId);
    if (service) {
      service.bookings.push(booking);
    }
    
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.customerId === userId);
  }

  // ========== PANIC ALERTS ==========
  async createPanicAlert(data: Omit<PanicAlert, 'id' | 'createdAt'>): Promise<PanicAlert> {
    const alert: PanicAlert = {
      ...data,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.panicAlerts.set(alert.id, alert);
    return alert;
  }

  async getPanicAlertsByUser(userId: string): Promise<PanicAlert[]> {
    return Array.from(this.panicAlerts.values()).filter(a => a.userId === userId);
  }

  async updatePanicAlert(id: string, status: string): Promise<PanicAlert | null> {
    const alert = this.panicAlerts.get(id);
    if (!alert) return null;
    alert.status = status as 'active' | 'cancelled' | 'resolved';
    return alert;
  }

  // ========== SEED DATA ==========
  seedDummyData(): void {
    // Seed brands
    this.createBrand({
      name: 'Amazon',
      description: 'Global marketplace',
      products: [],
    });

    const demoProducts = [
      {
        modelUrl: '/models/demo.glb',
        name: 'Sofa',
        description: 'Sofa 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo.svg',
        price: 29999,
      },
      {
        modelUrl: '/models/demo1.glb',
        name: 'Bottle',
        description: 'Bottle 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo1.svg',
        price: 799,
      },
      {
        modelUrl: '/models/demo2.glb',
        name: 'Plants',
        description: 'Plants 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo2.svg',
        price: 1299,
      },
      {
        modelUrl: '/models/demo3.glb',
        name: 'Table Lamp',
        description: 'Table Lamp 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo3.svg',
        price: 2499,
      },
      {
        modelUrl: '/models/demo4.glb',
        name: 'Plush',
        description: 'Plush 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo4.svg',
        price: 1499,
      },
      {
        modelUrl: '/models/demo5.glb',
        name: 'Saree',
        description: 'Saree 3D showcase model with interactive preview.',
        imageUrl: '/models/previews/demo5.svg',
        price: 3599,
      },
      {
        modelUrl: '/models/demo6.glb',
        name: 'Vacuum Cleaner',
        description: 'Home cleaning appliance 3D model for realistic product walkthrough.',
        imageUrl: '/models/previews/demo6.svg',
        price: 10999,
      },
    ];

    demoProducts.forEach((item, index) => {
      this.createProduct({
        name: item.name,
        description: item.description,
        price: item.price,
        images: [item.imageUrl],
        modelUrl: item.modelUrl,
        seller: {
          id: 'demo-business',
          name: 'SheShark Demo Seller',
        },
        brand: index === 0 ? 'Amazon' : 'SheShark Demo',
        category: 'products',
        inStock: true,
        rating: 4.5,
        reviews: [],
      });
    });

    // Seed health modules
    this.createHealthModule({
      title: 'Understanding Your Menstrual Cycle',
      category: 'periods',
      content: 'Learn about different phases of your menstrual cycle and what to expect.',
      order: 1,
      imageUrl: 'https://via.placeholder.com/300x200?text=Periods',
    });

    this.createHealthModule({
      title: 'PCOS: Polycystic Ovary Syndrome Explained',
      category: 'pcos',
      content: 'PCOS affects hormones and can impact fertility. Learn management strategies.',
      order: 2,
      imageUrl: 'https://via.placeholder.com/300x200?text=PCOS',
    });

    this.createHealthModule({
      title: 'Personal Hygiene & Wellness',
      category: 'hygiene',
      content: 'Best practices for maintaining hygiene and overall wellness.',
      order: 3,
      imageUrl: 'https://via.placeholder.com/300x200?text=Hygiene',
    });
  }
}

// Export singleton instance
export const db = new Database();
 
