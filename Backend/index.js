// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');
const adminRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes')
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/', (req, res) => {
  res.send('API is running...');
})

// Routes
app.use('/api/auth', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware (should be last piece of middleware)
app.use(errorHandler);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
