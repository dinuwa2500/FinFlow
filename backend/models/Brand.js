const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Brand name is required'], 
    unique: true,
    trim: true 
  },
  logoUrl: { 
    type: String, 
    required: [true, 'Logo URL is required'] 
  },
  primaryColor: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Brand', BrandSchema);
