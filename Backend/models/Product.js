// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter the product name'],
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please enter the product description'],
    maxlength: [1000, 'Product description cannot exceed 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter the product price'],
    maxlength: [8, 'Price cannot exceed 8 figures'],
  },
  category: {
    type: String,
    required: [true, 'Please enter the product category'],
    maxlength: [50, 'Category cannot exceed 50 characters'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter the stock quantity'],
    maxlength: [5, 'Stock cannot exceed 5 digits'],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
