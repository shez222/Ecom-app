// components/ReviewPopup.js

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Placeholder avatar image
const placeholderAvatar =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const ReviewPopup = ({ closePopup, productId }) => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Sample reviews data
  const reviews = [
    {
      id: '1',
      userName: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      comment: 'This course was extremely helpful and well-structured.',
      date: 'September 20, 2023',
    },
    {
      id: '2',
      userName: 'Bob Smith',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 4,
      comment: 'Great content, but the pace was a bit fast for beginners.',
      date: 'October 5, 2023',
    },
    {
      id: '3',
      userName: 'Carol Williams',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 5,
      comment: 'Excellent explanations and practical examples.',
      date: 'November 12, 2023',
    },
    // Add more reviews as needed
  ];

  // Render individual review item
  const renderReview = (review) => {
    return (
      <View key={review.id}  style={[styles.reviewItem, { backgroundColor: currentTheme.backgroundColor }]}>
        <View style={styles.reviewHeader}>
          <Image
            source={{ uri: review.avatar || placeholderAvatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: currentTheme.textColor }]}>
              {review.userName}
            </Text>
            <View style={styles.ratingContainer}>
              {Array.from({ length: 5 }, (_, index) => (
                <Ionicons
                  key={index}
                  name={
                    index < Math.floor(review.rating) ? 'star' : 'star-outline'
                  }
                  size={16}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        </View>
        <Text style={[styles.reviewDate, { color: currentTheme.placeholderTextColor }]}>
          {review.date}
        </Text>
        <Text style={[styles.reviewComment, { color: currentTheme.textColor }]}>
          {review.comment}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: currentTheme.cardBackground },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={styles.topRightCloseButton}
            onPress={closePopup}
            accessibilityLabel="Close Reviews"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color={currentTheme.textColor} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
              Reviews
            </Text>
            {reviews.length > 0 ? (
              reviews.map(renderReview)
            ) : (
              <Text style={[styles.noReviewsText, { color: currentTheme.textColor }]}>
                No reviews yet. Be the first to review!
              </Text>
            )}
          </ScrollView>

          {/* Optional: Add Review Button */}
          <TouchableOpacity
            style={[
              styles.addReviewButton,
              { backgroundColor: currentTheme.primaryColor },
            ]}
            onPress={() => {
              // Implement add review functionality or navigate to a review form
              Alert.alert('Feature Coming Soon', 'You can add a review shortly.');
            }}
            accessibilityLabel="Add a Review"
            accessibilityRole="button"
          >
            <Ionicons name="star" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.addReviewButtonText}>Add a Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles for the ReviewPopup component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    padding: 20,
    position: 'relative', // To position the close button
  },
  topRightCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background
    zIndex: 1, // Ensure it's above other elements
  },
  modalContent: {
    paddingTop: 20, // To prevent content from being hidden behind the close button
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  reviewItem: {
    // backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  noReviewsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
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
  addReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewPopup;
