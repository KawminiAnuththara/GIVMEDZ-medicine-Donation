import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../src/Config';

const EditProfileScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || null);
    }
  }, []);

  const handleSave = async () => {
    const user = firebase.auth().currentUser;
    setLoading(true);

    try {
      if (user) {
        // Upload the new profile photo if available
        if (photoURL && !photoURL.startsWith('https://')) {
          const response = await fetch(photoURL);
          const blob = await response.blob();
          const ref = firebase.storage().ref().child(`profilePhotos/${user.uid}`);
          await ref.put(blob);
          const url = await ref.getDownloadURL();
          await user.updateProfile({ photoURL: url });
        }

        // Update display name
        await user.updateProfile({ displayName });

        // Update email if changed
        if (email !== user.email) {
          await user.updateEmail(email);
        }

        alert('Profile updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhotoURL(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="teal" />
      ) : (
        <>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={photoURL ? { uri: photoURL } : require('../assets/user.png')}
              style={styles.profileImage}
            />
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </TouchableOpacity>

          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display Name"
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
          />
          
          <Button title="Save" onPress={handleSave} color="teal" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#00796B',
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
  },
});

export default EditProfileScreen;
