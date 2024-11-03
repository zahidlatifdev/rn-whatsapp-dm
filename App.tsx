import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Linking,
  Platform,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {ReactNativeScannerView} from '@pushpendersingh/react-native-scanner';

const countryCodes = [
  {value: '1', label: 'USA (+1)'},
  {value: '44', label: 'UK (+44)'},
  {value: '91', label: 'India (+91)'},
  {value: '86', label: 'China (+86)'},
  {value: '81', label: 'Japan (+81)'},
  {value: '49', label: 'Germany (+49)'},
  {value: '33', label: 'France (+33)'},
  {value: '55', label: 'Brazil (+55)'},
  {value: '92', label: 'Pakistan (+92)'},
];

const messageTemplates = [
  'Hello, how are you?',
  'I am interested in your services.',
  'Can we schedule a meeting?',
  'Thank you for your time.',
  'Please call me back.',
];

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs camera permission to scan QR codes',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('directMessage');
  const [countryCode, setCountryCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedApp, setSelectedApp] = useState('whatsapp');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    loadRecentMessages();
    loadDarkModeSetting();

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

  const handleSendMessage = async () => {
    let formattedPhoneNumber = phoneNumber;

    // Remove leading zero if present
    if (formattedPhoneNumber.startsWith('0')) {
      formattedPhoneNumber = formattedPhoneNumber.substring(1);
    }

    // Remove country code if present
    if (formattedPhoneNumber.startsWith(countryCode)) {
      formattedPhoneNumber = formattedPhoneNumber.substring(countryCode.length);
    }

    // Remove plus sign if present
    if (formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = formattedPhoneNumber.substring(1);
    }

    const fullNumber = `+${countryCode}${formattedPhoneNumber}`;
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
      const updatedMessages = [newMessage, ...recentMessages.slice(0, 4)];
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

  const handleQRCodeScanned = ({nativeEvent}) => {
    if (!isScanning) return;

    const scannedValue = nativeEvent?.value;
    console.log('Scanned value:', scannedValue);
    setIsScanning(false);

    if (scannedValue) {
      // Handle different WhatsApp QR formats
      const qrMatch = scannedValue.match(/wa\.me\/qr\//);
      const phoneNumberMatch = scannedValue.match(/wa\.me\/(\d+)/);
      const businessMatch = scannedValue.match(/wa\.me\/message\//);

      if (qrMatch) {
        // For wa.me/qr/ links, open them directly
        Linking.openURL(scannedValue).catch(err => {
          console.error('Error opening link:', err);
          Alert.alert(
            'Error',
            'Could not open WhatsApp. Please make sure it is installed.',
          );
        });
      } else if (phoneNumberMatch && phoneNumberMatch[1]) {
        // Handle phone number QR codes
        const scannedNumber = phoneNumberMatch[1];
        let foundCountryCode = false;
        for (const country of countryCodes) {
          if (scannedNumber.startsWith(country.value)) {
            setCountryCode(country.value);
            setPhoneNumber(scannedNumber.substring(country.value.length));
            foundCountryCode = true;
            break;
          }
        }
        if (!foundCountryCode) {
          setPhoneNumber(scannedNumber);
        }
        setCurrentPage('directMessage');
      } else if (businessMatch) {
        // Handle business links
        Linking.openURL(scannedValue).catch(err => {
          console.error('Error opening WhatsApp:', err);
          Alert.alert(
            'Error',
            'Could not open WhatsApp Business. Please make sure it is installed.',
          );
        });
      } else {
        Alert.alert('Invalid QR Code', 'Please scan a valid WhatsApp QR code');
      }
    }

    // Reset scanning after delay
    setTimeout(() => {
      setIsScanning(true);
    }, 2000);
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#E0E0E0',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    logo: {
      width: 30,
      height: 30,
    },
    input: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    pickerContainer: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      borderRadius: 8,
      marginBottom: 16,
    },
    picker: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
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
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333333' : '#E0E0E0',
    },
    navButton: {
      alignItems: 'center',
    },
    navButtonText: {
      marginTop: 4,
      fontSize: 12,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    aboutText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 16,
    },
    aboutList: {
      marginLeft: 16,
      marginBottom: 16,
    },
    aboutListItem: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    templateBubbleContainer: {
      marginBottom: 16,
    },
    templateBubbleScroll: {
      flexDirection: 'row',
      paddingHorizontal: 8,
    },
    templateBubble: {
      backgroundColor: '#E0E0E0',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginHorizontal: 4,
    },
    templateBubbleText: {
      color: '#000000',
      fontSize: 14,
    },
    selectedTemplateBubble: {
      backgroundColor: '#25D366',
    },
    selectedTemplateBubbleText: {
      color: '#FFFFFF',
    },
    clearButton: {
      backgroundColor: '#FF3B30',
      marginTop: 10,
      marginBottom: 20,
    },
    appSelector: {
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      borderRadius: 8,
      overflow: 'hidden',
    },
    appOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    selectedAppOption: {
      backgroundColor: '#25D366',
    },
    appOptionText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: 16,
    },
    selectedAppOptionText: {
      color: '#FFFFFF',
    },
    appTypeTag: {
      marginTop: 8,
      backgroundColor: '#25D366',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    appTypeText: {
      color: '#FFFFFF',
      fontSize: 12,
    },
    scannerContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F0F0F0',
    },
    centerText: {
      flex: 0,
      fontSize: 18,
      padding: 32,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    buttonTouchable: {
      padding: 16,
    },
    cameraContainer: {
      flex: 1,
    },
    scannerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      borderRadius: 12,
    },
    scannerText: {
      color: '#FFF',
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
    phoneNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    countryCodeText: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 12,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      fontSize: 16,
    },
    phoneNumberInput: {
      flex: 1,
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 12,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      fontSize: 16,
    },
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'scanner':
        return (
          <View style={styles.scannerContainer}>
            <ReactNativeScannerView
              style={styles.cameraContainer}
              onQrScanned={handleQRCodeScanned}
              scanEnabled={isScanning}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame} />
              <Text style={styles.scannerText}>
                {isScanning
                  ? 'Align QR code within frame to scan'
                  : 'Processing scan...'}
              </Text>
            </View>
          </View>
        );
      case 'directMessage':
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView>
              <View style={styles.appSelector}>
                <TouchableOpacity
                  style={[
                    styles.appOption,
                    selectedApp === 'whatsapp' && styles.selectedAppOption,
                  ]}
                  onPress={() => setSelectedApp('whatsapp')}>
                  <Text
                    style={[
                      styles.appOptionText,
                      selectedApp === 'whatsapp' &&
                        styles.selectedAppOptionText,
                    ]}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.appOption,
                    selectedApp === 'business' && styles.selectedAppOption,
                  ]}
                  onPress={() => setSelectedApp('business')}>
                  <Text
                    style={[
                      styles.appOptionText,
                      selectedApp === 'business' &&
                        styles.selectedAppOptionText,
                    ]}>
                    Business
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={countryCode}
                  onValueChange={itemValue => setCountryCode(itemValue)}
                  style={styles.picker}>
                  {countryCodes.map(country => (
                    <Picker.Item
                      key={country.value}
                      label={country.label}
                      value={country.value}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.phoneNumberContainer}>
                <Text style={styles.countryCodeText}>+{countryCode}</Text>
                <TextInput
                  style={styles.phoneNumberInput}
                  placeholder="Phone Number"
                  placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.templateBubbleContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.templateBubbleScroll}>
                  {messageTemplates.map((template, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.templateBubble,
                        selectedTemplate === template &&
                          styles.selectedTemplateBubble,
                      ]}
                      onPress={() => handleTemplateChange(template)}>
                      <Text
                        style={[
                          styles.templateBubbleText,
                          selectedTemplate === template &&
                            styles.selectedTemplateBubbleText,
                        ]}>
                        {template}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <TextInput
                style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
                placeholder="Type your message..."
                placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSendMessage}>
                <Text style={styles.buttonText}>Send Message</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case 'recentMessages':
        return (
          <View style={{flex: 1}}>
            {recentMessages.length === 0 ? (
              <Text style={styles.messageText}>No recent messages</Text>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={clearHistory}>
                  <Text style={styles.buttonText}>Clear History</Text>
                </TouchableOpacity>
                <ScrollView>
                  {recentMessages.map((msg, index) => (
                    <View key={index} style={styles.messageCard}>
                      <Text style={styles.messageNumber}>{msg.number}</Text>
                      <Text style={styles.messageText}>{msg.message}</Text>
                      <Text style={styles.messageDate}>
                        {new Date(msg.date).toLocaleString()}
                      </Text>
                      <View style={styles.appTypeTag}>
                        <Text style={styles.appTypeText}>
                          {msg.appType === 'whatsapp' ? 'WhatsApp' : 'Business'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        );
      case 'about':
        return (
          <ScrollView>
            <Text style={styles.aboutText}>Version 2.0.0</Text>
            <Text style={styles.aboutText}>
              WhatsApp Direct is a convenient tool to send WhatsApp messages
              without saving contacts. It's designed for quick and easy
              communication on the go.
            </Text>
            <Text style={styles.aboutText}>Features:</Text>
            <View style={styles.aboutList}>
              <Text style={styles.aboutListItem}>
                • Send messages to unsaved numbers
              </Text>
              <Text style={styles.aboutListItem}>
                • Recent messages history
              </Text>
              <Text style={styles.aboutListItem}>• Dark mode support</Text>
              <Text style={styles.aboutListItem}>• Multiple country codes</Text>
              <Text style={styles.aboutListItem}>
                • View and save WhatsApp statuses
              </Text>
            </View>
            <Text style={styles.aboutText}>
              © 2023 WhatsApp Direct. All rights reserved.
            </Text>
          </ScrollView>
        );
      default:
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>
          {currentPage === 'directMessage'
            ? 'Send Direct Message'
            : currentPage === 'recentMessages'
            ? 'Recent Messages'
            : currentPage === 'scanner'
            ? 'WhatsApp QR Scanner'
            : 'About'}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      <View style={styles.content}>{renderPage()}</View>
      {!isKeyboardVisible && (
        <Animated.View style={[styles.bottomNav, {opacity: fadeAnim}]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handlePageChange('directMessage')}>
            <Icon
              name="send"
              size={24}
              color={
                currentPage === 'directMessage'
                  ? '#25D366'
                  : isDarkMode
                  ? '#FFFFFF'
                  : '#000000'
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 'directMessage' && {color: '#25D366'},
              ]}>
              Send
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handlePageChange('scanner')}>
            <Icon
              name="qr-code"
              size={24}
              color={
                currentPage === 'scanner'
                  ? '#25D366'
                  : isDarkMode
                  ? '#FFFFFF'
                  : '#000000'
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 'scanner' && {color: '#25D366'},
              ]}>
              Scan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handlePageChange('recentMessages')}>
            <Icon
              name="chatbubbles"
              size={24}
              color={
                currentPage === 'recentMessages'
                  ? '#25D366'
                  : isDarkMode
                  ? '#FFFFFF'
                  : '#000000'
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 'recentMessages' && {color: '#25D366'},
              ]}>
              Recent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handlePageChange('about')}>
            <Icon
              name="information-circle"
              size={24}
              color={
                currentPage === 'about'
                  ? '#25D366'
                  : isDarkMode
                  ? '#FFFFFF'
                  : '#000000'
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 'about' && {color: '#25D366'},
              ]}>
              About
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
