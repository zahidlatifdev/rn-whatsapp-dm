import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BottomNav({
  currentPage,
  fadeAnim,
  isDarkMode,
  handlePageChange,
}) {
  const styles = StyleSheet.create({
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
  });
  return (
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
  );
}
