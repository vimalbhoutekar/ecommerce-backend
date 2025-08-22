import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Coupon from '../models/couponModel.js';
import { getIO } from '../config/socket.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    let totalAmount = 0;
    let discountAmount = 0;

    // Calculate total and validate stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product?.name || 'product'}` 
        });
      }
      totalAmount += product.price * item.quantity;
      item.price = product.price;
    }

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode, 
        isActive: true,
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() }
      });

      if (coupon && totalAmount >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (totalAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        totalAmount -= discountAmount;
        
        // Update coupon usage
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      discountAmount,
      shippingAddress,
      couponCode
    });

    // Update product stocks
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product')
      .populate('user', 'name email');

    // Emit order-created event for real-time analytics
    const io = getIO();
    if (io) {
      io.emit('order-created', {
        orderId: order._id,
        user: populatedOrder.user,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      });
    }

    res.status(201).json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};