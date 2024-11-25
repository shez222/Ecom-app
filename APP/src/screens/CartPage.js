// src/screens/CartPage.js

import React, { useContext, useEffect, useState } from 'react'; // Added useState
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
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { CartContext } from '../contexts/CartContext';

import { useStripe } from '@stripe/stripe-react-native'; // Import Stripe hook

const { width, height } = Dimensions.get('window');

const CartPage = () => {
  const navigation = useNavigation();

  // Access theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Access cart context
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  // Calculate total price
  const totalPrice = cartItems
    .reduce((sum, item) => sum + parseFloat(item.price), 0)
    .toFixed(2);

  // Stripe hook
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // Hide the default header provided by React Navigation
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fetch Payment Intent client secret from backend
  const fetchPaymentIntent = async () => {
    try {
      const response = await fetch('http://your-backend-url/create-payment-intent', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(totalPrice) * 100, // Convert to cents
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Error', 'Failed to initiate payment.');
      return null;
    }
  };

  const handleCheckout = async () => {
    setLoading(true);

    const clientSecret = await fetchPaymentIntent();

    if (!clientSecret) {
      setLoading(false);
      return;
    }

    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Your App Name', // Replace with your app or business name
    });

    if (initError) {
      console.error('Error initializing payment sheet:', initError);
      Alert.alert('Error', initError.message);
      setLoading(false);
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert('Payment Failed', paymentError.message);
    } else {
      Alert.alert('Payment Successful', 'Your payment was successful!');
      clearCart(); // Clear cart after successful payment
      navigation.navigate('MarketPage'); // Adjust navigation as needed
    }

    setLoading(false);
  };

  // Render individual cart item
  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: currentTheme.cardBackground }]}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={[styles.cartItemName, { color: currentTheme.cardTextColor }]}>
          {item.examName}
        </Text>
        <Text style={[styles.cartItemSubtitle, { color: currentTheme.textColor }]}>
          {item.subjectName} ({item.subjectCode})
        </Text>

        <View style={styles.cartItemFooter}>
          <Text style={[styles.cartItemPrice, { color: currentTheme.priceColor }]}>
            ${item.price}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeFromCart(item._id)}
        accessibilityLabel={`Remove ${item.examName} from cart`}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={24} color="#E53935" />
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
        end={[0, 1]} // Horizontal gradient
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
            Your Cart
          </Text>
          <Text style={[styles.headerSubtitle, { color: currentTheme.headerTextColor }]}>
            Review your selected items
          </Text>
        </View>
      </LinearGradient>

      {/* Cart Items List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="cart-outline"
              size={80}
              color={currentTheme.placeholderTextColor}
            />
            <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
              Your cart is empty.
            </Text>
          </View>
        }
      />

      {/* Total and Checkout */}
      {cartItems.length > 0 && (
        <View style={[styles.footer, { borderTopColor: currentTheme.borderColor }]}>
          <Text style={[styles.totalText, { color: currentTheme.textColor }]}>
            Total: <Text style={{ color: currentTheme.priceColor }}>${totalPrice}</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: currentTheme.primaryColor },
              loading && styles.disabledButton, // Disable button when loading
            ]}
            onPress={handleCheckout}
            accessibilityLabel="Proceed to Checkout"
            accessibilityRole="button"
            disabled={loading} // Disable button when loading
          >
            <Text style={[styles.checkoutButtonText, { color: '#FFFFFF' }]}>
              {loading ? 'Processing...' : 'Checkout'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 100, // To ensure content is not hidden behind footer
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    padding: 15,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CartPage;




















// // src/screens/CartPage.js

// import React, { useContext, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';
// import { CartContext } from '../contexts/CartContext'; // Corrected path

// const { width, height } = Dimensions.get('window');

// const CartPage = () => {
//   const navigation = useNavigation();

//   // Access theme from context
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   // Access cart context
//   const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

//   // Calculate total price
//   const totalPrice = cartItems
//     .reduce((sum, item) => sum + parseFloat(item.price), 0)
//     .toFixed(2);

//   // Hide the default header provided by React Navigation
//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   }, [navigation]);

//   // Render individual cart item
//   const renderItem = ({ item }) => (
//     <View style={[styles.cartItem, { backgroundColor: currentTheme.cardBackground }]}>
//       <Image source={{ uri: item.image }} style={styles.cartItemImage} />
//       <View style={styles.cartItemDetails}>
//         <Text style={[styles.cartItemName, { color: currentTheme.cardTextColor }]}>
//           {item.examName}
//         </Text>
//         <Text style={[styles.cartItemSubtitle, { color: currentTheme.textColor }]}>
//           {item.subjectName} ({item.subjectCode})
//         </Text>

//         <View style={styles.cartItemFooter}>
//           <Text style={[styles.cartItemPrice, { color: currentTheme.priceColor }]}>
//             ${item.price}
//           </Text>
//         </View>
//       </View>
//       <TouchableOpacity
//         onPress={() => removeFromCart(item._id)}
//         accessibilityLabel={`Remove ${item.examName} from cart`}
//         accessibilityRole="button"
//       >
//         <Ionicons name="trash-outline" size={24} color="#E53935" />
//       </TouchableOpacity>
//     </View>
//   );

//   const handleCheckout = () => {
//     // Implement your checkout functionality here
//     console.log('Checkout:', cartItems);
    
//     Alert.alert('Checkout', `Total Price: $${totalPrice}`);
//     // After checkout, you might want to clear the cart
//     clearCart();
//     navigation.navigate('MarketPage'); // Adjust navigation as needed
//   };

//   return (
//     <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.backgroundColor }]}>
//       <StatusBar
//         backgroundColor={currentTheme.headerBackground[1]}
//         barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
//       />
//       {/* Enhanced Header */}
//       <LinearGradient
//         colors={currentTheme.headerBackground}
//         style={styles.header}
//         start={[0, 0]}
//         end={[0, 1]} // Horizontal gradient
//       >
//         {/* Back Button */}
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//           accessibilityLabel="Go Back"
//           accessibilityRole="button"
//         >
//           <Ionicons name="arrow-back" size={24} color={currentTheme.headerTextColor} />
//         </TouchableOpacity>

//         {/* Header Title and Subtitle */}
//         <View style={styles.headerTitleContainer}>
//           <Text style={[styles.headerTitle, { color: currentTheme.headerTextColor }]}>
//             Your Cart
//           </Text>
//           <Text style={[styles.headerSubtitle, { color: currentTheme.headerTextColor }]}>
//             Review your selected items
//           </Text>
//         </View>
//       </LinearGradient>

//       {/* Cart Items List */}
//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons
//               name="cart-outline"
//               size={80}
//               color={currentTheme.placeholderTextColor}
//             />
//             <Text style={[styles.emptyText, { color: currentTheme.textColor }]}>
//               Your cart is empty.
//             </Text>
//           </View>
//         }
//       />

//       {/* Total and Checkout */}
//       {cartItems.length > 0 && (
//         <View style={[styles.footer, { borderTopColor: currentTheme.borderColor }]}>
//           <Text style={[styles.totalText, { color: currentTheme.textColor }]}>
//             Total: <Text style={{ color: currentTheme.priceColor }}>${totalPrice}</Text>
//           </Text>
//           <TouchableOpacity
//             style={[styles.checkoutButton, { backgroundColor: currentTheme.primaryColor }]}
//             onPress={handleCheckout}
//             accessibilityLabel="Proceed to Checkout"
//             accessibilityRole="button"
//           >
//             <Text style={[styles.checkoutButtonText, { color: '#FFFFFF' }]}>
//               Checkout
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// // Styles for the components
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     width: '100%',
//     paddingVertical: 5,
//     paddingHorizontal: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     // Elevation for Android
//     elevation: 4,
//     // Shadow for iOS
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   backButton: {
//     position: 'absolute',
//     left: 15,
//     top: 10,
//     padding: 8,

//   },
//   headerTitleContainer: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     fontWeight: '400',
//     marginTop: 4,
//   },
//   listContent: {
//     padding: 20,
//     paddingBottom: 100, // To ensure content is not hidden behind footer
//   },
//   cartItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   cartItemImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   cartItemDetails: {
//     flex: 1,
//   },
//   cartItemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cartItemSubtitle: {
//     fontSize: 14,
//     color: '#757575',
//   },
//   cartItemFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   cartItemPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     padding: 15,
//     borderTopWidth: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   checkoutButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//   },
//   checkoutButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     fontSize: 18,
//     marginTop: 15,
//   },
// });

// export default CartPage;
