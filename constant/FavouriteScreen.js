import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Modal, Pressable, Image } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { firebase } from '../src/Config';

const FavouriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesSnapshot = await firebase.firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .collection('favorites')
          .get();

        const favoriteData = favoritesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched favorites:', favoriteData); // Debug log

        setFavorites(favoriteData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = (itemId) => {
    console.log('Toggling favorite for itemId:', itemId); // Debug log

    setFavorites(prevFavorites => prevFavorites.map(item =>
      item.id === itemId
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ));
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.medicineImage }} style={styles.medicineImage} />

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.medicineName}</Text>
        <Text style={styles.cardDescription}>Donor: {item.donorName}</Text>
      </View>
      
      <View style={styles.cardIcons}>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <AntDesign
            name={item.isFavorite ? 'heart' : 'hearto'}
            size={28}
            color={item.isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name="trash-outline"
            size={28}
            color="black"
            style={styles.removeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="teal" barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AntDesign name="hearto" size={24} color="white" style={styles.heartIcon} />
          <Text style={styles.headerText}>Favourite</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="reorder-three-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? <ActivityIndicator size="large" color="teal" /> : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={item => item.id}
          />
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="settings-outline" size={24} color="teal" />
              <Text style={styles.modalText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="log-out-outline" size={24} color="teal" />
              <Text style={styles.modalText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="share-social-outline" size={24} color="teal" />
              <Text style={styles.modalText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'teal',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    marginRight: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
  },
  cardIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
  },
  removeIcon: {
    marginLeft: 20,
  },
});
