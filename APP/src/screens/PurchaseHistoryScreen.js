// PurchaseHistoryScreen.js

import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const { width } = Dimensions.get('window');

const PurchaseHistoryScreen = () => {
  // Access navigation
  const navigation = useNavigation();

  // Access theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Sample data for purchases
  const purchases = [
    {
      id: '1',
      title: 'Premium Exam Package',
      date: 'September 25, 2023',
      amount: '$29.99',
      image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
      details: {
        orderId: 'ORD123456',
        items: [
          { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
          { name: 'Practice Tests', quantity: 1, price: '$10.00' },
        ],
        total: '$29.99',
        paymentMethod: 'Credit Card',
        billingAddress: '123 Main St, Anytown, USA',
      },
    },
    {
      id: '2',
      title: 'Advanced Study Materials',
      date: 'August 10, 2023',
      amount: '$19.99',
      image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
      details: {
        orderId: 'ORD789012',
        items: [
          { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
        ],
        total: '$19.99',
        paymentMethod: 'PayPal',
        billingAddress: '456 Elm St, Othertown, USA',
      },
    },
    {
        id: '1',
        title: 'Premium Exam Package',
        date: 'September 25, 2023',
        amount: '$29.99',
        image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
        details: {
          orderId: 'ORD123456',
          items: [
            { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
            { name: 'Practice Tests', quantity: 1, price: '$10.00' },
          ],
          total: '$29.99',
          paymentMethod: 'Credit Card',
          billingAddress: '123 Main St, Anytown, USA',
        },
      },
      {
        id: '2',
        title: 'Advanced Study Materials',
        date: 'August 10, 2023',
        amount: '$19.99',
        image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
        details: {
          orderId: 'ORD789012',
          items: [
            { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
          ],
          total: '$19.99',
          paymentMethod: 'PayPal',
          billingAddress: '456 Elm St, Othertown, USA',
        },
      },
      {
        id: '1',
        title: 'Premium Exam Package',
        date: 'September 25, 2023',
        amount: '$29.99',
        image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
        details: {
          orderId: 'ORD123456',
          items: [
            { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
            { name: 'Practice Tests', quantity: 1, price: '$10.00' },
          ],
          total: '$29.99',
          paymentMethod: 'Credit Card',
          billingAddress: '123 Main St, Anytown, USA',
        },
      },
      {
        id: '2',
        title: 'Advanced Study Materials',
        date: 'August 10, 2023',
        amount: '$19.99',
        image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
        details: {
          orderId: 'ORD789012',
          items: [
            { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
          ],
          total: '$19.99',
          paymentMethod: 'PayPal',
          billingAddress: '456 Elm St, Othertown, USA',
        },
      },
      {
        id: '1',
        title: 'Premium Exam Package',
        date: 'September 25, 2023',
        amount: '$29.99',
        image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
        details: {
          orderId: 'ORD123456',
          items: [
            { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
            { name: 'Practice Tests', quantity: 1, price: '$10.00' },
          ],
          total: '$29.99',
          paymentMethod: 'Credit Card',
          billingAddress: '123 Main St, Anytown, USA',
        },
      },
      {
        id: '2',
        title: 'Advanced Study Materials',
        date: 'August 10, 2023',
        amount: '$19.99',
        image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
        details: {
          orderId: 'ORD789012',
          items: [
            { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
          ],
          total: '$19.99',
          paymentMethod: 'PayPal',
          billingAddress: '456 Elm St, Othertown, USA',
        },
      },
  ];
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation references for the back button
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Interpolate rotation from 0deg to -20deg on press
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-20deg'],
  });

  // Interpolate color from arrowColor to secondaryColor on press
  const colorInterpolate = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [currentTheme.arrowColor, currentTheme.secondaryColor],
  });

  // Create Animated Ionicons component
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

  // Handlers for opening and closing the receipt modal
  const openReceiptModal = (item) => {
    setSelectedPurchase(item);
    setModalVisible(true);
  };

  const closeReceiptModal = () => {
    setSelectedPurchase(null);
    setModalVisible(false);
  };

  // Animation handlers for the back button
  const handlePressIn = () => {
    // Animate to pressed state
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false, // Color interpolation doesn't support native driver
      }),
    ]).start();
  };

  const handlePressOut = () => {
    // Animate back to original state and navigate back
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  // Render each purchase item
  const renderPurchaseItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.purchaseItem, { backgroundColor: currentTheme.cardBackground }]}
      onPress={() => openReceiptModal(item)}
      accessibilityLabel={`View details for ${item.title}`}
      accessibilityRole="button"
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: currentTheme.cardTextColor }]}>
          {item.title}
        </Text>
        <Text style={[styles.itemDate, { color: currentTheme.textColor }]}>
          {item.date}
        </Text>
        <Text style={[styles.itemAmount, { color: currentTheme.priceColor }]}>
          {item.amount}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={currentTheme.placeholderTextColor}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      {/* Header Section */}
      <LinearGradient
        colors={currentTheme.headerBackground}
        style={styles.header}
        start={[0, 0]}
        end={[0, 1]}
      >
        {/* Back Button with Animation */}
        {/* <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel="Go Back"
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              styles.backButton,
              {
                transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
                // backgroundColor: currentTheme.headerBackground[0], // Use first color for back button background
              },
            ]}
          >
            <AnimatedIonicons name="arrow-back" size={24} color={colorInterpolate} />
          </Animated.View>
        </TouchableWithoutFeedback> */}

        {/* Title */}
        <Text style={[styles.title, { color: currentTheme.headerTextColor }]}>
          Purchase History
        </Text>
      </LinearGradient>

      {/* Purchase List */}
      {purchases.length > 0 ? (
        <FlatList
          data={purchases}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderPurchaseItem}
          contentContainerStyle={styles.listContent}
          accessibilityLabel="Purchase List"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart" size={80} color={currentTheme.placeholderTextColor} />
          <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
            You have no purchases yet.
          </Text>
        </View>
      )}

      {/* Receipt Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeReceiptModal}
        transparent={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalBackground}>
          <View
            style={[styles.modalContainer, { backgroundColor: currentTheme.cardBackground }]}
          >
            {selectedPurchase && (
              <>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
                    Receipt Details
                  </Text>

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Order ID:
                  </Text>
                  <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                    {selectedPurchase.details.orderId}
                  </Text>

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Date:
                  </Text>
                  <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                    {selectedPurchase.date}
                  </Text>

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Items Purchased:
                  </Text>
                  {selectedPurchase.details.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={[styles.itemName, { color: currentTheme.textColor }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemQuantity, { color: currentTheme.textColor }]}>
                        Qty: {item.quantity}
                      </Text>
                      <Text style={[styles.itemPrice, { color: currentTheme.textColor }]}>
                        {item.price}
                      </Text>
                    </View>
                  ))}

                  <View
                    style={[styles.separator, { borderBottomColor: currentTheme.borderColor }]}
                  />

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Total Amount:
                  </Text>
                  <Text style={[styles.modalTotal, { color: currentTheme.priceColor }]}>
                    {selectedPurchase.details.total}
                  </Text>

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Payment Method:
                  </Text>
                  <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                    {selectedPurchase.details.paymentMethod}
                  </Text>

                  <Text style={[styles.modalLabel, { color: currentTheme.secondaryColor }]}>
                    Billing Address:
                  </Text>
                  <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                    {selectedPurchase.details.billingAddress}
                  </Text>
                </ScrollView>

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
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Added this line
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 15,
    borderRadius: 20, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  purchaseItem: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 14,
    marginVertical: 5,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
  },
  itemQuantity: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
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
    marginBottom: 5,
  },
  closeButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PurchaseHistoryScreen;








// // PurchaseHistoryScreen.js

// import React, { useState, useContext } from 'react';
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
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';

// const { width } = Dimensions.get('window');

// const PurchaseHistoryScreen = () => {
//   // Get theme from context
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   // Sample data for purchases
  // const purchases = [
  //   {
  //     id: '1',
  //     title: 'Premium Exam Package',
  //     date: 'September 25, 2023',
  //     amount: '$29.99',
  //     image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
  //     details: {
  //       orderId: 'ORD123456',
  //       items: [
  //         { name: 'Exam Prep Guide', quantity: 1, price: '$19.99' },
  //         { name: 'Practice Tests', quantity: 1, price: '$10.00' },
  //       ],
  //       total: '$29.99',
  //       paymentMethod: 'Credit Card',
  //       billingAddress: '123 Main St, Anytown, USA',
  //     },
  //   },
  //   {
  //     id: '2',
  //     title: 'Advanced Study Materials',
  //     date: 'August 10, 2023',
  //     amount: '$19.99',
  //     image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
  //     details: {
  //       orderId: 'ORD789012',
  //       items: [
  //         { name: 'Advanced Topics eBook', quantity: 1, price: '$19.99' },
  //       ],
  //       total: '$19.99',
  //       paymentMethod: 'PayPal',
  //       billingAddress: '456 Elm St, Othertown, USA',
  //     },
  //   },
  //   {
  //       id: '1',
  //       title: 'Premium Exam Package',
  //       date: 'September 25, 2023',
  //       amount: '$29.99',
  //       image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149267342.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
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
  //       image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
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
  //       id: '1',
  //       title: 'Premium Exam Package',
  //       date: 'September 25, 2023',
  //       amount: '$29.99',
  //       image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
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
  //       image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
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
  //       id: '1',
  //       title: 'Premium Exam Package',
  //       date: 'September 25, 2023',
  //       amount: '$29.99',
  //       image: 'https://img.freepik.com/free-vector/realistic-national-science-day-vertical-poster-template_23-2149274572.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid', // Replace with actual image URLs
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
  //       image: 'https://img.freepik.com/free-vector/gradient-national-science-day-vertical-poster-template_23-2149252941.jpg?ga=GA1.1.1138185763.1729721443&semt=ais_hybrid',
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
  // ];

//   const [selectedPurchase, setSelectedPurchase] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);

//   const openReceiptModal = (item) => {
//     setSelectedPurchase(item);
//     setModalVisible(true);
//   };

//   const closeReceiptModal = () => {
//     setSelectedPurchase(null);
//     setModalVisible(false);
//   };

//   const renderPurchaseItem = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.purchaseItem, { backgroundColor: currentTheme.cardBackground }]}
//       onPress={() => openReceiptModal(item)}
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
//       <Text style={[styles.title, { color: currentTheme.textColor }]}>
//         Purchase History
//       </Text>
//       {/* <div className='text-red-800 text-lg'>tessssss</div> */}
//       {purchases.length > 0 ? (
//         <FlatList
//           data={purchases}
//           keyExtractor={(item, index) => item.id + index.toString()}
//           renderItem={renderPurchaseItem}
//           contentContainerStyle={styles.listContent}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     alignSelf: 'center',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   purchaseItem: {
//     flexDirection: 'row',
//     borderRadius: 10,
//     marginBottom: 15,
//     padding: 15,
//     alignItems: 'center',
//     elevation: 3,
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
