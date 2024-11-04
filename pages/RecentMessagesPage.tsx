import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {MessageCard} from '../components/MessageCard';

interface RecentMessagesPageProps {
  isDarkMode: boolean;
  recentMessages: Array<{
    number: string;
    message: string;
    date: string;
    appType: string;
  }>;
  clearHistory: () => void;
  handleHistoryItemClick: (msg: any) => void;
}

export const RecentMessagesPage = ({
  isDarkMode,
  recentMessages,
  clearHistory,
  handleHistoryItemClick,
}: RecentMessagesPageProps) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    messageText: {
      color: isDarkMode ? '#CCCCCC' : '#666666',
      fontSize: 14,
    },
    button: {
      backgroundColor: '#25D366',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    clearButton: {
      backgroundColor: '#FF3B30',
      marginTop: 10,
      marginBottom: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
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
              <MessageCard
                key={index}
                msg={msg}
                isDarkMode={isDarkMode}
                onPress={() => handleHistoryItemClick(msg)}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};