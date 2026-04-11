/**
 * Product & Marketplace Controller
 */

import { Response } from 'express';
import { db } from '../models/index';
import { AuthRequest } from '../middleware/auth';

/**
 * Create a new product (Business only)
 */
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only business users can create products' });
    }

    const { name, description, price, images = [], modelUrl, brand, category, inStock = true } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const seller = await db.getUserById(req.user.id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const product = await db.createProduct({
      name,
      description,
      price,
      images,
      modelUrl,
      seller: {
        id: seller.id,
        name: seller.displayName,
      },
      brand,
      category: category || 'products',
      inStock,
      rating: 0,
      reviews: [],
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

/**
 * Get all products with optional filters
 */
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { brand, category, searchQuery } = req.query;

    let products = await db.getAllProducts();

    if (brand) {
      products = products.filter(p => p.brand === brand);
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    if (searchQuery) {
      const query = (searchQuery as string).toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * Get single product
 */
export const getProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

/**
 * Update product (Seller only)
 */
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only business users can update products' });
    }

    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product || product.seller.id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await db.updateProduct(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

/**
 * Add review to product
 */
export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment required' });
    }

    const product = await db.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const review = {
      id: `review-${Date.now()}`,
      userId: req.user.id,
      rating: Math.min(5, Math.max(1, rating)),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    
    // Calculate average rating
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    product.rating = avgRating;

    await db.updateProduct(id, product);

    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

/**
 * Get reviews for product
 */
export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product.reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Get products by brand
 */
export const getProductsByBrand = async (req: AuthRequest, res: Response) => {
  try {
    const { brand } = req.params;
    const products = await db.getProductsByBrand(brand);
    res.json(products);
  } catch (error) {
    console.error('Get products by brand error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
 
