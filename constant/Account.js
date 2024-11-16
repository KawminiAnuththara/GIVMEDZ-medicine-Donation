import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground, TouchableOpacity } from 'react-native';
import { firebase } from '../src/Config';
import { Ionicons } from '@expo/vector-icons';

const Account = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid).get();
        if (userSnapshot.exists) {
          setUserData(userSnapshot.data());
        } else {
          console.log('User does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/backe.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={24} color="white" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Information</Text>
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          {userData && (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Full Name</Text>
                <Text style={styles.cardDetail}>{userData.fullname}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Email</Text>
                <Text style={styles.cardDetail}>{userData.email}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Phone</Text>
                <Text style={styles.cardDetail}>{userData.telephone}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Address</Text>
                <Text style={styles.cardDetail}>{userData.address}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Favorite Item</Text>
                <Text style={styles.cardDetail}>{userData.favoriteItem || 'Not set'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default Account;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Subtle dark overlay for clarity
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5, // For subtle shadow effect on Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, // For subtle shadow on iOS
  },
  cardContent: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDetail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
