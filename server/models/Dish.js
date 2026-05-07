import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

export default mongoose.model('Dish', dishSchema);
