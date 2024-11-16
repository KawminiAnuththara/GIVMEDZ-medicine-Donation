import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ImageBackground } from 'react-native';
import { firebase } from '../src/Config';
import { FontAwesome } from '@expo/vector-icons';

const ReviewScreen = ({ navigation }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState({});
  const [selectedReviewId, setSelectedReviewId] = useState(null); 
  const backgroundImage = require('../assets/backe.jpg'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid).get();
        if (userSnapshot.exists) {
          setUserData(userSnapshot.data());
        } else {
          console.log('User does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewSnapshot = await firebase.firestore().collection('reviews').orderBy('timestamp', 'desc').get();
        const reviewsData = reviewSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchUserData();
    fetchReviews();
  }, []);

  const handleReviewSubmit = async () => {
    if (!reviewText || rating === 0) {
      alert('Please enter a review and rating');
      return;
    }

    try {
      const reviewData = {
        userId: firebase.auth().currentUser.uid,
        reviewText,
        rating,
        userName: userData.fullname || 'Anonymous',
        userProfileImage: userData.profileImage || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        likes: [], 
      };

      await firebase.firestore().collection('reviews').add(reviewData);
      alert('Review submitted successfully');
      setReviewText('');
      setRating(0);
     
      const reviewSnapshot = await firebase.firestore().collection('reviews').orderBy('timestamp', 'desc').get();
      const reviewsData = reviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await firebase.firestore().collection('reviews').doc(reviewId).delete();
      
      const reviewSnapshot = await firebase.firestore().collection('reviews').orderBy('timestamp', 'desc').get();
      const reviewsData = reviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
      setSelectedReviewId(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        alert('Please login to like reviews.');
        return;
      }

      const reviewRef = firebase.firestore().collection('reviews').doc(reviewId);
      const reviewSnapshot = await reviewRef.get();
      if (!reviewSnapshot.exists) {
        console.error('Review not found.');
        return;
      }

      const reviewData = reviewSnapshot.data();
      const likes = reviewData.likes || [];
      if (likes.includes(user.uid)) {
        
        const updatedLikes = likes.filter(uid => uid !== user.uid);
        await reviewRef.update({ likes: updatedLikes });
      } else {
        
        const updatedLikes = [...likes, user.uid];
        await reviewRef.update({ likes: updatedLikes });
      }

    
      const updatedReviewSnapshot = await firebase.firestore().collection('reviews').orderBy('timestamp', 'desc').get();
      const updatedReviewsData = updatedReviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(updatedReviewsData);
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const renderStarRating = (currentRating) => {
    return (
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
          <FontAwesome
            key={index}
            name={index < currentRating ? 'star' : 'star-o'}
            size={24}
            color="gold"
            onPress={() => setRating(index + 1)}
          />
        ))}
      </View>
    );
  };

  const canModifyReview = (review) => {
    const user = firebase.auth().currentUser;
    return user && review.userId === user.uid;
  };

  const toggleSelectedReview = (reviewId) => {
    setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <View style={styles.reviewInputContainer}>
          <TextInput
            placeholder="Write your review..."
            value={reviewText}
            onChangeText={setReviewText}
            style={styles.input}
          />
          {renderStarRating(rating)}
          <TouchableOpacity style={styles.button} onPress={handleReviewSubmit}>
            <Text style={styles.buttonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
        <FlatList
  data={reviews}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => toggleSelectedReview(item.id)}
      style={styles.reviewItem}
    >
      <View style={styles.reviewHeader}>
        {item.userProfileImage ? (
          <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.userName}>{item.userName}</Text>
      </View>
      <Text style={styles.reviewText}>{item.reviewText}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp?.toDate().toLocaleString() || 'Just now'}
      </Text>
      <View style={styles.starContainer}>
        {[...Array(5)].map((_, index) => (
          <FontAwesome
            key={index}
            name={index < item.rating ? 'star' : 'star-o'}
            size={20}
            color="gold"
          />
        ))}
      </View>
      {selectedReviewId === item.id && (
        <View style={styles.interactionContainer}>
          <TouchableOpacity onPress={() => handleLikeReview(item.id)}>
            <FontAwesome
              name={item.likes && item.likes.includes(userData.uid) ? 'heart' : 'heart-o'}
              size={24}
              color={item.likes && item.likes.includes(userData.uid) ? 'red' : 'black'}
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
          {canModifyReview(item) && (
            <>
              <TouchableOpacity onPress={() => handleDeleteReview(item.id)}>
                <FontAwesome name="trash-o" size={24} color="red" style={{ marginRight: 20 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => alert('Implement Edit Review functionality')}>
                <FontAwesome name="edit" size={24} color="green" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  )}
/>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding:20,
    color: 'white',
    marginLeft:50,
    marginBottom:40
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'teal',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 5,
  },


  reviewItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  interactionContainer:{
    flexDirection:'row',
    marginLeft:'60%'
  }
});

export default ReviewScreen;
