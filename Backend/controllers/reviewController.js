// controllers/reviewController.js

const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Add or Update a product review
// @route   POST /api/reviews
// @access  Private/User
const addOrUpdateReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  // Validate input
  if (!productId || !rating || !comment) {
    res.status(400);
    throw new Error('Please provide productId, rating, and comment.');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5.');
  }

  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Check if the user has already reviewed the product
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    // Update the existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    await existingReview.save();
    res.status(200).json({ success: true, message: 'Review updated successfully.' });
  } else {
    // Create a new review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      name: req.user.name,
      rating,
      comment,
    });
    res.status(201).json({ success: true, message: 'Review added successfully.' });
  }

  // Recalculate product ratings and number of reviews
  await Product.calculateRatings(productId);
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  // Fetch all reviews for the product
  const reviews = await Review.find({ product: productId }).populate('user', 'name email');

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private/User/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  // Find the review
  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found.');
  }

  // Check if the user is the owner of the review or an admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this review.');
  }

  // Get the associated product ID before deletion
  const productId = review.product;

  // Delete the review
  await review.remove();

  res.status(200).json({ success: true, message: 'Review deleted successfully.' });

  // Recalculate product ratings and number of reviews
  await Product.calculateRatings(productId);
});

module.exports = {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
};
