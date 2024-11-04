import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  ReactNativeScannerView,
  Commands,
} from '@pushpendersingh/react-native-scanner';
import {ScannerOverlay} from '../components/ScannerOverlay';
import {handleQRCodeScanned} from '../utils/lib/scannerUtils';
import Icon from 'react-native-vector-icons/Ionicons';

interface ScannerPageProps {
  isDarkMode: boolean;
  setCurrentPage: (page: string) => void;
  setCountryCode: (code: string) => void;
  setPhoneNumber: (number: string) => void;
  setCallingCode: (code: string) => void;
  saveScannedLinkToHistory: (link: string, type: string) => void;
  selectedApp: string;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  isDarkMode,
  setCurrentPage,
  setCountryCode,
  setPhoneNumber,
  setCallingCode,
  saveScannedLinkToHistory,
  selectedApp,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const cameraRef = useRef(null);

  const onQRCodeScanned = ({nativeEvent}) => {
    handleQRCodeScanned({
      nativeEvent,
      isScanning,
      setIsScanning,
      setCurrentPage,
      setCountryCode,
      setPhoneNumber,
      setCallingCode,
      saveScannedLinkToHistory,
      selectedApp,
    });
  };

  const toggleFlashlight = () => {
    if (flashEnabled) {
      Commands.disableFlashlight(cameraRef.current);
    } else {
      Commands.enableFlashlight(cameraRef.current);
    }
    setFlashEnabled(!flashEnabled);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F0F0F0',
    },
    cameraContainer: {
      flex: 1,
    },
    flashlightButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#25D366',
      padding: 16,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ReactNativeScannerView
        ref={cameraRef}
        style={styles.cameraContainer}
        onQrScanned={onQRCodeScanned}
        scanEnabled={isScanning}
      />
      <ScannerOverlay
        isScanning={isScanning}
        flashEnabled={flashEnabled}
        toggleFlashlight={toggleFlashlight}
      />
    </View>
  );
};
