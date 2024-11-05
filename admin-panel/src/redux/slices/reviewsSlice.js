// src/redux/slices/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Fetch all reviews
export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/reviews');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch reviews.'
    );
  }
});

// Approve a review
export const approveReview = createAsyncThunk('reviews/approveReview', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/reviews/${id}/approve`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to approve review.'
    );
  }
});

// Delete a review
export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to delete review.'
    );
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve Review
      .addCase(approveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex((review) => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(approveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter((review) => review._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
