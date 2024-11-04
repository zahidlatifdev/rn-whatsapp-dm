import {Alert, Linking} from 'react-native';
import {isValidPhoneNumber} from 'libphonenumber-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const validatePhoneNumber = (number: string, country: string): boolean => {
  try {
    return isValidPhoneNumber(number, country);
  } catch (error) {
    return false;
  }
};

export const sendWhatsAppMessage = async (
  fullNumber: string,
  message: string,
  selectedApp: string,
) => {
  const encodedMessage = encodeURIComponent(message);
  const url = `whatsapp://send?phone=${fullNumber.replace(
    '+',
    '',
  )}&text=${encodedMessage}`;

  try {
    await Linking.openURL(url);
    return true;
  } catch (err) {
    console.error('Error opening WhatsApp:', err);
    Alert.alert(
      'Error',
      `Could not open ${
        selectedApp === 'whatsapp' ? 'WhatsApp' : 'WhatsApp Business'
      }. Please make sure it is installed.`,
    );
    return false;
  }
};

export const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};