// src/screens/ProductPage.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import ReviewPopup from '../components/ReviewPopup'; // Import the ReviewPopup component
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { CartContext } from '../contexts/CartContext'; // Corrected path


const { width } = Dimensions.get('window');

const ProductPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [isReviewPopupVisible, setReviewPopupVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { cartItems, addToCart } = useContext(CartContext);

  // Get theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const openReviewPopup = () => {
    setReviewPopupVisible(true);
  };

  const closeReviewPopup = () => {
    setReviewPopupVisible(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (item) => {
    const added = addToCart(item);
    if (added) {
      Alert.alert('Success', `${item.name} has been added to your cart.`);
    } else {
      Alert.alert('Info', `${item.name} is already in your cart.`);
    }
  };


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.backgroundColor }]}>
      <StatusBar
        backgroundColor={currentTheme.headerBackground[1]}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      {/* Header */}
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
          <Ionicons name="arrow-back" size={28} color={currentTheme.headerTextColor} />
        </TouchableOpacity>

        {/* Header Title */}
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: currentTheme.headerTextColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: currentTheme.headerTextColor }]}>
            {item.subjectName} ({item.subjectCode})
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#E91E63' : currentTheme.placeholderTextColor}
            />
          </TouchableOpacity>
        </View>

        {/* Product Details */}
        <View style={[styles.detailsContainer, { backgroundColor: currentTheme.cardBackground }]}>
          <Text style={[styles.productTitle, { color: currentTheme.cardTextColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.productSubtitle, { color: currentTheme.textColor }]}>
            {item.subjectName} ({item.subjectCode})
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <Ionicons
                key={index}
                name={index < Math.floor(item.rating) ? 'star' : 'star-outline'}
                size={20}
                color="#FFD700"
              />
            ))}
            <TouchableOpacity onPress={openReviewPopup}>
              <Text style={[styles.reviewCount, { color: currentTheme.secondaryColor }]}>
                {' '}
                ({item.reviews} reviews)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <Text style={[styles.productPrice, { color: currentTheme.priceColor }]}>
            ${item.price}
          </Text>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
            Description
          </Text>
          <Text style={[styles.productDescription, { color: currentTheme.textColor }]}>
            {item.description}
          </Text>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: currentTheme.primaryColor }]}
            onPress={() => handleAddToCart(item)}
            accessibilityLabel="Add to Cart"
            accessibilityRole="button"
          >
            <MaterialIcons name="add-shopping-cart" size={24} color="#FFFFFF" />
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Review Popup */}
        <Modal
          visible={isReviewPopupVisible}
          animationType="slide"
          onRequestClose={closeReviewPopup}
          transparent={true}
        >
          <ReviewPopup closePopup={closeReviewPopup} productId={item.id} />
        </Modal>
      </ScrollView>
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
    // borderRadius: 20, // Make it circular
    // backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background
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
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFFAA',
    borderRadius: 30,
    padding: 8,
  },
  detailsContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
  },
  productSubtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewCount: {
    fontSize: 16,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
  },
  addToCartButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});


export default ProductPage;
