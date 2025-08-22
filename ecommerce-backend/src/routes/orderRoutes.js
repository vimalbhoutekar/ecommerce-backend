import express from 'express';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/all', protect, adminOnly, getAllOrders);

export default router;
