// controllers/orderController.js

const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const stripe = require('stripe')('sk_test_51OXlAIAZK57wNYnQQluuPOe6YHwpKCs2dZfKLaEe7Ye67OObYR3Hes3i0Vjo1yp450mlVWQ9ufvWWYYymF1mc33R00GwSCgwFi');

/**
 * @desc    Create a Stripe Payment Intent
 * @route   POST /api/orders/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = asyncHandler(async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2023-10-16'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'eur',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51OXlAIAZK57wNYnQJNfcmMNa4p9xI681KyECP5FC3n2GZ9bMcUo0dB7gVOwNeIIYkAuQbnI5pPGuOJNZxyMbySZd00naBObXrO'
    });
//   const { orderItems, totalPrice } = req.body;

//   // Validate order items
//   // if (!orderItems || orderItems.length === 0) {
//   //   res.status(400);
//   //   throw new Error('No order items');
//   // }
// console.log( totalPrice);

//   try {
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount:totalPrice, // Amount in cents
//       currency: 'usd', // Change to your currency
//       payment_method_types: ['card'],
//       // metadata: {
//       //   userId: req.user._id.toString(),
//       // },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error('Stripe Error:', error);
//     res.status(500);
//     throw new Error('Failed to create payment intent');
//   }
});

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    paymentResult,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Create new order
  const order = new Order({
    user: req.user._id,
    orderItems,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    paymentResult,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'id name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = {
  createPaymentIntent,
  addOrderItems,
  getMyOrders,
  getAllOrders,
};
