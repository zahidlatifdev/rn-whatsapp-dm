// utils/lib/scannerUtils.ts
import {Alert, Linking} from 'react-native';

interface QRCodeScannerParams {
  nativeEvent: any;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  setCurrentPage: (page: string) => void;
  setCountryCode: (code: string) => void;
  setPhoneNumber: (number: string) => void;
  setCallingCode: (code: string) => void;
  saveScannedLinkToHistory: (link: string, type: string) => void;
  selectedApp: string;
}

export const handleQRCodeScanned = ({
  nativeEvent,
  isScanning,
  setIsScanning,
  setCurrentPage,
  setCountryCode,
  setPhoneNumber,
  setCallingCode,
  saveScannedLinkToHistory,
  selectedApp,
}: QRCodeScannerParams) => {
  if (!isScanning) return;

  const scannedValue = nativeEvent?.value;
  console.log('Scanned value:', scannedValue);
  setIsScanning(false);

  if (scannedValue) {
    // Handle different WhatsApp QR formats
    const qrMatch = scannedValue.match(/wa\.me\/qr\//);
    const phoneNumberMatch = scannedValue.match(/wa\.me\/(\d+)/);
    const businessMatch = scannedValue.match(/wa\.me\/message\//);

    if (qrMatch) {
      Linking.openURL(scannedValue).catch(err => {
        console.error('Error opening link:', err);
        Alert.alert(
          'Error',
          'Could not open WhatsApp. Please make sure it is installed.',
        );
      });
      saveScannedLinkToHistory(scannedValue, 'qr');
    } else if (phoneNumberMatch && phoneNumberMatch[1]) {
      handlePhoneNumberQR(phoneNumberMatch[1], {
        setCountryCode,
        setPhoneNumber,
        setCurrentPage,
        saveScannedLinkToHistory,
      });
    } else if (businessMatch) {
      Linking.openURL(scannedValue).catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert(
          'Error',
          'Could not open WhatsApp Business. Please make sure it is installed.',
        );
      });
      saveScannedLinkToHistory(scannedValue, 'message');
    } else {
      Alert.alert('Invalid QR Code', 'Please scan a valid WhatsApp QR code');
    }
  }

  // Reset scanning after delay
  setTimeout(() => {
    setIsScanning(true);
  }, 2000);
};

const handlePhoneNumberQR = (
  scannedNumber: string,
  {setCountryCode, setPhoneNumber, setCurrentPage, saveScannedLinkToHistory},
) => {
  let foundCountryCode = false;
  for (const country of countryCodes) {
    if (scannedNumber.startsWith(country.value)) {
      setCountryCode(country.value);
      setPhoneNumber(scannedNumber.substring(country.value.length));
      foundCountryCode = true;
      break;
    }
  }
  if (!foundCountryCode) {
    setPhoneNumber(scannedNumber);
  }
  setCurrentPage('directMessage');
  saveScannedLinkToHistory(scannedNumber, 'number');
};