// src/screens/ProductHistoryPage.js

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Linking,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import api from '../services/api'; // Import the centralized API functions

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import CustomAlert from '../components/CustomAlert'; // Import CustomAlert

const { width, height } = Dimensions.get('window');

const ProductHistoryPage = () => {
  const navigation = useNavigation();

  // Access theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // State for orders
  const [orders, setOrders] = useState([]);

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for controlling the CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  // State for controlling the Receipt Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getMyOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err);
      setError(err.message);
      setAlertTitle('Error');
      setAlertMessage(err.message || 'Failed to fetch orders.');
      setAlertIcon('close-circle');
      setAlertButtons([
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates HTML content for the receipt based on order details.
   * @param {object} order - The selected order.
   * @returns {string} - HTML string representing the receipt.
   */
  const generateReceiptHTML = (order) => {
    const { _id, createdAt, status, orderItems, totalPrice, paymentMethod } = order;
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: ${currentTheme.primaryColor}; }
            .section { margin-top: 20px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: ${currentTheme.secondaryColor}; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
            .footer { margin-top: 20px; font-size: 14px; text-align: center; color: ${currentTheme.textColor}; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Receipt</h1>
          <div class="section">
            <div class="item"><span class="label">Order ID:</span><span>${_id}</span></div>
            <div class="item"><span class="label">Date:</span><span>${new Date(createdAt).toLocaleDateString()}</span></div>
            <div class="item"><span class="label">Status:</span><span>${capitalizeFirstLetter(status)}</span></div>
          </div>
          <div class="section">
            <div class="section-title">Items Purchased:</div>
            ${orderItems
              .map(
                (item, index) => `
              <div class="item">
                <span>${index + 1}. ${item.examName} (${item.subjectName})</span>
                <span>$${item.price.toFixed(2)}</span>
              </div>
            `
              )
              .join('')}
            <div class="total">Total Price: $${totalPrice.toFixed(2)}</div>
          </div>
          <div class="section">
            <div class="item"><span class="label">Payment Method:</span><span>${paymentMethod}</span></div>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
          </div>
        </body>
      </html>
    `;
  };

  /**
   * Handles generating and viewing the receipt PDF.
   * @param {object} order - The selected order.
   */
  const handleGenerateReceipt = async (order) => {
    try {
      const html = generateReceiptHTML(order);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to generate receipt.');
      setAlertIcon('close-circle');
      setAlertButtons([
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);
      setAlertVisible(true);
    }
  };

  /**
   * Handles generating and downloading the receipt PDF.
   * @param {object} order - The selected order.
   */
  const handleDownloadReceipt = async (order) => {
    try {
      const html = generateReceiptHTML(order);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      setAlertTitle('Error');
      setAlertMessage('Failed to download receipt.');
      setAlertIcon('close-circle');
      setAlertButtons([
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);
      setAlertVisible(true);
    }
  };

  const handleViewPDF = async (pdfLink) => {
    try {
      const supported = await Linking.canOpenURL(pdfLink);
      if (supported) {
        await Linking.openURL(pdfLink);
      } else {
        throw new Error('Cannot open the PDF link.');
      }
    } catch (error) {
      console.error('View PDF Error:', error);
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Failed to open PDF.');
      setAlertIcon('close-circle');
      setAlertButtons([
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);
      setAlertVisible(true);
    }
  };

  const handleDownloadPDF = async (pdfLink) => {
    try {
      const uri = pdfLink;
      const fileName = uri.split('/').pop();
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        FileSystem.documentDirectory + fileName
      );

      const { uri: localUri } = await downloadResumable.downloadAsync();
      await Sharing.shareAsync(localUri);
    } catch (error) {
      console.error('Download PDF Error:', error);
      setAlertTitle('Error');
      setAlertMessage(error.message || 'Failed to download PDF.');
      setAlertIcon('close-circle');
      setAlertButtons([
        {
          text: 'OK',
          onPress: () => setAlertVisible(false),
        },
      ]);
      setAlertVisible(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA726'; // Orange
      case 'completed':
        return '#66BB6A'; // Green
      case 'cancelled':
        return '#EF5350'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  /**
   * Opens the receipt modal with the selected order.
   * @param {object} order - The selected order.
   */
  const openReceiptModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  /**
   * Closes the receipt modal.
   */
  const closeReceiptModal = () => {
    setSelectedOrder(null);
    setModalVisible(false);
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderItem, { backgroundColor: currentTheme.cardBackground }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderDate, { color: currentTheme.textColor }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {capitalizeFirstLetter(item.status)}
        </Text>
      </View>
      <FlatList
        data={item.orderItems}
        keyExtractor={(orderItem) => orderItem.product._id}
        renderItem={({ item: orderItem }) => (
          <View style={styles.purchasedItem}>
            <Image source={{ uri: orderItem.image }} style={styles.purchasedItemImage} />
            <View style={styles.purchasedItemDetails}>
              <Text style={[styles.purchasedItemName, { color: currentTheme.cardTextColor }]}>
                {orderItem.examName}
              </Text>
              <Text style={[styles.purchasedItemSubtitle, { color: currentTheme.textColor }]}>
                {orderItem.subjectName} ({orderItem.subjectCode})
              </Text>
              <Text style={[styles.purchasedItemPrice, { color: currentTheme.priceColor }]}>
                ${orderItem.price.toFixed(2)}
              </Text>
              {/* Replaced Buttons with Icons */}
              <View style={styles.pdfIconsContainer}>
                {/* View PDF Icon */}
                <TouchableOpacity
                  onPress={() => handleViewPDF(orderItem.product.pdfLink)}
                  style={styles.pdfIconButton}
                  accessibilityLabel={`View PDF for ${orderItem.examName}`}
                  accessibilityRole="button"
                >
                  <Ionicons name="eye-outline" size={24} color={currentTheme.primaryColor} />
                </TouchableOpacity>
                {/* Download PDF Icon */}
                <TouchableOpacity
                  onPress={() => handleDownloadPDF(orderItem.product.pdfLink)}
                  style={styles.pdfIconButton}
                  accessibilityLabel={`Download PDF for ${orderItem.examName}`}
                  accessibilityRole="button"
                >
                  <Ionicons name="download-outline" size={24} color={currentTheme.primaryColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
      {/* View Receipt Button */}
      <TouchableOpacity
        style={styles.viewReceiptButton}
        onPress={() => openReceiptModal(item)}
        accessibilityLabel="View Receipt"
        accessibilityRole="button"
      >
        <Ionicons name="receipt-outline" size={20} color={currentTheme.primaryColor} />
        <Text style={[styles.viewReceiptText, { color: currentTheme.primaryColor }]}>
          View Receipt
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.backgroundColor }]}>
      <StatusBar
        backgroundColor={currentTheme.headerBackground[1]}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      {/* Enhanced Header */}
      <LinearGradient
        colors={currentTheme.headerBackground}
        style={styles.header}
        start={[0, 0]}
        end={[0, 1]} // Vertical gradient
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.headerTextColor} />
        </TouchableOpacity>

        {/* Header Title and Subtitle */}
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: currentTheme.headerTextColor }]}>
            Order History
          </Text>
          <Text style={[styles.headerSubtitle, { color: currentTheme.headerTextColor }]}>
            View your past purchases
          </Text>
        </View>
      </LinearGradient>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Ionicons name="time-outline" size={80} color={currentTheme.placeholderTextColor} />
              <Text style={[styles.loadingText, { color: currentTheme.textColor }]}>
                Loading your orders...
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cart-outline"
                size={80}
                color={currentTheme.placeholderTextColor}
              />
              <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
                You have no past orders.
              </Text>
            </View>
          )
        }
      />

      {/* Receipt Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeReceiptModal}
        transparent={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { backgroundColor: currentTheme.cardBackground }]}>
            {selectedOrder && (
              <>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
                    Receipt Details
                  </Text>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Order ID:
                    </Text>
                    <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                      {selectedOrder._id}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Date:
                    </Text>
                    <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Status:
                    </Text>
                    <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                      {capitalizeFirstLetter(selectedOrder.status)}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Items Purchased:
                    </Text>
                    {selectedOrder.orderItems.map((item, index) => (
                      <View key={item.product._id} style={styles.itemRow}>
                        <Text style={[styles.itemName, { color: currentTheme.textColor }]}>
                          {index + 1}. {item.examName} ({item.subjectName})
                        </Text>
                        <Text style={[styles.itemPrice, { color: currentTheme.textColor }]}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    style={[styles.separator, { borderBottomColor: currentTheme.borderColor }]}
                  />

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Total Price:
                    </Text>
                    <Text style={[styles.modalTotal, { color: currentTheme.priceColor }]}>
                      ${selectedOrder.totalPrice.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                      Payment Method:
                    </Text>
                    <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                      {selectedOrder.paymentMethod}
                    </Text>
                  </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: currentTheme.primaryColor },
                    ]}
                    onPress={() => handleGenerateReceipt(selectedOrder)}
                    accessibilityLabel="View Receipt PDF"
                    accessibilityRole="button"
                  >
                    <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.modalButtonText}>View Receipt PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: currentTheme.secondaryColor },
                    ]}
                    onPress={() => handleDownloadReceipt(selectedOrder)}
                    accessibilityLabel="Download Receipt PDF"
                    accessibilityRole="button"
                  >
                    <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.modalButtonText}>Download Receipt PDF</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: currentTheme.primaryColor },
                  ]}
                  onPress={closeReceiptModal}
                  accessibilityLabel="Close Receipt Modal"
                  accessibilityRole="button"
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* CustomAlert Component */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        icon={alertIcon}
        onClose={() => setAlertVisible(false)}
        buttons={alertButtons}
      />
    </SafeAreaView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Elevation for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 10,
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 20,
  },
  orderItem: {
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  purchasedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  purchasedItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  purchasedItemDetails: {
    flex: 1,
  },
  purchasedItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  purchasedItemSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  purchasedItemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  // New Styles for PDF Icons
  pdfIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  pdfIconButton: {
    marginLeft: 15,
    padding: 6,
  },
  // Existing styles (Retained for reference)
  pdfLinksContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  pdfButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  viewReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
  },
  viewReceiptText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 15,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android Shadow
    elevation: 5,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 16,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  separator: {
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  modalTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FF5252', // Red color for close button
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // New styles for modal buttons
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductHistoryPage;














// // PurchaseHistoryScreen.js

// import React, { useState, useContext, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   Dimensions,
//   Animated,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';

// const { width } = Dimensions.get('window');

// const PurchaseHistoryScreen = () => {
//   // Access navigation
//   const navigation = useNavigation();

//   // Access theme from context
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   // Sample data for purchases
//   const purchases = [
//     {
//       id: '1',
//       title: 'Premium Exam Package',
//       date: 'September 25, 2023',
//       amount: '$29.99',
//       image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
//       details: {
//         orderId: 'ORD123456',
//         items: [
//           { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
//           { name: 'Practice Tests', quantity: 1, price: '$10.00' },
//         ],
//         total: '$29.99',
//         paymentMethod: 'Credit Card',
//         billingAddress: '123 Main St, Anytown, USA',
//       },
//     },
//     {
//       id: '2',
//       title: 'Advanced Study Materials',
//       date: 'August 10, 2023',
//       amount: '$19.99',
//       image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
//       details: {
//         orderId: 'ORD789012',
//         items: [
//           { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
//         ],
//         total: '$19.99',
//         paymentMethod: 'PayPal',
//         billingAddress: '456 Elm St, Othertown, USA',
//       },
//     },
//     {
//         id: '1',
//         title: 'Premium Exam Package',
//         date: 'September 25, 2023',
//         amount: '$29.99',
//         image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
//         details: {
//           orderId: 'ORD123456',
//           items: [
//             { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
//             { name: 'Practice Tests', quantity: 1, price: '$10.00' },
//           ],
//           total: '$29.99',
//           paymentMethod: 'Credit Card',
//           billingAddress: '123 Main St, Anytown, USA',
//         },
//       },
//       {
//         id: '2',
//         title: 'Advanced Study Materials',
//         date: 'August 10, 2023',
//         amount: '$19.99',
//         image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
//         details: {
//           orderId: 'ORD789012',
//           items: [
//             { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
//           ],
//           total: '$19.99',
//           paymentMethod: 'PayPal',
//           billingAddress: '456 Elm St, Othertown, USA',
//         },
//       },
//       {
//         id: '1',
//         title: 'Premium Exam Package',
//         date: 'September 25, 2023',
//         amount: '$29.99',
//         image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
//         details: {
//           orderId: 'ORD123456',
//           items: [
//             { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
//             { name: 'Practice Tests', quantity: 1, price: '$10.00' },
//           ],
//           total: '$29.99',
//           paymentMethod: 'Credit Card',
//           billingAddress: '123 Main St, Anytown, USA',
//         },
//       },
//       {
//         id: '2',
//         title: 'Advanced Study Materials',
//         date: 'August 10, 2023',
//         amount: '$19.99',
//         image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
//         details: {
//           orderId: 'ORD789012',
//           items: [
//             { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
//           ],
//           total: '$19.99',
//           paymentMethod: 'PayPal',
//           billingAddress: '456 Elm St, Othertown, USA',
//         },
//       },
//       {
//         id: '1',
//         title: 'Premium Exam Package',
//         date: 'September 25, 2023',
//         amount: '$29.99',
//         image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
//         details: {
//           orderId: 'ORD123456',
//           items: [
//             { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
//             { name: 'Practice Tests', quantity: 1, price: '$10.00' },
//           ],
//           total: '$29.99',
//           paymentMethod: 'Credit Card',
//           billingAddress: '123 Main St, Anytown, USA',
//         },
//       },
//       {
//         id: '2',
//         title: 'Advanced Study Materials',
//         date: 'August 10, 2023',
//         amount: '$19.99',
//         image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
//         details: {
//           orderId: 'ORD789012',
//           items: [
//             { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
//           ],
//           total: '$19.99',
//           paymentMethod: 'PayPal',
//           billingAddress: '456 Elm St, Othertown, USA',
//         },
//       },
//   ];
//   const [selectedPurchase, setSelectedPurchase] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   // Animation references for the back button
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;
//   const colorAnim = useRef(new Animated.Value(0)).current;

//   // Interpolate rotation from 0deg to -20deg on press
//   const rotateInterpolate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '-20deg'],
//   });

//   // Interpolate color from arrowColor to secondaryColor on press
//   const colorInterpolate = colorAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [currentTheme.arrowColor, currentTheme.secondaryColor],
//   });

//   // Create Animated Ionicons component
//   const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

//   // Handlers for opening and closing the receipt modal
//   const openReceiptModal = (item) => {
//     setSelectedPurchase(item);
//     setModalVisible(true);
//   };

//   const closeReceiptModal = () => {
//     setSelectedPurchase(null);
//     setModalVisible(false);
//   };

//   // Animation handlers for the back button
//   const handlePressIn = () => {
//     // Animate to pressed state
//     Animated.parallel([
//       Animated.spring(scaleAnim, {
//         toValue: 0.9,
//         friction: 4,
//         useNativeDriver: true,
//       }),
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(colorAnim, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: false, // Color interpolation doesn't support native driver
//       }),
//     ]).start();
//   };

//   const handlePressOut = () => {
//     // Animate back to original state and navigate back
//     Animated.parallel([
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 4,
//         useNativeDriver: true,
//       }),
//       Animated.timing(rotateAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.timing(colorAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: false,
//       }),
//     ]).start(() => {
//       navigation.goBack();
//     });
//   };

//   // Render each purchase item
//   const renderPurchaseItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.purchaseItem, { backgroundColor: currentTheme.cardBackground }]}
//       onPress={() => openReceiptModal(item)}
//       accessibilityLabel={`View details for ${item.title}`}
//       accessibilityRole="button"
//     >
//       <Image source={{ uri: item.image }} style={styles.itemImage} />
//       <View style={styles.itemDetails}>
//         <Text style={[styles.itemTitle, { color: currentTheme.cardTextColor }]}>
//           {item.title}
//         </Text>
//         <Text style={[styles.itemDate, { color: currentTheme.textColor }]}>
//           {item.date}
//         </Text>
//         <Text style={[styles.itemAmount, { color: currentTheme.priceColor }]}>
//           {item.amount}
//         </Text>
//       </View>
//       <Ionicons
//         name="chevron-forward"
//         size={24}
//         color={currentTheme.placeholderTextColor}
//       />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
//       {/* Header Section */}
//       <LinearGradient
//         colors={currentTheme.headerBackground}
//         style={styles.header}
//         start={[0, 0]}
//         end={[0, 1]}
//       >
//         {/* Back Button with Animation */}
//         {/* <TouchableWithoutFeedback
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           accessibilityLabel="Go Back"
//           accessibilityRole="button"
//         >
//           <Animated.View
//             style={[
//               styles.backButton,
//               {
//                 transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
//                 // backgroundColor: currentTheme.headerBackground[0], // Use first color for back button background
//               },
//             ]}
//           >
//             <AnimatedIonicons name="arrow-back" size={24} color={colorInterpolate} />
//           </Animated.View>
//         </TouchableWithoutFeedback> */}

//         {/* Title */}
//         <Text style={[styles.title, { color: currentTheme.headerTextColor }]}>
//           Purchase History
//         </Text>
//       </LinearGradient>

//       {/* Purchase List */}
//       {purchases.length > 0 ? (
//         <FlatList
//           data={purchases}
//           keyExtractor={(item, index) => `${item.id}-${index}`}
//           renderItem={renderPurchaseItem}
//           contentContainerStyle={styles.listContent}
//           accessibilityLabel="Purchase List"
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="cart" size={80} color={currentTheme.placeholderTextColor} />
//           <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
//             You have no purchases yet.
//           </Text>
//         </View>
//       )}

//       {/* Receipt Modal */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={closeReceiptModal}
//         transparent={true}
//         accessibilityViewIsModal={true}
//       >
//         <View style={styles.modalBackground}>
//           <View
//             style={[styles.modalContainer, { backgroundColor: currentTheme.cardBackground }]}
//           >
//             {selectedPurchase && (
//               <>
//                 <ScrollView contentContainerStyle={styles.modalContent}>
//                   <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
//                     Receipt Details
//                   </Text>

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Order ID:
//                   </Text>
//                   <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
//                     {selectedPurchase.details.orderId}
//                   </Text>

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Date:
//                   </Text>
//                   <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
//                     {selectedPurchase.date}
//                   </Text>

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Items Purchased:
//                   </Text>
//                   {selectedPurchase.details.items.map((item, index) => (
//                     <View key={index} style={styles.itemRow}>
//                       <Text style={[styles.itemName, { color: currentTheme.textColor }]}>
//                         {item.name}
//                       </Text>
//                       <Text style={[styles.itemQuantity, { color: currentTheme.textColor }]}>
//                         Qty: {item.quantity}
//                       </Text>
//                       <Text style={[styles.itemPrice, { color: currentTheme.textColor }]}>
//                         {item.price}
//                       </Text>
//                     </View>
//                   ))}

//                   <View
//                     style={[styles.separator, { borderBottomColor: currentTheme.borderColor }]}
//                   />

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Total Amount:
//                   </Text>
//                   <Text style={[styles.modalTotal, { color: currentTheme.priceColor }]}>
//                     {selectedPurchase.details.total}
//                   </Text>

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Payment Method:
//                   </Text>
//                   <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
//                     {selectedPurchase.details.paymentMethod}
//                   </Text>

//                   <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
//                     Billing Address:
//                   </Text>
//                   <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
//                     {selectedPurchase.details.billingAddress}
//                   </Text>
//                 </ScrollView>

//                 <TouchableOpacity
//                   style={[
//                     styles.closeButton,
//                     { backgroundColor: currentTheme.primaryColor },
//                   ]}
//                   onPress={closeReceiptModal}
//                   accessibilityLabel="Close Receipt Modal"
//                   accessibilityRole="button"
//                 >
//                   <Text style={styles.closeButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// // Styles for the components
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center', // Added this line
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     padding: 8,
//     marginRight: 15,
//     borderRadius: 20, // Make it circular
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   purchaseItem: {
//     flexDirection: 'row',
//     borderRadius: 10,
//     marginBottom: 15,
//     padding: 15,
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   itemImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   itemDate: {
//     fontSize: 14,
//     marginVertical: 5,
//   },
//   itemAmount: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyText: {
//     fontSize: 18,
//     marginTop: 15,
//   },
//   // Modal styles
//   modalBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: width * 0.9,
//     borderRadius: 20,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalContent: {
//     paddingBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   modalLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   itemName: {
//     flex: 2,
//     fontSize: 16,
//   },
//   itemQuantity: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   itemPrice: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'right',
//   },
//   separator: {
//     borderBottomWidth: 1,
//     marginVertical: 15,
//   },
//   modalTotal: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   closeButton: {
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default PurchaseHistoryScreen;







