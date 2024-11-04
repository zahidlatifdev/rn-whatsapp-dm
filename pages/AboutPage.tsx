import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AboutPageProps {
  isDarkMode: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({isDarkMode}) => {
  const [rating, setRating] = useState(0);

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
    button: {
      backgroundColor: '#25D366',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 16,
    },
    star: {
      marginHorizontal: 4,
    },
  });

  const handleRateApp = () => {
    Linking.openURL('market://details?id=com.wadirect.mza');
  };

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  return (
    <ScrollView>
      <Text style={styles.aboutText}>Version 1.0.0</Text>
      <Text style={styles.aboutText}>
        WhatsApp Direct is a convenient tool to send WhatsApp messages without
        saving contacts. It's designed for quick and easy communication on the
        go.
      </Text>
      <Text style={styles.aboutText}>Features:</Text>
      <View style={styles.aboutList}>
        <Text style={styles.aboutListItem}>
          • Send messages to unsaved numbers
        </Text>
        <Text style={styles.aboutListItem}>• Recent messages history</Text>
        <Text style={styles.aboutListItem}>• Dark mode support</Text>
        <Text style={styles.aboutListItem}>• Multiple country codes</Text>
        <Text style={styles.aboutListItem}>
          • View and save WhatsApp statuses
        </Text>
        <Text style={styles.aboutListItem}>
          • QR code scanner for WhatsApp links
        </Text>
        <Text style={styles.aboutListItem}>
          • Message templates for quick replies
        </Text>
      </View>
      <Text style={styles.aboutText}>
        WhatsApp Direct is your go-to app for seamless communication without the
        hassle of saving contacts. Whether you're a business professional or
        just someone who values efficiency, our app is designed to make your
        life easier.
      </Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Icon
              name={star <= rating ? 'star' : 'star-outline'}
              size={30}
              color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRateApp}>
        <Icon name="star" size={24} color="#FFD700" />
        <Text style={styles.buttonText}>Rate Us on Play Store</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
