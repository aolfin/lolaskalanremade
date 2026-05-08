import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Dish from './models/Dish.js';
import Order from './models/Order.js';

dotenv.config();

const app = express();

console.log('✅ server.js loaded - CORS enabled');

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5000', 
  'http://localhost',
  'http://frontend',
  'https://aolfin.github.io', 
  'https://lolaskalanremade-production.up.railway.app',
  'https://lolas-backend-production.up.railway.app',
];

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // No default, it must come from .env

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Helper to calculate total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price.replace('$', '')), 0);
};

// API Routes

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu', error: err.message });
  }
});

// Get or create user's current cart
app.get('/api/cart', async (req, res) => {
  try {
    let cart = await Order.findOne({ isCart: true, status: 'pending' });
    if (!cart) {
      cart = new Order({ items: [], total: 0, isCart: true, status: 'pending' });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

// Update cart (add, remove, change quantity)
app.post('/api/cart/update', async (req, res) => {
  const { dish, title, delta, action } = req.body; // 'add', 'remove', 'updateQuantity'
  try {
    let cart = await Order.findOne({ isCart: true, status: 'pending' });
    if (!cart) {
      cart = new Order({ items: [], total: 0, isCart: true, status: 'pending' });
    }

    let itemIndex;
    if (dish) { // For 'add' action
      itemIndex = cart.items.findIndex(item => item.title === dish.title);
    } else if (title) { // For 'remove' or 'updateQuantity' actions
      itemIndex = cart.items.findIndex(item => item.title === title);
    }

    switch (action) {
      case 'add':
        if (!dish) return res.status(400).json({ message: 'Dish details required for add action.' });
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
        } else {
          cart.items.push({
            title: dish.title,
            description: dish.description,
            price: dish.price,
            image: dish.image,
            quantity: 1
          });
        }
        break;
      case 'remove':
        if (itemIndex > -1) {
          cart.items.splice(itemIndex, 1);
        }
        break;
      case 'updateQuantity':
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += delta;
          if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          }
        } else if (delta > 0) { // If trying to increment a non-existent item, it's an error unless dish info is provided.
          return res.status(400).json({ message: 'Cannot update quantity for non-existent item without dish details.' });
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid cart action.' });
    }

    cart.total = calculateTotal(cart.items);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
});

// Place a new order (finalize the current cart)
app.post('/api/orders', async (req, res) => {
  try {
    let currentCart = await Order.findOne({ isCart: true, status: 'pending' });

    if (!currentCart || currentCart.items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an empty order.' });
    }

    // Convert the current cart into a placed order
    currentCart.isCart = false;
    currentCart.status = 'completed';
    currentCart.createdAt = new Date(); // Update creation time to order placement time
    await currentCart.save();

    // Create a new empty cart for the next session
    const newCart = new Order({ items: [], total: 0, isCart: true, status: 'pending' });
    await newCart.save();

    res.status(201).json({ order: currentCart, newCart });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
