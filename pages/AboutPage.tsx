import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

interface AboutPageProps {
  isDarkMode: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ isDarkMode }) => {
  const styles = StyleSheet.create({
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
  });

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
};