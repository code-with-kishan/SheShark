/**
 * Marketplace Routes
 */

import { Router } from 'express';
import * as marketplaceController from '../controllers/marketplace';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Get all products (with filters)
router.get('/', marketplaceController.getProducts);

// Get products by brand
router.get('/brand/:brand', marketplaceController.getProductsByBrand);

// Get single product
router.get('/:id', marketplaceController.getProduct);

// Create product (Business only)
router.post('/', marketplaceController.createProduct);

// Update product (Seller only)
router.put('/:id', marketplaceController.updateProduct);

// Get product reviews
router.get('/:id/reviews', marketplaceController.getProductReviews);

// Add review
router.post('/:id/reviews', marketplaceController.addReview);

export default router;
