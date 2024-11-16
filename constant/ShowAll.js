import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

export default function ShowAll() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Let's Donate Medicine</Text>
            </View>
            <View style={styles.content}>
                <Image 
                    source={require('../assets/8th.jpg')} // Replace with your image path
                    style={styles.image}
                />
                <Text style={styles.subTitle}>Why Do We Need to Donate?</Text>
                <Text style={styles.text}>
                    Donating medicine helps provide essential medications to those who cannot afford them. It ensures that surplus medicines reach those in need rather than being wasted. Your donation can make a huge difference in someone's life.
                </Text>
                <Text style={styles.subTitle}>Benefits of Donating Medicine</Text>
                <Text style={styles.text}>
                    - Helps reduce medical waste and environmental impact.
                    {'\n'}- Provides essential medications to underprivileged communities.
                    {'\n'}- Promotes a culture of giving and community support.
                </Text>
                <Text style={styles.subTitle}>Why Use GIVMEDZ App?</Text>
                <Text style={styles.text}>
                    GIVMEDZ app connects donors with those in need. It's easy to use and ensures that your donations are properly managed and distributed. The app also provides tracking and updates, so you know exactly how your donation is making a difference.
                </Text>
                <Text style={styles.subTitle}>Usage of GIVMEDZ App</Text>
                <Text style={styles.text}>
                    - Create an account to get started.
                    {'\n'}- Browse available medicines or donate your surplus.
                    {'\n'}- Track your donations and see their impact.
                </Text>
                <Text style={styles.contactTitle}>Contact Us</Text>
                <Text style={styles.contactText}>For further information:</Text>
                <Text style={styles.contactText}>Phone: +123 456 7890</Text>
                <Text style={styles.contactText}>Email: support@givmedz.com</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
    },
    header: {
        backgroundColor: 'teal',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    content: {
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'serif',
    },
    text: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 20,
        fontFamily: 'serif',
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 30,
        marginBottom: 10,
        fontFamily: 'serif',
    },
    contactText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'serif',
    }
});
