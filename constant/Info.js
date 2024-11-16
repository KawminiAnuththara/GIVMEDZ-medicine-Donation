import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const InfoScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>About GivMedz</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.subtitle}>What is GivMedz?</Text>
                <Text style={styles.text}>
                    GivMedz is a platform designed to connect people in need of medicine with generous donors who are willing to give away unneeded medications. We aim to reduce medicine waste and help those who cannot afford essential drugs.
                </Text>

                <Text style={styles.subtitle}>How Does It Work?</Text>
                <Text style={styles.text}>
                    Simply browse through the available medications, select what you need, and submit an order request. Donors who have the medicine you're looking for will contact you to arrange delivery or pickup. All transactions are free, and our platform ensures a smooth and simple donation process.
                </Text>

                <Text style={styles.subtitle}>Why Donate Medicines?</Text>
                <Text style={styles.text}>
                    Every year, millions of medications are discarded while many people lack access to the medicine they need. GivMedz helps bridge this gap by allowing people to donate unused, unexpired medicines and make a direct impact on someone's life.
                </Text>

                <Text style={styles.subtitle}>Join Us Today</Text>
                <Text style={styles.text}>
                    Whether you have medicines to donate or are looking for medications, GivMedz is here to help. Join our community and be part of a sustainable solution to medicine waste.
                </Text>
            </View>
        </ScrollView>
    );
};

export default InfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'teal',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'teal',
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
        color: '#333',
    },
});
