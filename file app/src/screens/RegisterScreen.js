// src/screens/RegisterScreen.js

import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Confirm password state
  const [confirmPassword, setConfirmPassword] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Get theme from context
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  // Animation values
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconTranslateY = useRef(new Animated.Value(-50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Function to start the animations
  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(iconTranslateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startAnimations();
  }, []);

  const handleRegister = async () => {
    navigation.navigate('Login')
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    // Simulate registration API call
    const userData = { name, email, password };
    const response = await registerUser(userData);
    setLoading(false);

    if (response) {
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Registration Failed', 'Please check your details and try again.');
    }
  };

  return (
    <LinearGradient
      colors={theme === 'light' ? ['#ffffff', '#e6f7ff'] : ['#121212', '#1f1f1f']}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Animated.View
            style={{
              opacity: iconOpacity,
              transform: [{ translateY: iconTranslateY }],
              alignItems: 'center',
              marginBottom: 30,
            }}
          >
            <Icon name="person-add" size={100} color={currentTheme.primaryColor} />
            <Text style={[styles.title, { color: currentTheme.textColor }]}>
              Create Account
            </Text>
          </Animated.View>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon
                name="person"
                size={24}
                color={currentTheme.placeholderTextColor}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Name"
                placeholderTextColor={currentTheme.placeholderTextColor}
                style={[
                  styles.input,
                  {
                    color: currentTheme.textColor,
                    backgroundColor: currentTheme.inputBackground,
                  },
                ]}
                onChangeText={setName}
                accessibilityLabel="Name Input"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="email"
                size={24}
                color={currentTheme.placeholderTextColor}
                style={styles.inputIcon}
              />
              <TextInput
                ref={emailInputRef}
                placeholder="Email"
                placeholderTextColor={currentTheme.placeholderTextColor}
                style={[
                  styles.input,
                  {
                    color: currentTheme.textColor,
                    backgroundColor: currentTheme.inputBackground,
                  },
                ]}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                accessibilityLabel="Email Input"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock"
                size={24}
                color={currentTheme.placeholderTextColor}
                style={styles.inputIcon}
              />
              <TextInput
                ref={passwordInputRef}
                placeholder="Password"
                placeholderTextColor={currentTheme.placeholderTextColor}
                style={[
                  styles.input,
                  {
                    color: currentTheme.textColor,
                    backgroundColor: currentTheme.inputBackground,
                  },
                ]}
                secureTextEntry
                onChangeText={setPassword}
                accessibilityLabel="Password Input"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock-outline"
                size={24}
                color={currentTheme.placeholderTextColor}
                style={styles.inputIcon}
              />
              <TextInput
                ref={confirmPasswordInputRef}
                placeholder="Confirm Password"
                placeholderTextColor={currentTheme.placeholderTextColor}
                style={[
                  styles.input,
                  {
                    color: currentTheme.textColor,
                    backgroundColor: currentTheme.inputBackground,
                  },
                ]}
                secureTextEntry
                onChangeText={setConfirmPassword}
                accessibilityLabel="Confirm Password Input"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>
          </View>
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
              width: '100%',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: currentTheme.primaryColor },
              ]}
              onPress={handleRegister}
              activeOpacity={0.8}
              accessibilityLabel="Register Button"
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>REGISTER</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.loginContainer}>
            <Text style={[styles.accountText, { color: currentTheme.textColor }]}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessibilityLabel="Login Button"
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.loginText,
                  { color: currentTheme.secondaryColor },
                ]}
              >
                {' '}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Create refs for input fields
const emailInputRef = React.createRef();
const passwordInputRef = React.createRef();
const confirmPasswordInputRef = React.createRef();

// Styles for the components
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  accountText: {
    fontSize: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;




// // RegisterScreen.js

// import React, { useState, useEffect, useRef, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
//   ImageBackground,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { registerUser } from '../services/api';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// import { ThemeContext } from '../../ThemeContext';
// import { lightTheme, darkTheme } from '../../themes';

// const { width, height } = Dimensions.get('window');

// const RegisterScreen = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // Get theme from context
//   const { theme } = useContext(ThemeContext);
//   const currentTheme = theme === 'light' ? lightTheme : darkTheme;

//   // Animation values
//   const iconOpacity = useRef(new Animated.Value(0)).current;
//   const iconTranslateY = useRef(new Animated.Value(-50)).current;
//   const buttonAnimation = useRef(new Animated.Value(1)).current;

//   // Function to start the animations
//   const startAnimations = () => {
//     Animated.parallel([
//       Animated.timing(iconOpacity, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(iconTranslateY, {
//         toValue: 0,
//         friction: 5,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   useEffect(() => {
//     startAnimations();
//   }, []);

//   const handleRegister = async () => {
//     // Animate button press
//     Animated.sequence([
//       Animated.spring(buttonAnimation, {
//         toValue: 0.95,
//         friction: 3,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//       Animated.spring(buttonAnimation, {
//         toValue: 1,
//         friction: 3,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Simulate registration API call
//     const userData = { name, email, password };
//     const response = await registerUser(userData);
//     if (response) {
//       Alert.alert('Success', 'Account created successfully!');
//       navigation.navigate('Login');
//     } else {
//       Alert.alert('Registration Failed', 'Please check your details and try again.');
//     }
//   };

//   return (
//     <ImageBackground
//       source={{
//         uri:
//           theme === 'light'
//             ? 'https://media.istockphoto.com/id/1350046657/photo/dark-green-defocused-blurred-motion-abstract-background.jpg'
//             : 'https://your-dark-theme-image-url', // Replace with your dark theme image URL
//       }}
//       style={styles.backgroundImage}
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[
//           styles.overlay,
//           { backgroundColor: currentTheme.overlayColor },
//         ]}
//       >
//         <View style={styles.container}>
//           <Animated.View
//             style={{
//               opacity: iconOpacity,
//               transform: [{ translateY: iconTranslateY }],
//               alignItems: 'center',
//               marginBottom: 20,
//             }}
//           >
//             <Icon name="person-add" size={100} color="#FFFFFF" />
//             <Text style={[styles.title, { color: currentTheme.textColor }]}>
//               Create Account
//             </Text>
//           </Animated.View>
//           <View style={styles.inputContainer}>
//             <TextInput
//               placeholder="Name"
//               placeholderTextColor={currentTheme.placeholderTextColor}
//               style={[
//                 styles.input,
//                 {
//                   color: currentTheme.textColor,
//                   backgroundColor: currentTheme.cardBackground,
//                   borderColor: currentTheme.primaryColor,
//                 },
//               ]}
//               onChangeText={setName}
//             />
//             <TextInput
//               placeholder="Email"
//               placeholderTextColor={currentTheme.placeholderTextColor}
//               style={[
//                 styles.input,
//                 {
//                   color: currentTheme.textColor,
//                   backgroundColor: currentTheme.cardBackground,
//                   borderColor: currentTheme.primaryColor,
//                 },
//               ]}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={currentTheme.placeholderTextColor}
//               style={[
//                 styles.input,
//                 {
//                   color: currentTheme.textColor,
//                   backgroundColor: currentTheme.cardBackground,
//                   borderColor: currentTheme.primaryColor,
//                 },
//               ]}
//               secureTextEntry
//               onChangeText={setPassword}
//             />
//           </View>
//           <Animated.View
//             style={{
//               transform: [{ scale: buttonAnimation }],
//               width: '100%',
//               alignItems: 'center',
//             }}
//           >
//             <TouchableOpacity
//               style={[
//                 styles.button,
//                 { backgroundColor: currentTheme.primaryColor },
//               ]}
//               onPress={handleRegister}
//             >
//               <Text style={styles.buttonText}>REGISTER</Text>
//             </TouchableOpacity>
//           </Animated.View>
//           <View style={styles.loginContainer}>
//             <Text style={[styles.accountText, { color: currentTheme.textColor }]}>
//               Already have an account?
//             </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//               <Text
//                 style={[
//                   styles.loginText,
//                   { color: currentTheme.secondaryColor },
//                 ]}
//               >
//                 {' '}
//                 Login
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };

// // Styles for the components
// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: width,
//     height: height,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '85%',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     marginTop: 10,
//     textShadowColor: '#000000',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 5,
//   },
//   inputContainer: {
//     width: '100%',
//     marginTop: 30,
//   },
//   input: {
//     width: '100%',
//     padding: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderRadius: 30,
//   },
//   button: {
//     paddingVertical: 15,
//     paddingHorizontal: 80,
//     borderRadius: 30,
//     marginVertical: 20,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   accountText: {
//     fontSize: 16,
//   },
//   loginText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default RegisterScreen;
