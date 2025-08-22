import express from 'express';
import { validateCoupon, createCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.post('/', protect, adminOnly, createCoupon);

export default router;

