// models/Review.js

const mongoose = require('mongoose');

// Define the Review Schema
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add your name.'],
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5.'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment.'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only leave one review per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
