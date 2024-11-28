// src/contexts/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '../services/api'; // Ensure the path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../services/api'; // Import logout function

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // State to hold user data
  const [user, setUser] = useState(null);

  // State to manage loading status
  const [loading, setLoading] = useState(true);

  // Fetch user profile on app start
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.getUserProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token might be invalid or expired
            // await logout();
          }
        }
      } catch (error) {
        console.error('Initialization Error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser,loading }}>
      {children}
    </UserContext.Provider>
  );
};
