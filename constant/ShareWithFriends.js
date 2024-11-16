import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Share, Alert } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const ShareWithFriends = () => {

    const onShare = async (platform) => {
        try {
            const message = 'Check out GivMedz! A great platform for donating and receiving medicine. Visit: www.givmedz.com';

            if (platform === 'google') {
                await Share.share({
                    message: `${message} Share via Google`,
                });
            } else if (platform === 'facebook') {
                await Share.share({
                    message: `${message} Share via Facebook`,
                });
            } else {
                await Share.share({
                    message: message,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to share the content.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Share GivMedz with Friends</Text>
            
            <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.shareButton} onPress={() => onShare('google')}>
                    <FontAwesome name="google" size={50} color="#DB4437" />
                    <Text style={styles.platformText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton} onPress={() => onShare('facebook')}>
                    <FontAwesome name="facebook" size={50} color="#4267B2" />
                    <Text style={styles.platformText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton} onPress={() => onShare('other')}>
                    <MaterialCommunityIcons name="share-variant" size={50} color="#007AFF" />
                    <Text style={styles.platformText}>Others</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ShareWithFriends;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5F8F2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00796B',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    shareButton: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    platformText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#00796B',
    },
});
