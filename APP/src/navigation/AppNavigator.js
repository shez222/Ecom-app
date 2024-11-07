// src/navigation/AppNavigator.js

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpScreen from '../screens/OtpScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import MarketPage from '../screens/MarketPage';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';
import ProductPage from '../screens/ProductPage';
import CartPage from '../screens/CartPage';
import NewPasswordScreen from '../screens/NewPasswordScreen';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { ThemeProvider, ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Remove all headers from the Tab Navigator
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Market') {
            iconName = focused ? 'storefront' : 'storefront-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'PurchaseHistory') {
            iconName = focused ? 'history' : 'history';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === 'UserProfile') {
            iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: currentTheme.tabBarActiveTintColor,
        tabBarInactiveTintColor: currentTheme.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: currentTheme.cardBackground,
        },
      })}
    >
      <Tab.Screen name="Market" component={MarketPage} />
      <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  // Example user data; replace with actual user data as needed
  const userProfileImage =
    'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg';
  const username = 'John Doe'; // Replace with actual username from your user data

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          // Remove all headers globally
          screenOptions={{ headerShown: false }}
        >
          {/* Authentication Screens */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />

          {/* Main App Screens with Bottom Tab Navigator */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Product Page */}
          <Stack.Screen name="ProductPage" component={ProductPage} />

          {/* Cart Page */}
          <Stack.Screen name="CartPage" component={CartPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;





// // AppNavigator.js

// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import OtpScreen from '../screens/OtpScreen';
// import UserProfileScreen from '../screens/UserProfileScreen';
// import MarketPage from '../screens/MarketPage';
// import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import HelpScreen from '../screens/HelpScreen';
// import ProductPage from '../screens/ProductPage';
// import CustomHeader from '../components/CustomHeader';

// import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// import { ThemeProvider, ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';
// import CartPage from '../screens/CartPage';
// import NewPasswordScreen from '../screens/NewPasswordScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const MainTabNavigator = ({ userProfileImage, username }) => {
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         header: () => (
//           <CustomHeader
//             userProfileImage={userProfileImage}
//             username={username}
//           />
//         ),
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'Market') {
//             iconName = focused ? 'storefront' : 'storefront-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'PurchaseHistory') {
//             iconName = 'history';
//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'UserProfile') {
//             iconName = focused ? 'person' : 'person-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Settings') {
//             iconName = focused ? 'settings' : 'settings-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === 'Help') {
//             iconName = focused ? 'help-circle' : 'help-circle-outline';
//             return <Ionicons name={iconName} size={size} color={color} />;
//           }
//         },
//         tabBarActiveTintColor: currentTheme.tabBarActiveTintColor,
//         tabBarInactiveTintColor: currentTheme.tabBarInactiveTintColor,
//         tabBarStyle: {
//           backgroundColor: currentTheme.cardBackground,
//         },
//       })}
//     >
//       <Tab.Screen name="Market" component={MarketPage} />
//       <Tab.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
//       <Tab.Screen name="UserProfile" component={UserProfileScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//       <Tab.Screen name="Help" component={HelpScreen} />
//     </Tab.Navigator>
//   );
// };

// const AppNavigator = () => {
//   const userProfileImage =
//     'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg';
//   const username = 'John Doe'; // Replace with actual username from your user data

//   return (
//     <ThemeProvider>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName="Login"
//           screenOptions={{ headerShown: true }}
//         >
//           {/* Authentication Screens */}
//           <Stack.Screen
//             name="Login"
//             component={LoginScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Register"
//             component={RegisterScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="ForgotPassword"
//             component={ForgotPasswordScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Otp"
//             component={OtpScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="NewPassword"
//             component={NewPasswordScreen}
//             options={{ headerShown: false }}
//           />

//           {/* Main App Screens with Bottom Tab Navigator */}
//           <Stack.Screen name="Main" options={{ headerShown: false }}>
//             {() => (
//               <MainTabNavigator
//                 userProfileImage={userProfileImage}
//                 username={username}
//               />
//             )}
//           </Stack.Screen>

//           {/* Product Page */}
//           <Stack.Screen
//             name="ProductPage"
//             component={ProductPage}
//             options={{
//               headerShown: true,
//               header: () => (
//                 <CustomHeader
//                   userProfileImage={userProfileImage}
//                   username={username}
//                 />
//               ),
//             }}
//           />
//           <Stack.Screen
//             name="CartPage"
//             component={CartPage}
//             options={{
//               headerShown: true,
//               header: () => (
//                 <CustomHeader
//                   userProfileImage={userProfileImage}
//                   username={username}
//                 />
//               ),
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </ThemeProvider>
//   );
// };

// export default AppNavigator;
