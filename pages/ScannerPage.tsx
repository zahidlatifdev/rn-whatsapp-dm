import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {ReactNativeScannerView} from '@pushpendersingh/react-native-scanner';
import {ScannerOverlay} from '../components/ScannerOverlay';
import {handleQRCodeScanned} from '../utils/lib/scannerUtils';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#F0F0F0',
    },
    cameraContainer: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <ReactNativeScannerView
        style={styles.cameraContainer}
        onQrScanned={onQRCodeScanned}
        scanEnabled={isScanning}
      />
      <ScannerOverlay isScanning={isScanning} />
    </View>
  );
};
