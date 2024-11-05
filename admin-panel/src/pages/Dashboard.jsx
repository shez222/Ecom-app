// src/pages/Dashboard.jsx
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchUsers,
} from '../redux/slices/usersSlice';
import {
  fetchProducts,
} from '../redux/slices/productsSlice';
import {
  fetchOrders,
} from '../redux/slices/ordersSlice';
import {
  fetchReviews,
} from '../redux/slices/reviewsSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { FaUsers, FaBoxOpen, FaClipboardList, FaStar, FaDollarSign } from 'react-icons/fa';
// If you plan to use tables, consider importing components or use HTML tables

const Dashboard = () => {
  const dispatch = useDispatch();
  // const { users } = useSelector((state) => state.users);
  // const { products } = useSelector((state) => state.products);
  // const { orders } = useSelector((state) => state.orders);
  // const { reviews } = useSelector((state) => state.reviews);

  // Dummy data for summary cards
  const usersCount = 1200;
  const productsCount = 450;
  const ordersCount = 3200;
  const reviewsCount = 860;

  // Dummy data for Orders per Month
  const orderData = [
    { month: 'Jan', orders: 300 },
    { month: 'Feb', orders: 450 },
    { month: 'Mar', orders: 600 },
    { month: 'Apr', orders: 750 },
    { month: 'May', orders: 900 },
    { month: 'Jun', orders: 1200 },
    { month: 'Jul', orders: 1500 },
    { month: 'Aug', orders: 1300 },
    { month: 'Sep', orders: 1100 },
    { month: 'Oct', orders: 1600 },
    { month: 'Nov', orders: 1700 },
    { month: 'Dec', orders: 2000 },
  ];

  // Dummy data for Reviews Approval Status
  const reviewData = [
    { name: 'Approved', value: 500 },
    { name: 'Pending', value: 360 },
  ];

  const COLORS = ['#4CAF50', '#FF9800'];

  // Dummy data for Revenue Trends
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 7000 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 8000 },
    { month: 'Jul', revenue: 9000 },
    { month: 'Aug', revenue: 8500 },
    { month: 'Sep', revenue: 7800 },
    { month: 'Oct', revenue: 9200 },
    { month: 'Nov', revenue: 10000 },
    { month: 'Dec', revenue: 12000 },
  ];

  // Dummy data for Recent Orders
  const recentOrders = [
    { id: 'ORD12345', customer: 'John Doe', total: 250, status: 'Completed' },
    { id: 'ORD12346', customer: 'Jane Smith', total: 150, status: 'Pending' },
    { id: 'ORD12347', customer: 'Alice Johnson', total: 300, status: 'Completed' },
    { id: 'ORD12348', customer: 'Bob Brown', total: 200, status: 'Pending' },
  ];

  // Dummy data for Recent Reviews
  const recentReviews = [
    { id: 'REV12345', product: 'Wireless Mouse', rating: 5, approved: true },
    { id: 'REV12346', product: 'Bluetooth Headphones', rating: 4, approved: false },
    { id: 'REV12347', product: 'Gaming Keyboard', rating: 5, approved: true },
    { id: 'REV12348', product: 'HD Monitor', rating: 3, approved: false },
  ];

  useEffect(() => {
    // Commenting out backend dispatches since backend is not connected
    // dispatch(fetchUsers());
    // dispatch(fetchProducts());
    // dispatch(fetchOrders());
    // dispatch(fetchReviews());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Dashboard Title */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaUsers className="h-12 w-12 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Users</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{usersCount}</p>
          </div>
        </div>

        {/* Products Card */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaBoxOpen className="h-12 w-12 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Products</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{productsCount}</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaClipboardList className="h-12 w-12 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{ordersCount}</p>
          </div>
        </div>

        {/* Reviews Card */}
        <div className="flex items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <FaStar className="h-12 w-12 text-pink-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Reviews</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">{reviewsCount}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Per Month Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Orders Per Month</h3>
          {orderData && orderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No data available.</p>
          )}
        </div>

        {/* Reviews Approval Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reviews Approval Status</h3>
          {reviewData && reviewData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reviewData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">No data available.</p>
          )}
        </div>
      </div>

      {/* Revenue Trends Line Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Trends</h3>
        {/* Sample Revenue Data */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Orders</h3>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No recent orders available.</p>
        )}
      </div>

      {/* Recent Reviews Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Reviews</h3>
        {recentReviews && recentReviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Review ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentReviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{review.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{review.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{review.rating} ⭐</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          review.approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No recent reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
