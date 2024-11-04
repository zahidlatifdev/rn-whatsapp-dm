// components/MessageCard.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MessageCardProps {
  msg: {
    number: string;
    message: string;
    date: string;
    appType: string;
  };
  isDarkMode: boolean;
  onPress: () => void;
}

export const MessageCard = ({msg, isDarkMode, onPress}: MessageCardProps) => {
  const styles = StyleSheet.create({
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
      color: '#999999',
      marginTop: 8,
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
  });

  return (
    <TouchableOpacity style={styles.messageCard} onPress={onPress}>
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
    </TouchableOpacity>
  );
};
