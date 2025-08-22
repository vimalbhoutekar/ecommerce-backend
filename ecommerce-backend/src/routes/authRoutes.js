import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);

// Admin test route
router.get('/admin-test', protect, adminOnly, (req, res) => {
  res.json({ message: 'Admin access granted!', user: req.user.name });
});


export default router;