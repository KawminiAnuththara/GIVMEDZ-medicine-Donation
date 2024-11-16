import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { firebase } from '../src/Config';

export default function UserDonationandOrders({ navigation }) {
    const [donations, setDonations] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = firebase.auth().currentUser.uid;

                // Fetch donations
                const donationSnapshot = await firebase.firestore().collection('donations')
                    .where('userId', '==', userId)
                    .get();
                const donationsData = donationSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Fetch orders
                const orderSnapshot = await firebase.firestore().collection('orders')
                    .where('userId', '==', userId)
                    .get();
                const ordersData = orderSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setDonations(donationsData);
                setOrders(ordersData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(true);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleDeleteDonation = async (donationId) => {
        try {
            await firebase.firestore().collection('donations').doc(donationId).delete();
            setDonations(donations.filter(donation => donation.id !== donationId));
            Alert.alert('Deleted!', 'Your donation has been deleted successfully.');
        } catch (error) {
            console.error('Error deleting donation:', error);
            Alert.alert('Error', 'Failed to delete the donation. Please try again.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await firebase.firestore().collection('orders').doc(orderId).delete();
            setOrders(orders.filter(order => order.id !== orderId));
            Alert.alert('Deleted!', 'Your order has been deleted successfully.');
        } catch (error) {
            console.error('Error deleting order:', error);
            Alert.alert('Error', 'Failed to delete the order. Please try again.');
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        const date = timestamp.toDate();
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Your Donations</Text>
                {isLoading ? (
                    <ActivityIndicator size={20} color={'teal'} />
                ) : error ? (
                    <Text>Something went wrong</Text>
                ) : (
                    <FlatList
                        data={donations}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text>{item.medicineType}</Text>
                                    <Text>{formatDate(item.donationDate)}</Text>
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Donation', { donationId: item.id })}>
                                            <Text style={styles.editButton}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteDonation(item.id)}>
                                            <Text style={styles.deleteButton}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

                <Text style={styles.title}>Your Orders</Text>
                {isLoading ? (
                    <ActivityIndicator size={20} color={'teal'} />
                ) : error ? (
                    <Text>Something went wrong</Text>
                ) : (
                    <FlatList
                        data={orders}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text>{item.medicineType}</Text>
                                    <Text>{formatDate(item.orderDate)}</Text>
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Order', { orderId: item.id })}>
                                            <Text style={styles.editButton}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteOrder(item.id)}>
                                            <Text style={styles.deleteButton}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        color: 'blue',
        fontWeight: 'bold',
    },
    deleteButton: {
        color: 'red',
        fontWeight: 'bold',
    },
});
