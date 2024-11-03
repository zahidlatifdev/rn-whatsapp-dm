import React, {useState, useEffect} from 'react';
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
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const countryCodes = [
  {value: '1', label: 'USA (+1)'},
  {value: '44', label: 'UK (+44)'},
  {value: '91', label: 'India (+91)'},
  {value: '86', label: 'China (+86)'},
  {value: '81', label: 'Japan (+81)'},
  {value: '49', label: 'Germany (+49)'},
  {value: '33', label: 'France (+33)'},
  {value: '55', label: 'Brazil (+55)'},
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [countryCode, setCountryCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

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

  const handleSendMessage = () => {
    const fullNumber = `+${countryCode}${phoneNumber}`;
    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?phone=${fullNumber}&text=${encodedMessage}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('WhatsApp is not installed on this device');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));

    const newMessage = {
      number: fullNumber,
      message: message.slice(0, 30) + '...',
      date: new Date().toISOString(),
    };
    const updatedMessages = [newMessage, ...recentMessages.slice(0, 4)];
    setRecentMessages(updatedMessages);
    saveRecentMessages(updatedMessages);

    setPhoneNumber('');
    setMessage('');
  };

  const toggleDarkMode = value => {
    setIsDarkMode(value);
    saveDarkModeSetting(value);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F0F0F0',
      paddingTop: StatusBar.currentHeight,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    subtitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    button: {
      backgroundColor: isDarkMode ? '#3700B3' : '#6200EE',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      marginLeft: 10,
    },
    input: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
      fontSize: 16,
    },
    pickerContainer: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      borderRadius: 8,
      marginBottom: 15,
    },
    picker: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    messageCard: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    messageNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    messageText: {
      fontSize: 14,
      color: isDarkMode ? '#CCCCCC' : '#666666',
      marginTop: 5,
    },
    messageDate: {
      fontSize: 12,
      color: isDarkMode ? '#999999' : '#999999',
      marginTop: 5,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    settingText: {
      fontSize: 18,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444444' : '#DDDDDD',
    },
    navButton: {
      padding: 10,
    },
    aboutText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 10,
    },
    aboutList: {
      marginLeft: 20,
      marginBottom: 10,
    },
    aboutListItem: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: 5,
    },
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <ScrollView>
            <Text style={styles.title}>WhatsApp Direct</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage('directMessage')}>
              <Icon name="send" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Send Direct Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage('recentMessages')}>
              <Icon name="chatbubbles" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Recent Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage('settings')}>
              <Icon name="settings" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentPage('about')}>
              <Icon name="information-circle" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>About</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      case 'directMessage':
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <ScrollView>
              <Text style={styles.subtitle}>Send Direct Message</Text>
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
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
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
                <Icon name="send" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>Send Message</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        );
      case 'recentMessages':
        return (
          <ScrollView>
            <Text style={styles.subtitle}>Recent Messages</Text>
            {recentMessages.length === 0 ? (
              <Text style={styles.messageText}>No recent messages</Text>
            ) : (
              recentMessages.map((msg, index) => (
                <View key={index} style={styles.messageCard}>
                  <Text style={styles.messageNumber}>{msg.number}</Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.messageDate}>
                    {new Date(msg.date).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        );
      case 'settings':
        return (
          <ScrollView>
            <Text style={styles.subtitle}>Settings</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Push Notifications</Text>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={'#f5dd4b'}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Hide Online Status</Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={'#f4f3f4'}
              />
            </View>
          </ScrollView>
        );
      case 'about':
        return (
          <ScrollView>
            <Text style={styles.subtitle}>About WhatsApp Direct</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        {currentPage !== 'home' && (
          <TouchableOpacity
            style={[styles.button, {marginBottom: 20}]}
            onPress={() => setCurrentPage('home')}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        )}
        {renderPage()}
      </View>
      {currentPage !== 'home' && !isKeyboardVisible && (
        <Animated.View style={[styles.bottomNav, {opacity: fadeAnim}]}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage('directMessage')}>
            <Icon
              name="send"
              size={24}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage('recentMessages')}>
            <Icon
              name="chatbubbles"
              size={24}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage('settings')}>
            <Icon
              name="settings"
              size={24}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentPage('about')}>
            <Icon
              name="information-circle"
              size={24}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
