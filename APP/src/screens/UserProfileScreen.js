// src/screens/UserProfileScreen.js

import React, { useContext, useState } from 'react';
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
import EditProfilePopup from '../components/EditProfilePopup';
import CustomAlert from '../components/CustomAlert'; // Import CustomAlert

const { width } = Dimensions.get('window');

const UserProfileScreen = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    profileImage:
      'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
    coverImage:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    favoritesCount: 5,
    reviewsCount: 8,
  });

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);

  // State for controlling the CustomAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertIcon, setAlertIcon] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const navigation = useNavigation();

  const handleEditProfile = () => {
    setEditProfileVisible(true);
  };

  const handleSaveProfile = (updatedData) => {
    setUser(updatedData);
    setAlertTitle('Profile Updated');
    setAlertMessage('Your profile has been updated successfully.');
    setAlertIcon('checkmark-circle');
    setAlertButtons([
      {
        text: 'OK',
        onPress: () => setAlertVisible(false),
      },
    ]);
    setAlertVisible(true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

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
      {/* Header Section with Cover Image */}
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: user.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
          accessibilityLabel={`${user.name}'s cover image`}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={styles.coverGradient}
        />
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
          style={[styles.editButton, { backgroundColor: currentTheme.primaryColor }]}
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
            {user.favoritesCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
            Favorites
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
            {user.reviewsCount || 0}
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
        {renderInfoItem('call', user.phone)}
        {renderInfoItem('location', user.address)}
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
          Account Settings
        </Text>
        {renderSettingItem('key', 'Change Password', () => {
          navigation.navigate('ChangePassword');
        })}
        {renderSettingItem('notifications', 'Notification Settings', () => {
          navigation.navigate('NotificationSettings');
        })}
      </View>

      {/* Edit Profile Popup */}
      <EditProfilePopup
        visible={isEditProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        userData={user}
        onSave={handleSaveProfile}
      />

      {/* CustomAlert Component */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        icon={alertIcon}
        onClose={() => setAlertVisible(false)}
        buttons={alertButtons}
      />
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
  coverGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    padding: 8,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: -60,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 18,
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
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
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
  infoText: {
    fontSize: 16,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
});

export default UserProfileScreen;


















// // src/screens/UserProfileScreen.js

// import React, { useContext, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';
// import EditProfilePopup from '../components/EditProfilePopup';

// const { width } = Dimensions.get('window');

// const UserProfileScreen = () => {
//   const [user, setUser] = useState({
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     address: '123 Main St, Anytown, USA',
//     profileImage:
//       'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg',
//     coverImage:
//       'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
//     favoritesCount: 5,
//     reviewsCount: 8,
//   });

//   const [isEditProfileVisible, setEditProfileVisible] = useState(false);

//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   const navigation = useNavigation();

//   const handleEditProfile = () => {
//     setEditProfileVisible(true);
//   };

//   const handleSaveProfile = (updatedData) => {
//     setUser(updatedData);
//     Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
//   };

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const renderInfoItem = (iconName, text) => (
//     <View style={styles.infoItem}>
//       <Ionicons
//         name={iconName}
//         size={20}
//         color={currentTheme.primaryColor}
//         style={styles.infoIcon}
//       />
//       <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//         {text}
//       </Text>
//     </View>
//   );

//   const renderSettingItem = (iconName, text, onPress) => (
//     <TouchableOpacity
//       style={styles.settingItem}
//       onPress={onPress}
//       accessibilityLabel={text}
//       accessibilityRole="button"
//     >
//       <Ionicons
//         name={iconName}
//         size={20}
//         color={currentTheme.primaryColor}
//         style={styles.infoIcon}
//       />
//       <Text style={[styles.infoText, { color: currentTheme.textColor }]}>
//         {text}
//       </Text>
//       <Ionicons
//         name="chevron-forward"
//         size={20}
//         color={currentTheme.placeholderTextColor}
//         style={styles.chevronIcon}
//       />
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView
//       style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}
//       contentContainerStyle={{ paddingBottom: 30 }}
//     >
//       {/* Header Section with Cover Image and Back Button */}
//       <View style={styles.headerContainer}>
//         <Image
//           source={{ uri: user.coverImage }}
//           style={styles.coverImage}
//           resizeMode="cover"
//           accessibilityLabel={`${user.name}'s cover image`}
//         />
//         <LinearGradient
//           colors={['rgba(0,0,0,0.5)', 'transparent']}
//           style={styles.coverGradient}
//         />
//         {/* Back Button */}
//         {/* <TouchableOpacity
//           style={styles.backButton}
//           onPress={handleGoBack}
//           accessibilityLabel="Go Back"
//           accessibilityRole="button"
//         >
//           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity> */}
//       </View>

//       {/* User Profile Info */}
//       <View style={styles.userInfoContainer}>
//         <Image
//           source={{ uri: user.profileImage }}
//           style={[
//             styles.profileImage,
//             { borderColor: currentTheme.borderColor },
//           ]}
//           accessibilityLabel={`${user.name}'s profile picture`}
//           onError={(e) => {
//             console.log(`Failed to load profile image for ${user.name}:`, e.nativeEvent.error);
//           }}
//         />
//         <Text style={[styles.userName, { color: currentTheme.textColor }]}>
//           {user.name}
//         </Text>
//         <Text style={[styles.userEmail, { color: currentTheme.textColor }]}>
//           {user.email}
//         </Text>
//         <TouchableOpacity
//           style={[styles.editButton, { backgroundColor: currentTheme.primaryColor }]}
//           onPress={handleEditProfile}
//           accessibilityLabel="Edit Profile"
//           accessibilityRole="button"
//         >
//           <Ionicons name="pencil" size={20} color="#FFFFFF" />
//           <Text style={styles.editButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Statistics Section */}
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
//             {user.favoritesCount || 0}
//           </Text>
//           <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
//             Favorites
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text style={[styles.statNumber, { color: currentTheme.primaryColor }]}>
//             {user.reviewsCount || 0}
//           </Text>
//           <Text style={[styles.statLabel, { color: currentTheme.textColor }]}>
//             Reviews
//           </Text>
//         </View>
//       </View>

//       {/* Personal Information Section */}
//       <View style={styles.section}>
//         <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
//           Personal Information
//         </Text>
//         {renderInfoItem('call', user.phone)}
//         {renderInfoItem('location', user.address)}
//       </View>

//       {/* Account Settings Section */}
//       <View style={styles.section}>
//         <Text style={[styles.sectionTitle, { color: currentTheme.cardTextColor }]}>
//           Account Settings
//         </Text>
//         {renderSettingItem('key', 'Change Password', () => {
//           navigation.navigate('ChangePassword');
//         })}
//         {renderSettingItem('notifications', 'Notification Settings', () => {
//           navigation.navigate('NotificationSettings');
//         })}
//       </View>

//       {/* Edit Profile Popup */}
//       <EditProfilePopup
//         visible={isEditProfileVisible}
//         onClose={() => setEditProfileVisible(false)}
//         userData={user}
//         onSave={handleSaveProfile}
//       />
//     </ScrollView>
//   );
// };

// // Styles for the components
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 200,
//   },
//   coverImage: {
//     width: '100%',
//     height: '100%',
//   },
//   coverGradient: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   },
//   backButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 30,
//     left: 20,
//     padding: 8,
//   },
//   userInfoContainer: {
//     alignItems: 'center',
//     marginTop: -60,
//     paddingHorizontal: 20,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 4,
//     borderColor: '#FFFFFF',
//     marginBottom: 10,
//     backgroundColor: '#ccc',
//   },
//   userName: {
//     fontSize: 26,
//     fontWeight: '700',
//   },
//   userEmail: {
//     fontSize: 18,
//     color: '#6c757d',
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
//     fontWeight: '600',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 20,
//     paddingHorizontal: 20,
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: '700',
//   },
//   statLabel: {
//     fontSize: 16,
//     color: '#6c757d',
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 10,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#dee2e6',
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#dee2e6',
//   },
//   infoIcon: {
//     marginRight: 15,
//   },
//   infoText: {
//     fontSize: 16,
//   },
//   chevronIcon: {
//     marginLeft: 'auto',
//   },
// });

// export default UserProfileScreen;








