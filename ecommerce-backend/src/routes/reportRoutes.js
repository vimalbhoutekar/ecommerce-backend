import express from 'express';
import { generateSalesReport } from '../controllers/reportController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin only: generate sales report PDF
router.get('/sales', protect, adminOnly, generateSalesReport);

export default router;
