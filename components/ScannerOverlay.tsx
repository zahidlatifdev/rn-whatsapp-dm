import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ScannerOverlayProps {
  isScanning: boolean;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({isScanning}) => {
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
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.frame} />
      <Text style={styles.text}>
        {isScanning
          ? 'Align QR code within frame to scan'
          : 'Processing scan...'}
      </Text>
    </View>
  );
};
