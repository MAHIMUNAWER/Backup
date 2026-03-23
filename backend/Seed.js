// Run this once to seed products into MongoDB:
// node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');

const PRODUCTS = [
  { name: 'Premium Rice Seeds',     price: 45,  tag: 'Cereals',    stock: true  },
  { name: 'Fresh Farm Milk (1L)',    price: 12,  tag: 'Dairy',      stock: true  },
  { name: 'Organic Wheat Flour',     price: 28,  tag: 'Processed',  stock: true  },
  { name: 'Tomato Seeds (50g)',      price: 8,   tag: 'Vegetables', stock: true  },
  { name: 'Sunflower Oilseeds',     price: 55,  tag: 'Oilseeds',   stock: false },
  { name: 'Free-Range Eggs (12)',    price: 15,  tag: 'Eggs',       stock: true  },
  { name: 'Jute Bags (Pack of 10)', price: 22,  tag: 'Processed',  stock: true  },
  { name: 'Mango Jam (500g)',        price: 18,  tag: 'Fruits',     stock: false },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  await Product.insertMany(PRODUCTS);
  console.log(`✅ Seeded ${PRODUCTS.length} products`);

  mongoose.disconnect();
}

seed().catch(console.error);