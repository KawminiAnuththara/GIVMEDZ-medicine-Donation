import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Fontisto, Feather, Ionicons, Entypo, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { firebase } from '../src/Config';
import facebook from '../assets/facebook.png';
import google from '../assets/google.png';
import twitter from '../assets/twitter.png';

const Register = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userReg = async (email, password, confirmPassword, fullname, address, telephone, date) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.auth().currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://medicinedonation-d6d57.firebaseapp.com',
      });
      alert('Verification email sent');
      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
        fullname,
        address,
        telephone,
        date,
        email,
        password,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/1st.jpeg')} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ padding: 30, backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 30,
                fontFamily: 'serif',
                fontWeight: 'bold',
                marginTop: 60,
                color: 'white',
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Register
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              <TouchableOpacity onPress={() => { }}>
                <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                  <Image source={facebook} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { }}>
                <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                  <Image source={google} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { }}>
                <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                  <Image source={twitter} />
                </View>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                marginTop: 30,
                fontFamily: 'serif',
                fontSize: 18,
                marginBottom: 20,
              }}>
              Or, Register with Email...
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Enter the Full Name'
                style={styles.input}
                onChangeText={setFullname}
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Enter the Address'
                style={styles.input}
                onChangeText={setAddress}
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <Foundation name="telephone" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Enter the Telephone Number'
                style={styles.input}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <Fontisto name="date" size={24} color="white" style={styles.icon} />
              <TouchableOpacity onPress={() => setOpen(true)} style={{ flex: 1 }}>
                <Text style={{ color: 'white', paddingVertical: 8 }}>Enter Date of Birth</Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              open={open}
              date={date}
              mode={'date'}
              maximumDate={new Date('2023-01-01')}
              minimumDate={new Date('1980-01-01')}
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Enter the Email'
                style={styles.input}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="lock" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Enter the Password'
                style={styles.input}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor="white"
              />
            </View>

            <View style={styles.inputContainer}>
              <Entypo name="lock" size={24} color="white" style={styles.icon} />
              <TextInput
                placeholder='Confirm the Password'
                style={styles.input}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                placeholderTextColor="white"
              />
            </View>

            <TouchableOpacity
              onPress={() => userReg(email, password, confirmPassword, fullname, address, telephone, date)}
              style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center' }}>
              <Text style={styles.alreadyRegisteredText}>Already registered?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginTop: 25,
  },
  icon: {
    marginRight: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: 'white',
  },
  registerButton: {
    backgroundColor: 'teal',
    padding: 20,
    borderRadius: 20,
    marginTop: 30,
  },
  registerButtonText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'serif',
  },
  alreadyRegisteredText: {
    fontSize: 18,
    fontFamily: 'serif',
    textAlign: 'center',
    color: 'white',
  },
  loginText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 5,
  },
};

export default Register;
