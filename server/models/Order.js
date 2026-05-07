import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    title: String,
    quantity: Number,
    price: String,
    image: String, // Added image field
  }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }, // 'pending', 'completed', 'cancelled'
  isCart: { type: Boolean, default: false }, // True if this order document represents the current active cart
});

export default mongoose.model('Order', orderSchema);
