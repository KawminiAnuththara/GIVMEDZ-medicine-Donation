import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { firebase } from '../src/Config';
import MasonryList from '@react-native-seoul/masonry-list';

export default function HomeScreen({ navigation }) {
  const [activeMedicineType, setActiveMedicineType] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [donations, setDonations] = useState([]);
  const [name, setName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [medicineTypes, setMedicineTypes] = useState(["All"]);

  const data = [
    {
      id: 1,
      title: 'First Medicine',
      image: require('../assets/8th.jpg'),
    },
    {
      id: 2,
      title: 'Second Medicine',
      image: require('../assets/10th.png'),
    },
    {
      id: 3,
      title: 'Third Medicine',
      image: require('../assets/9th.jpg'),
    },
    {
      id: 4,
      title: 'Fourth Medicine',
      image: require('../assets/11th.jpg'),
    },
    {
      id: 5,
      title: 'Fifth Medicine',
      image: require('../assets/14th.jpeg'),
    },
    {
      id: 6,
      title: 'Sixth Medicine',
      image: require('../assets/12th.jpeg'),
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid).get();
        if (userSnapshot.exists) {
          setName(userSnapshot.data());
        } else {
          console.log('User does not exist');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDonationData = async () => {
      try {
        const donationSnapshot = await firebase.firestore().collection('donations').get();
        const donationsData = donationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDonations(donationsData);
        updateMedicineTypes(donationsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching donation data:', error);
        setError(true);
        setIsLoading(false);
      }
    };

    const updateMedicineTypes = (donationsData) => {
      const newMedicineTypes = new Set(["All"]);
      donationsData.forEach(item => {
        newMedicineTypes.add(item.medicineType);
      });
      setMedicineTypes(Array.from(newMedicineTypes));
    };

    fetchUserData();
    fetchDonationData();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => console.log('Error logging out: ', error));
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      setActiveMedicineType("All");
    } else {
      setActiveMedicineType("Search");
    }
  };

  const filteredDonations = activeMedicineType === "All" ? donations : 
    activeMedicineType === "Search" ? donations.filter(donation => 
      (donation.title && donation.title.toLowerCase().includes(searchText.toLowerCase()))
    ) : 
    donations.filter(donation => donation.medicineType === activeMedicineType);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={require('../assets/user.png')} style={styles.userImage} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: '#fff', fontFamily: 'serif', marginLeft: 10, marginTop: 10, fontWeight: 'bold' }}>Hello,</Text>
            <Text style={{ color: '#fff', fontFamily: 'serif', marginLeft: 7 }}>{name.fullname}</Text>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchbar}>
          <TextInput 
            placeholder='Search' 
            style={styles.textInput}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Feather name="search" size={24} color="teal" style={styles.search} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.Imagecontainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Let's Donate Medicine</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ShowAll')}>
              <Text style={styles.headerBtn}>Show All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            {isLoading ? (
              <ActivityIndicator size={20} color={'teal'} />
            ) : error ? (
              <Text>Something went wrong</Text>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={data}
                renderItem={({ item }) => (
                  <View>
                    <Image source={item.image} style={styles.sliderImage} />
                  </View>
                )}
                keyExtractor={item => item.id.toString()}
                horizontal
              />
            )}
          </View>
        </View>
        <View style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between', padding: 3, margin: 10 }}>
          <Text style={{ fontWeight: 'bold', fontFamily: 'serif', fontSize: 18 }}>Categories</Text>
        </View>
        <View>
          <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20 }}>
              {medicineTypes.filter(type => type !== 'Tablet').map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setActiveMedicineType(type)}
                  style={{
                    width: 100,
                    height: 45,
                    padding: 10,
                    borderRadius: 20,
                    borderColor: 'teal',
                    borderWidth: 2,
                    marginRight: 10,
                    backgroundColor: activeMedicineType === type ? 'teal' : 'transparent'
                  }}
                >
                  <Text style={{ color: activeMedicineType === type ? '#fff' : '#666', fontSize: 15, fontFamily: 'serif', textAlign: 'center' }}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <ScrollView>
          <View>
          <View style={styles.cardContainer}>
            {isLoading ? (
              <ActivityIndicator size={20} color={'teal'} />
            ) : error ? (
              <Text>Something went wrong</Text>
            ) : (
              <MasonryList
                 key={'grid'} // Key to force re-render
                 showsVerticalScrollIndicator={false}
                 showsHorizontalScrollIndicator={false}
                 data={filteredDonations}
                 numColumns={3} 
                 renderItem={({ item }) => (
                   <TouchableOpacity onPress={() => navigation.navigate('Order', { medicine: item })}>
                      <Image source={{ uri: item.image }} style={styles.gridImage} />
                   </TouchableOpacity>
                 )}
                keyExtractor={item => item.id.toString()}
                 contentContainerStyle={styles.gridContentContainer}
              />
            )}
          </View>
        </View>
        </ScrollView>
        <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2024 GivMedz. All rights reserved.</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')}>
          <Image
            source={require('../assets/facebook.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.twitter.com')}>
          <Image
            source={require('../assets/twitter.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com')}>
          <Image
            source={require('../assets/google.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.yoursite.com/privacy-policy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.linkSeparator}> | </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.yoursite.com/terms')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </View>
      </ScrollView>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'teal',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 110,
    marginTop: 10
  },
  textInput: {
    padding: 7,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '85%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchbar: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  search: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8
  },
  sliderImage: {
    width: 270,
    height: 150,
    borderRadius: 20,
    objectFit: 'contain'
  },
  Imagecontainer: {
    marginTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#002400',
    fontWeight: 'bold',
    marginLeft: 10
  },
  headerBtn: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#006400',
    marginRight: 10
  },
  cardContainer: {
    marginTop: 12,
  },
  gridImage: {
    height: 100,
    width: 120,
    borderRadius: 30,
    margin: 5, // Adjust the margin for grid items
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight:5
  },
  gridContentContainer: {
    padding: 15, // Optional padding for the grid container
  },
  footerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 160,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
  },
  iconContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  linkText: {
    color: '#6c757d',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    color: '#6c757d',
  },
  
});

