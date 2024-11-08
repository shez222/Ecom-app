// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');

const { protect, admin } = require('../middleware/authMiddleware');

// Route to add or update a review
router.post('/', protect, addOrUpdateReview);

// Route to get all reviews for a product
router.get('/:productId', getProductReviews);

// Route to delete a review
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
