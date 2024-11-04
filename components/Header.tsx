import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Header({
  toggleDarkMode,
  isDarkMode,
  currentPage,
  togglePosition,
}) {
  const styles = StyleSheet.create({
    logo: {
      width: 30,
      height: 30,
      borderRadius: 5,
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
    modeToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
      borderRadius: 16,
      padding: 2,
      width: 70,
      height: 32,
    },
    modeToggleButton: {
      position: 'absolute',
      width: 32,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modeToggleIcon: {
      color: '#666666',
    },
  });

  return (
    <View style={styles.header}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.headerTitle}>
        {currentPage === 'directMessage'
          ? 'Send Direct Message'
          : currentPage === 'recentMessages'
          ? 'Recent Messages'
          : currentPage === 'scanner'
          ? 'WhatsApp QR Scanner'
          : 'About'}
      </Text>
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity onPress={() => toggleDarkMode(false)}>
          <Icon
            name="sunny"
            size={16}
            color={isDarkMode ? '#999999' : '#FFB600'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleDarkMode(true)}>
          <Icon
            name="moon"
            size={14}
            color={isDarkMode ? '#FFFFFF' : '#666666'}
          />
        </TouchableOpacity>
        <Animated.View
          style={[styles.modeToggleButton, {left: togglePosition}]}>
          <Icon
            name={isDarkMode ? 'moon' : 'sunny'}
            size={14}
            style={styles.modeToggleIcon}
          />
        </Animated.View>
      </View>
    </View>
  );
}
