import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { Zocial } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../src/Config';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import google from '../assets/google.png';


//WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            alert(error.message);
        }
    };

  

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/1st.jpeg')} resizeMode='cover' style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{ padding: 28, flex: 1, justifyContent: 'center' }}>
                            <Text style={{
                                fontSize: 30,
                                fontFamily: 'serif',
                                fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: 20
                            }}>
                                Login
                            </Text>

                            <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 8, marginTop: 25 }}>
                                <Zocial name="email" size={24} color="white" style={{ marginRight: 20 }} />
                                <TextInput
                                    placeholder='Enter the Email'
                                    style={{ flex: 1, paddingVertical: 0, color: 'white' }}
                                    placeholderTextColor="white"
                                    onChangeText={setEmail}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, paddingBottom: 8, marginTop: 25 }}>
                                <FontAwesome5 name="lock" size={24} color="white" style={{ marginRight: 20 }} />
                                <TextInput
                                    placeholder='Enter the Password'
                                    style={{ flex: 1, paddingVertical: 0, color: 'white' }}
                                    placeholderTextColor="white"
                                    secureTextEntry
                                    onChangeText={setPassword}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                />
                                <TouchableOpacity onPress={() => { /* Add your forgot password logic here */ }}>
                                    <Text style={{ color: 'white', fontWeight: '700' }}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={loginUser} style={{
                                backgroundColor: 'teal',
                                padding: 20,
                                borderRadius: 20,
                                marginTop: 30,
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: '700',
                                    color: '#fff',
                                    fontSize: 18,
                                    fontFamily: 'serif'
                                }}>Login</Text>
                            </TouchableOpacity>

                            <Text style={{
                                textAlign: 'center',
                                color: '#fff',
                                marginTop: 30,
                                fontFamily: 'serif',
                                fontSize: 18
                            }}>Or, Login with ...</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
                                <TouchableOpacity onPress={() => { /* Add your Facebook login logic here */ }}>
                                    <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                                        <Image source={facebook} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{}}>
                                    <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                                        <Image source={google} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { /* Add your Twitter login logic here */ }}>
                                    <View style={{ borderColor: '#ddd', borderWidth: 2, borderRadius: 10, paddingHorizontal: 30, paddingVertical: 5 }}>
                                        <Image source={twitter} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, fontFamily: 'serif', textAlign: 'center', color: '#fff' }}>
                                    New to the App?
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 18, marginLeft: 5 }}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default LoginScreen;
