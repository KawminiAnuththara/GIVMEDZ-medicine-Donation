import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { firebase } from '../src/Config';
import { MaterialIcons } from '@expo/vector-icons';

const OrderScreen = ({ route, navigation }) => {
    const { medicine } = route.params || {}; // Provide a default empty object
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [notes, setNotes] = useState('');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    // Always call useEffect, even if medicine might be undefined
    useEffect(() => {
        if (!medicine || !medicine.id) {
            Alert.alert('No Medicine Selected', 'Please select a medicine first.');
            navigation.navigate('Home');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userSnapshot = await firebase.firestore().collection('users')
                    .doc(firebase.auth().currentUser.uid).get();
                if (userSnapshot.exists) {
                    setUser(userSnapshot.data());
                    checkIfFavorite(userSnapshot.data());
                } else {
                    console.log('User does not exist');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [medicine]); // Ensure this runs only when 'medicine' changes

    const checkIfFavorite = async (userData) => {
        try {
            const favoriteSnapshot = await firebase.firestore()
                .collection('users')
                .doc(userData.uid)
                .collection('favorites')
                .where('medicineId', '==', medicine.id)
                .get();

            setIsFavorite(!favoriteSnapshot.empty);
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async () => {
        try {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            const favoriteRef = userRef.collection('favorites').doc(medicine.id);

            if (isFavorite) {
                await favoriteRef.delete();
                setIsFavorite(false);
                Alert.alert('Success', 'Removed from favorites');
            } else {
                await favoriteRef.set({
                    medicineId: medicine.id,
                    medicineName: medicine.medicineName,
                    donorName: medicine.donorName,
                });
                setIsFavorite(true);
                Alert.alert('Success', 'Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorites. Please try again.');
        }
    };

    const handleOrderSubmit = async () => {
        if (!name || !address || !contact) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const db = firebase.firestore();
        const batch = db.batch();

        try {
            const orderData = {
                userId: firebase.auth().currentUser.uid,
                medicineId: medicine.id,
                medicineName: medicine.medicineName,  // Include medicine name
                donorName: medicine.donorName,        // Include donor name
                name,
                address,
                contact,
                notes,
                status: 'pending',
                orderDate: firebase.firestore.FieldValue.serverTimestamp(),
            };

            const orderRef = db.collection('orders').doc();
            batch.set(orderRef, orderData);

            const medicineRef = db.collection('donations').doc(medicine.id);
            batch.delete(medicineRef);

            await batch.commit();

            // Success alert after the order has been submitted
            Alert.alert('Success', 'Your order has been submitted, and the item has been removed from the category');
            navigation.goBack();

            // The cloud function will trigger automatically after the order is written to Firestore.
        } catch (error) {
            Alert.alert('Error', 'There was an error submitting your order. Please try again.');
            console.error('Order submission error:', error);
        }
    };

    if (!medicine || !medicine.id) {
        // Prevent rendering any UI if there's no medicine selected
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.medicineDetails}>
                    <View style={{ flexDirection: 'row', padding: 10, }}>
                        <Image source={{ uri: medicine.image }} style={styles.image} />
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                            <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={34} color={isFavorite ? 'red' : 'white'} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>{medicine.medicineName}</Text>
                    <Text style={styles.subtitle}>{medicine.medicineType}</Text>
                </View>

                <View style={styles.orderForm}>
                    <Text style={styles.formTitle}>Order Details</Text>
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
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
                        placeholder="Additional Notes"
                        value={notes}
                        onChangeText={setNotes}
                        style={styles.input}
                        multiline
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleOrderSubmit}>
                        <Text style={styles.submitButtonText}>Submit Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.submitButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'teal',
    },
    medicineDetails: {
        padding: 40,
        backgroundColor: 'teal',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 230,
        height: 150,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 15,
        color: '#222',
    },
    orderForm: {
        padding: 40,
        backgroundColor: '#fff',
        borderTopLeftRadius: 90,
        borderBottomRightRadius: 90,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'teal',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: -30,
        zIndex: 1,
    },
});
