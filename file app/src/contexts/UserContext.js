// src/contexts/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Install this package

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User object: { name, email, ... }
  const [loading, setLoading] = useState(true); // To handle splash/loading screens

  // Load user data from AsyncStorage when app starts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('@user_data');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Function to log in the user
  const login = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
      Alert.alert('Error', 'Failed to log in.');
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@user_data');
    } catch (error) {
      console.error('Failed to remove user data:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  // Function to update user details
  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user data:', error);
      Alert.alert('Error', 'Failed to update user data.');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
