import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { firebase } from '../src/Config';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
    
        const fetchUserData = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                const snapshot = await firebase.firestore().collection('users').doc(user.uid).get();
                if (snapshot.exists) {
                    const userData = snapshot.data();
                    setName(userData.fullName);
                    setEmail(userData.email);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch(error => console.log('Error logging out: ', error));
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(previousState => !previousState);
    };

    const handleSaveProfile = () => {
        
        const user = firebase.auth().currentUser;
        if (user) {
            firebase.firestore().collection('users').doc(user.uid).update({
                fullName: name,
                email: email,
            }).then(() => {
                console.log('Profile updated successfully');
            }).catch(error => console.log('Error updating profile: ', error));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Enable Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggleNotifications}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Management</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.aboutText}>GIVMEDZ App Version 1.0</Text>
                    <Text style={styles.aboutText}>Contact us at support@givmedz.com</Text>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={24} color="white" />
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                           backgroundColor: 'teal',
                           padding: 15,
                           borderRadius: 5,
                           alignItems: 'center',
                           marginTop:10
                           }} onPress={()=>navigation.navigate('Home')}>
                        <Text style={styles.saveButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding:10,
        marginTop:10
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: 'teal',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    aboutText: {
        fontSize: 16,
        marginBottom: 5,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
        
    },
});

export default SettingsScreen;
