
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import custom modules
import connectDB from './src/config/database.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import { initSocket } from './src/config/socket.js';
import cron from 'node-cron';
import Product from './src/models/productModel.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce API Server Running! 🚀',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      coupons: '/api/coupons',
      reports: '/api/reports/sales'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

// Initialize socket.io
initSocket(server);

// Scheduled task: Stock audit (runs every day at midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const products = await Product.find({});
    console.log('--- Daily Stock Audit ---');
    products.forEach(p => {
      console.log(`Product: ${p.name}, Stock: ${p.stock}`);
    });
    console.log('-------------------------');
  } catch (err) {
    console.error('Stock audit error:', err.message);
  }
});
