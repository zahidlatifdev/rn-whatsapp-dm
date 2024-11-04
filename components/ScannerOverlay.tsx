import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ScannerOverlayProps {
  isScanning: boolean;
  flashEnabled: boolean;
  toggleFlashlight: () => void;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  isScanning,
  flashEnabled,
  toggleFlashlight,
}) => {
  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    frame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      borderRadius: 12,
    },
    text: {
      color: '#FFF',
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
    flashlightButton: {
      marginTop: 20,
      backgroundColor: '#25D366',
      padding: 16,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.frame} />
      <Text style={styles.text}>
        {isScanning
          ? 'Align QR code within frame to scan'
          : 'Processing scan...'}
      </Text>
      <TouchableOpacity
        style={styles.flashlightButton}
        onPress={toggleFlashlight}>
        <Icon
          name={flashEnabled ? 'flashlight' : 'flashlight-outline'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
};
