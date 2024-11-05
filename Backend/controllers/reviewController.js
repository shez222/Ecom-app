// controllers/reviewController.js

const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Private/Admin
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Admin
const createReview = async (req, res) => {
  try {
    const { reviewId, user, product, rating, comment } = req.body;

    // Simple validation
    if (!reviewId || !user || !product || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all fields' });
    }

    const review = await Review.create({
      reviewId,
      user,
      product,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    // Handle duplicate key error for reviewId
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Review ID already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: 'Review not found' });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      message: 'Review removed',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add query parameters handling in getReviews

// const getReviews = async (req, res) => {
//   try {
//     let query = Review.find();

//     // Filtering
//     if (req.query.approved) {
//       query = query.where('approved').equals(req.query.approved === 'true');
//     }

//     // Search by product name or user name
//     if (req.query.search) {
//       const searchTerm = req.query.search;
//       query = query.find({
//         $or: [
//           { 'product.name': { $regex: searchTerm, $options: 'i' } },
//           { 'user.name': { $regex: searchTerm, $options: 'i' } },
//         ],
//       });
//     }

//     // Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     // Pagination
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 25;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Review.countDocuments();

//     query = query.skip(startIndex).limit(limit);

//     const reviews = await query;

//     // Pagination result
//     const pagination = {};

//     if (endIndex < total) {
//       pagination.next = {
//         page: page + 1,
//         limit,
//       };
//     }

//     if (startIndex > 0) {
//       pagination.prev = {
//         page: page - 1,
//         limit,
//       };
//     }

//     res.status(200).json({
//       success: true,
//       count: reviews.length,
//       pagination,
//       data: reviews,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };


module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
