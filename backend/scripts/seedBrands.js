require('dotenv').config();
const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const brands = [
  {
    name: "Amazon",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    primaryColor: "#FF9900"
  },
  {
    name: "Netflix",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    primaryColor: "#E50914"
  },
  {
    name: "Spotify",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    primaryColor: "#1DB954"
  },
  {
    name: "Figma",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    primaryColor: "#F24E1E"
  },
  {
    name: "Apple",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    primaryColor: "#000000"
  },
  {
    name: "Google",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_logo_2015.svg",
    primaryColor: "#4285F4"
  }
];

const seedBrands = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('🗑️  Existing brands cleared');

    // Insert new brands
    await Brand.insertMany(brands);
    console.log('✨ Brands seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding brands:', error.message);
    process.exit(1);
  }
};

seedBrands();
