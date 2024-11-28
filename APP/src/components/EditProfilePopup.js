// src/components/EditProfilePopup.js

import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../ThemeContext'; // Import ThemeContext
import { lightTheme, darkTheme } from '../../themes'; // Import theme definitions

const EditProfilePopup = ({ visible, onClose, userData, onSave }) => {
  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');

  // Access the current theme
  const { theme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    setName(userData.name || '');
    setEmail(userData.email || '');
    setPhone(userData.phone || '');
    setAddress(userData.address || '');
  }, [userData]);

  const handleSave = () => {
    // Perform validation if needed
    if (!name || !email) {
      Alert.alert('Validation Error', 'Name and email are required.');
      return;
    }

    const updatedData = {
      ...userData,
      name,
      email,
      phone,
      address,
    };

    onSave(updatedData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide" // Keep the 'slide' animation
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalInnerContainer, { backgroundColor: currentTheme.cardBackground }]}>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentTheme.cardTextColor }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={currentTheme.textColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.textColor }]}>Name</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  borderColor: currentTheme.borderColor,
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={currentTheme.placeholderTextColor}
                accessibilityLabel="Name Input"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.textColor }]}>Email</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  borderColor: currentTheme.borderColor,
                }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={currentTheme.placeholderTextColor}
                accessibilityLabel="Email Input"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.textColor }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  borderColor: currentTheme.borderColor,
                }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor={currentTheme.placeholderTextColor}
                accessibilityLabel="Phone Number Input"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.textColor }]}>Address</Text>
              <TextInput
                style={[styles.input, {
                  height: 80,
                  backgroundColor: currentTheme.backgroundColor,
                  color: currentTheme.textColor,
                  borderColor: currentTheme.borderColor,
                }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                placeholderTextColor={currentTheme.placeholderTextColor}
                accessibilityLabel="Address Input"
              />
            </View>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: currentTheme.primaryColor }]}
              onPress={(handleSave)}
              accessibilityLabel="Save Profile"
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Styles for EditProfilePopup
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000AA', // Semi-transparent background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  modalInnerContainer: {
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    width: '90%',
    maxWidth: 400, // Limit the width for larger screens
  },
  modalContent: {
    // Adjust padding if needed
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfilePopup;
