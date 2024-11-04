import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {messageTemplates} from '../utils/lib/messageTemplates';

export default function DirectMessagePage({
  selectedApp,
  setSelectedApp,
  renderCountryPicker,
  isDarkMode,
  phoneNumber,
  setPhoneNumber,
  callingCode,
  selectedTemplate,
  handleTemplateChange,
  message,
  setMessage,
  handleSendMessage,
}) {
  const styles = StyleSheet.create({
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
    input: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
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
  });
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
                selectedApp === 'whatsapp' && styles.selectedAppOptionText,
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
                selectedApp === 'business' && styles.selectedAppOptionText,
              ]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>
        {renderCountryPicker()}
        <View style={styles.phoneNumberContainer}>
          <Text style={styles.countryCodeText}>+{callingCode}</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
