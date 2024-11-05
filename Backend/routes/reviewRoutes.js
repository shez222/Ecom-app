// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').get(getReviews).post(createReview);
router.route('/:id').get(getReview).put(updateReview).delete(deleteReview);

module.exports = router;
