import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { firebase } from '../src/Config';

const ReviewList = ({ donorId, recipientId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('reviews')
      .where('donorId', '==', donorId)
      .where('recipientId', '==', recipientId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
      });

    return () => unsubscribe();
  }, [donorId, recipientId]);

  const renderReview = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
      <View style={styles.reviewContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={styles.star}>
              {index < item.rating ? '★' : '☆'}
            </Text>
          ))}
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reviews}
      renderItem={renderReview}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 18,
    color: 'gold',
  },
  comment: {
    color: '#555',
  },
});

export default ReviewList;
