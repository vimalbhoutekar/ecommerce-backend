import express from 'express';
import { getProducts, createProduct, updateStock, getProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id/stock', protect, adminOnly, updateStock);

export default router;