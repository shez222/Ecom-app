// UserProfileScreen.js

import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const { width } = Dimensions.get('window');

const UserProfileScreen = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage:
      'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
    coverImage:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  };

  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const navigation = useNavigation();

  const handleEditProfile = () => {
    // Navigate to Edit Profile screen or open modal
    navigation.navigate('EditProfile'); // Ensure 'EditProfile' is defined in your navigation stack
  };

  // Handler for back button press
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Helper function to render info items
  const renderInfoItem = (iconName, text) => (
    <View style={styles.infoItem}>
      <Ionicons
        name={iconName}
        size={20}
        color={currentTheme.primaryColor}
        style={styles.infoIcon}
      />
      <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
        {text}
      </Text>
    </View>
  );

  // Helper function to render setting items
  const renderSettingItem = (iconName, text, onPress) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      accessibilityLabel={text}
      accessibilityRole="button"
    >
      <Ionicons
        name={iconName}
        size={20}
        color={currentTheme.primaryColor}
        style={styles.infoIcon}
      />
      <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
        {text}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={currentTheme.placeholderTextColor}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Header Section with Cover Image and Back Button */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: user.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
          accessibilityLabel={`${user.name}'s cover image`}
        />
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          accessibilityLabel="Go Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.headerTextColor} />
        </TouchableOpacity>
      </View>

      {/* User Profile Info */}
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: user.profileImage }}
          style={[
            styles.profileImage,
            { borderColor: currentTheme.borderColor },
          ]}
          accessibilityLabel={`${user.name}'s profile picture`}
          onError={(e) => {
            console.log(`Failed to load profile image for ${user.name}:`, e.nativeEvent.error);
          }}
        />
        <Text style={[styles.userName, { color: currentTheme.textColor }]}>
          {user.name}
        </Text>
        <Text style={[styles.userEmail, { color: currentTheme.textColor }]}>
          {user.email}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          accessibilityLabel="Edit Profile"
          accessibilityRole="button"
        >
          <Ionicons name="pencil" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
            12
          </Text>
          <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
            Purchases
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
            5
          </Text>
          <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
            Favorites
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
            8
          </Text>
          <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
            Reviews
          </Text>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
          Personal Information
        </Text>
        {renderInfoItem('call', '+1 (555) 123-4567')}
        {renderInfoItem('location', '123 Main St, Anytown, USA')}
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
          Account Settings
        </Text>
        {renderSettingItem('key', 'Change Password', () => {
          // Navigate to Change Password screen or open modal
          navigation.navigate('ChangePassword'); // Ensure 'ChangePassword' is defined in your navigation stack
        })}
        {renderSettingItem('notifications', 'Notification Settings', () => {
          // Navigate to Notification Settings screen or toggle settings
          navigation.navigate('NotificationSettings'); // Ensure 'NotificationSettings' is defined in your navigation stack
        })}
      </View>
    </ScrollView>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, // Adjust for status bar
    left: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // Optional: Increase touchable area
    // You can wrap Ionicons in a View with padding if needed
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: -60, // To overlap the profile image on the cover image
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#ccc', // Placeholder background color
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#00796B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  infoIcon: {
    marginRight: 15,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
});

export default UserProfileScreen;










// // UserProfileScreen.js

// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';

// const UserProfileScreen = () => {
//   const user = {
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     profileImage:
//       'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
//   };

//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   const handleEditProfile = () => {
//     // Navigate to Edit Profile screen or open modal
//   };

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}
//     >
//       <LinearGradient
//         colors={currentTheme.headerBackground}
//         style={styles.profileHeader}
//       >
//         <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
//         <Text style={[styles.userName, { color: currentTheme.headerTextColor }]}>
//           {user.name}
//         </Text>
//         <Text style={[styles.userEmail, { color: currentTheme.headerTextColor }]}>
//           {user.email}
//         </Text>
//         <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
//           <Ionicons name="pencil" size={20} color="#FFFFFF" />
//           <Text style={styles.editButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//       </LinearGradient>

//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
//             12
//           </Text>
//           <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
//             Purchases
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
//             5
//           </Text>
//           <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
//             Favorites
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
//             8
//           </Text>
//           <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
//             Reviews
//           </Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
//           Personal Information
//         </Text>
//         <View style={styles.infoItem}>
//           <Ionicons
//             name="call"
//             size={20}
//             color={currentTheme.primaryColor}
//             style={styles.infoIcon}
//           />
//           <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//             +1 (555) 123-4567
//           </Text>
//         </View>
//         <View style={styles.infoItem}>
//           <Ionicons
//             name="location"
//             size={20}
//             color={currentTheme.primaryColor}
//             style={styles.infoIcon}
//           />
//           <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//             123 Main St, Anytown, USA
//           </Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
//           Account Settings
//         </Text>
//         <TouchableOpacity style={styles.settingItem}>
//           <Ionicons
//             name="key"
//             size={20}
//             color={currentTheme.primaryColor}
//             style={styles.infoIcon}
//           />
//           <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//             Change Password
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.settingItem}>
//           <Ionicons
//             name="notifications"
//             size={20}
//             color={currentTheme.primaryColor}
//             style={styles.infoIcon}
//           />
//           <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//             Notification Settings
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   profileHeader: {
//     paddingBottom: 20,
//     paddingTop: 40,
//     alignItems: 'center',
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#FFFFFF',
//     marginBottom: 10,
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   userEmail: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   editButton: {
//     flexDirection: 'row',
//     backgroundColor: '#00796B',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   editButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     marginLeft: 5,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   statLabel: {
//     fontSize: 14,
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   infoIcon: {
//     marginRight: 15,
//   },
//   infoText: {
//     fontSize: 16,
//   },
// });

// export default UserProfileScreen;
