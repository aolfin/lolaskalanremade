import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from './models/Dish.js';

dotenv.config();

const dishes = [
  {
    title: 'Lechon Kawali',
    description: 'Crispy pork belly with rich sauce and garlic rice.',
    price: '$22.95',
    image: 'https://static01.nyt.com/images/2023/11/28/multimedia/ND-Lechon-Kawali-bflv/ND-Lechon-Kawali-bflv-mediumSquareAt3X.jpg',
  },
  {
    title: 'Lumpia Shanghai',
    description: 'Crispy spring rolls filled with seasoned pork and vegetables.',
    price: '$8.95',
    image: 'https://barefeetinthekitchen.com/wp-content/uploads/2025/05/Lumpia-BFK-8.jpg',
  },
  {
    title: 'Pancit Bihon',
    description: 'Stir-fried rice noodles with shrimp, chicken, and fresh vegetables.',
    price: '$10.95',
    image: 'https://panlasangpinoy.com/wp-content/uploads/2024/11/Filipino-Pancit-Recipe.jpg',
  },
  {
    title: 'Inihaw na Baboy',
    description: 'Grilled pork with smoky glaze and sticky rice.',
    price: '$16.95',
    image: 'https://i.pinimg.com/564x/b5/01/86/b50186244dd162698f82122327b8854f.jpg',
  },
  {
    title: 'Sinigang',
    description: 'Tamarind soup with pork, vegetables, and bright, tangy broth.',
    price: '$13.95',
    image: 'https://www.nestlegoodnes.com/ph/sites/default/files/styles/1_1_768px_width/public/srh_recipes/442ce059c4c490e1ab61cdaef9c98511.jpg.webp?itok=sKq8qila',
  },
  {
    title: 'Halo-Halo',
    description: 'Mix of shaved ice, beans, fruits, and leche flan for a refreshing dessert.',
    price: '$6.95',
    image: 'https://assets.bonappetit.com/photos/60e46c6701084801b06de2a3/16:9/w_2190,h_1232,c_limit/Halo-Halo-Recipe-2021.jpg',
  },
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lolaskalan';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');
    await Dish.deleteMany({});
    await Dish.insertMany(dishes);
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
