// models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      required: [true, 'Please add a review ID'],
      unique: true,
    },
    user: {
      name: {
        type: String,
        required: [true, 'Please add the user name'],
      },
      email: {
        type: String,
        required: [true, 'Please add the user email'],
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
    },
    product: {
      name: {
        type: String,
        required: [true, 'Please add the product/exam name'],
      },
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      maxlength: 500,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
