import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ErrorPopupProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  isDarkMode: boolean;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  message,
  isVisible,
  onDismiss,
  isDarkMode,
}) => {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      alignItems: 'center',
      padding: 16,
    },
    popup: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxWidth: Dimensions.get('window').width - 32,
    },
    message: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: 14,
      flex: 1,
      marginRight: 8,
    },
    icon: {
      marginRight: 8,
    },
    closeButton: {
      padding: 4,
    },
  });

  if (!isVisible && translateY._value === -100) return null;

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY}]}]}>
      <View style={styles.popup}>
        <Icon
          name="alert-circle"
          size={24}
          color="#FF3B30"
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
          <Icon
            name="close"
            size={20}
            color={isDarkMode ? '#FFFFFF' : '#000000'}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
