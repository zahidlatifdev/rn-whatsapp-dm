import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Animated,
  Keyboard,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {parsePhoneNumber, isValidPhoneNumber} from 'libphonenumber-js';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import {getIPLocation} from 'react-ip-location';
import {getCountryDialCodeFromCountryCodeOrNameOrFlagEmoji} from 'country-codes-flags-phone-codes';
import {requestCameraPermission} from './utils/lib/requestCameraPermission';
import {ScannerPage} from './pages/ScannerPage';
import {AboutPage} from './pages/AboutPage';
import {RecentMessagesPage} from './pages/RecentMessagesPage';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DirectMessagePage from './pages/DirectMessagePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('directMessage');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [callingCode, setCallingCode] = useState('1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedApp, setSelectedApp] = useState('whatsapp');

  const toggleAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    loadRecentMessages();
    loadDarkModeSetting();
    detectUserCountry();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const detectUserCountry = async () => {
    try {
      const result = await getIPLocation();
      if (result && result.country) {
        setCountryCode(result.country);

        console.log(
          getCountryDialCodeFromCountryCodeOrNameOrFlagEmoji(result.country),
        );
        const callingCodeValue =
          getCountryDialCodeFromCountryCodeOrNameOrFlagEmoji(
            result.country,
          )?.replace('+', '');
        callingCodeValue && setCallingCode(callingCodeValue);
      }
    } catch (error) {
      console.error('Error detecting country:', error);
    }
  };

  const loadRecentMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('recentMessages');
      if (savedMessages !== null) {
        setRecentMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading recent messages:', error);
    }
  };

  const loadDarkModeSetting = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.error('Error loading dark mode setting:', error);
    }
  };

  const saveRecentMessages = async messages => {
    try {
      await AsyncStorage.setItem('recentMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving recent messages:', error);
    }
  };

  const saveDarkModeSetting = async isDark => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  const validatePhoneNumber = (number: string, country: string): boolean => {
    try {
      return isValidPhoneNumber(number, country);
    } catch (error) {
      return false;
    }
  };

  const handleSendMessage = async () => {
    let formattedPhoneNumber = phoneNumber;

    // Remove leading zero if present
    if (formattedPhoneNumber.startsWith('0')) {
      formattedPhoneNumber = formattedPhoneNumber.substring(1);
    }

    // Remove plus sign if present
    if (formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = formattedPhoneNumber.substring(1);
    }

    // Validate phone number
    const fullNumber = `+${callingCode}${formattedPhoneNumber}`;
    if (!validatePhoneNumber(fullNumber, countryCode)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?phone=${fullNumber.replace(
      '+',
      '',
    )}&text=${encodedMessage}`;

    try {
      await Linking.openURL(url);
      // If successful, save to history
      const newMessage = {
        number: fullNumber,
        message: message.slice(0, 30) + '...',
        date: new Date().toISOString(),
        appType: selectedApp,
      };

      // Remove any existing entry with the same number
      const filteredMessages = recentMessages.filter(
        msg => msg.number !== fullNumber,
      );

      // Add the new message to the top
      const updatedMessages = [newMessage, ...filteredMessages.slice(0, 19)];
      setRecentMessages(updatedMessages);
      saveRecentMessages(updatedMessages);

      setPhoneNumber('');
      setMessage('');
    } catch (err) {
      console.error('Error opening WhatsApp:', err);
      Alert.alert(
        'Error',
        `Could not open ${
          selectedApp === 'whatsapp' ? 'WhatsApp' : 'WhatsApp Business'
        }. Please make sure it is installed.`,
      );
    }
  };

  const toggleDarkMode = value => {
    setIsDarkMode(value);
    saveDarkModeSetting(value);
  };

  const handleTemplateChange = template => {
    setSelectedTemplate(template);
    setMessage(template);
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all recent messages?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setRecentMessages([]);
            await AsyncStorage.setItem('recentMessages', JSON.stringify([]));
          },
        },
      ],
    );
  };

  const saveScannedLinkToHistory = async (link, type) => {
    const newMessage = {
      number: link,
      message: type,
      date: new Date().toISOString(),
      appType: selectedApp,
    };

    // Remove any existing entry with the same number or link
    const filteredMessages = recentMessages.filter(msg => msg.number !== link);

    // Add the new message to the top
    const updatedMessages = [newMessage, ...filteredMessages.slice(0, 19)];
    setRecentMessages(updatedMessages);
    saveRecentMessages(updatedMessages);
  };

  const handleHistoryItemClick = async msg => {
    if (msg.number.startsWith('http://') || msg.number.startsWith('https://')) {
      try {
        await Linking.openURL(msg.number);
      } catch (err) {
        console.error('Error opening URL:', err);
        Alert.alert('Error', 'Could not open URL.');
      }
    } else {
      const fullNumber = msg.number;
      const parsedNumber = parsePhoneNumber(fullNumber);

      if (parsedNumber) {
        const country = parsedNumber.country;
        const nationalNumber = parsedNumber.nationalNumber;

        setCountryCode(country);
        setCallingCode(parsedNumber.countryCallingCode);
        setPhoneNumber(nationalNumber);
        setCurrentPage('directMessage');
      } else {
        Alert.alert('Error', 'Invalid phone number format.');
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F0F0F0',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    button: {
      backgroundColor: '#25D366',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    messageCard: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    messageNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    messageText: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      marginTop: 8,
    },
    messageDate: {
      fontSize: 12,
      color: isDarkMode ? '#999999' : '#999999',
      marginTop: 8,
    },
    countryPickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      height: 50,
    },
    countryNameText: {
      marginLeft: 8,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: 16,
    },
  });

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const renderCountryPicker = () => (
    <TouchableOpacity
      style={styles.countryPickerButton}
      onPress={() => setShowCountryPicker(true)}>
      <CountryPicker
        withFilter
        withFlag
        withCountryNameButton
        withCallingCode
        withEmoji
        onSelect={onSelectCountry}
        countryCode={countryCode}
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        theme={{
          backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
          onBackgroundTextColor: isDarkMode ? '#FFFFFF' : '#000000',
          filterPlaceholderTextColor: isDarkMode ? '#CCCCCC' : '#666666',
          primaryColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
          primaryColorVariant: isDarkMode ? '#333333' : '#E0E0E0',
          secondaryColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
        }}
      />
      <Text style={styles.countryNameText}>
        {countryCode} +{callingCode}
      </Text>
      <Icon
        name="chevron-down"
        size={16}
        color={isDarkMode ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'scanner':
        return (
          <ScannerPage
            isDarkMode={isDarkMode}
            setCurrentPage={setCurrentPage}
            setCountryCode={setCountryCode}
            setPhoneNumber={setPhoneNumber}
            setCallingCode={setCallingCode}
            saveScannedLinkToHistory={saveScannedLinkToHistory}
            selectedApp={selectedApp}
          />
        );
      case 'directMessage':
        return (
          <DirectMessagePage
            selectedApp={selectedApp}
            setSelectedApp={setSelectedApp}
            renderCountryPicker={renderCountryPicker}
            isDarkMode={isDarkMode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            callingCode={callingCode}
            selectedTemplate={selectedTemplate}
            handleTemplateChange={handleTemplateChange}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
          />
        );
      case 'recentMessages':
        return (
          <RecentMessagesPage
            isDarkMode={isDarkMode}
            recentMessages={recentMessages}
            clearHistory={clearHistory}
            handleHistoryItemClick={handleHistoryItemClick}
          />
        );
      case 'about':
        return <AboutPage isDarkMode={isDarkMode} />;
        return null;
    }
  };

  const handlePageChange = async page => {
    if (page === 'scanner') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to scan QR codes.',
        );
        return;
      }
    }
    setCurrentPage(page);
  };

  const togglePosition = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 36],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
        currentPage={currentPage}
        togglePosition={togglePosition}
      />
      <View style={styles.content}>{renderPage()}</View>
      {!isKeyboardVisible && (
        <BottomNav
          currentPage={currentPage}
          fadeAnim={fadeAnim}
          isDarkMode={isDarkMode}
          handlePageChange={handlePageChange}
        />
      )}
    </SafeAreaView>
  );
}
