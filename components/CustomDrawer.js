import { View, Text, ImageBackground, Image, TouchableOpacity, Modal, Pressable, Linking, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { firebase } from '../src/Config';

const CustomDrawer = (props) => {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log('User does not exist');
        }
      });
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        props.navigation.replace('Login');
      })
      .catch(error => console.log('Error logging out: ', error));
  };

  const handleShare = (platform) => {
    let url = '';
    switch (platform) {
      case 'google':
        url = 'https://play.google.com/store/apps/details?id=com.example.app'; // Replace with your app URL
        break;
      case 'facebook':
        url = 'https://www.facebook.com/sharer/sharer.php?u=https://example.com'; // Replace with your app URL
        break;
    }
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: 'teal' }}>
        <ImageBackground source={require('../assets/backe.jpg')} style={{ padding: 20 }}>
          <Image source={require('../assets/user.png')} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }} />
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'serif', fontWeight: 'bold' }}> {name.fullname}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'serif' }}>Admin</Text>
            <MaterialIcons name="admin-panel-settings" size={24} color="white" />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="share-2" size={24} color="black" />
            <Text style={{ fontSize: 15, fontFamily: 'serif', marginLeft: 8 }}>Tell a Friend</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome name="sign-out" size={24} color="black" />
            <Text style={{ fontSize: 15, fontFamily: 'serif', marginLeft: 8 }}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Share Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleShare('google')}>
              <Ionicons name="logo-google" size={24} color="teal" />
              <Text style={styles.modalText}>Share on Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleShare('facebook')}>
              <Ionicons name="logo-facebook" size={24} color="teal" />
              <Text style={styles.modalText}>Share on Facebook</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    marginHorizontal: 40,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 10,
  },
});

export default CustomDrawer;
