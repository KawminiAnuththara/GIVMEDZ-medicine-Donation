import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../src/Config';
import { Picker } from '@react-native-picker/picker';

const DonationScreen = ({ navigation }) => {
  const [medicineName, setMedicineName] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [donorName, setDonorName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDonationSubmit = async () => {
    if (!medicineName || !medicineType || !quantity || !expirationDate || !donorName || !contact || !address) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!isAgreed) {
      Alert.alert('Error', 'You must agree to share your personal details with the recipient');
      return;
    }

    try {
      const donationData = {
        userId: firebase.auth().currentUser.uid,
        medicineName,
        medicineType,
        quantity,
        expirationDate,
        notes,
        donorName,
        contact,
        address,
        image,
        status: 'pending',
        donationDate: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firebase.firestore().collection('donations').add(donationData);
      
      // Send email to donor
      await firebase.functions().httpsCallable('sendDonationEmail')({
        email: firebase.auth().currentUser.email,
        donationId: docRef.id
      });

      Alert.alert('Success', 'Your donation has been submitted');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an error submitting your donation. Please try again.');
      console.error('Donation submission error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Donate Medicine</Text>
          <TextInput
            placeholder="Medicine Name"
            value={medicineName}
            onChangeText={setMedicineName}
            style={styles.input}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={medicineType}
              onValueChange={(itemValue) => setMedicineType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Medicine Type" value="" />
              <Picker.Item label="Tablet" value="Tablet" />
              <Picker.Item label="Liquid" value="Liquid" />
              <Picker.Item label="Injection" value="Injection" />
              <Picker.Item label="Capsule" value="Capsule" />
              <Picker.Item label="Drop" value="Drop" />
            </Picker>
          </View>
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Expiration Date"
            value={expirationDate}
            onChangeText={setExpirationDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Additional Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>Pick an image</Text>
          </TouchableOpacity> 
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <TextInput
            placeholder="Your Name"
            value={donorName}
            onChangeText={setDonorName}
            style={styles.input}
          />
          <TextInput
            placeholder="Contact Number"
            value={contact}
            onChangeText={setContact}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          <View style={styles.agreementContainer}>
            <Switch
              value={isAgreed}
              onValueChange={setIsAgreed}
            />
            <Text style={styles.agreementText}>I agree to share my personal details with the recipient</Text>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleDonationSubmit}>
            <Text style={styles.submitButtonText}>Submit Donation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imagePicker: {
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
