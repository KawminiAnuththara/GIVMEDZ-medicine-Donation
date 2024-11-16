import { View, Text,SafeAreaView,ScrollView,Image, ImageBackground,TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import {firebase} from '../src/Config'


const ProfileScreen = ({navigation}) => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')

  useEffect(()=>{
      firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot)=>{
          if(snapshot.exists){
              setName(snapshot.data())
          }
          else{
              console.log('user does not exist')
          }
      })
  },[])

  useEffect(()=>{
    firebase.firestore().collection('users')
    .doc(firebase.auth().currentUser.uid).get()
    .then((snapshot)=>{
        if(snapshot.exists){
            setEmail(snapshot.data())
        }
        else{
            console.log('user does not exist')
        }
    })
},[])
  return (
    <SafeAreaView>
      
      <View>
        <ImageBackground source={require('../assets/backe.jpg')} style={{
          width:'100%',
          height:'65%',
          borderBottomLeftRadius:30,
          borderBottomRightRadius:30
        }}>
          <Text style={{
            color:'white',
            fontFamily:'serif',
            fontWeight:'bold',
            fontSize:24,
            padding:20,
            marginTop:30
          }}>Profile</Text>
          </ImageBackground>
        
        <View style={{
          backgroundColor:'white',
          width:'90%',
          height:'80%',
          borderRadius:30,
          padding:20,
          marginLeft:20,
          marginTop:-350
          }}>
          <View style={{
            padding:10,
            flexDirection:'row',
            justifyContent:'space-between'
          }}>
          <TouchableOpacity>
               <AntDesign name="setting" size={24} color="black" />
          
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('EditProfileScreen')}>
          <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>
          </View>
          <Text style={{
            fontSize:18,
            fontFamily:'serif',
            fontWeight:'bold',
            textAlign:'center',
            marginTop:10
          }}>{name.fullname}</Text>
          <Text style={{
            textAlign:'center',
            color:'gray'
          }}>{email.email}</Text>

          <View style={{borderTopWidth:1,borderTopColor:'gray',marginTop:10}}>
             
              <TouchableOpacity onPress={()=>navigation.navigate('UserDonationandOrders')}>
              <View
               style={{
                  flexDirection:'row',
                   justifyContent:'space-between',
                   marginTop:20,
                   backgroundColor:'#f7f9f9',
                   borderRadius:10,
                   padding:10,
                   shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
              <FontAwesome5 name="tablets" size={24} color="black" />
              <Text style={{marginLeft:-80,fontFamily:'serif',fontWeight:'bold'}}>My Orders/Donation</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('Account')}>
              <View
               style={{
                  flexDirection:'row',
                   justifyContent:'space-between',
                   marginTop:20,
                   backgroundColor:'#f7f9f9',
                   borderRadius:10,
                   padding:10,
                   shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
              <MaterialCommunityIcons name="account" size={24} color="black" />
              <Text style={{marginLeft:-190,fontFamily:'serif',fontWeight:'bold'}}>Account</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('Share')}>
              <View
               style={{
                  flexDirection:'row',
                   justifyContent:'space-between',
                   marginTop:20,
                   backgroundColor:'#f7f9f9',
                   borderRadius:10,
                   padding:10,
                   shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
              <FontAwesome name="share-alt" size={24} color="black" />
              <Text style={{marginLeft:-80,fontFamily:'serif',fontWeight:'bold'}}>Share with Friends</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('ReviewForm')}>
              <View
               style={{
                  flexDirection:'row',
                   justifyContent:'space-between',
                   marginTop:20,
                   backgroundColor:'#f7f9f9',
                   borderRadius:10,
                   padding:10,
                   shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
              <MaterialIcons name="reviews" size={24} color="black" />
              <Text style={{marginLeft:-190,fontFamily:'serif',fontWeight:'bold'}}>Review</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>navigation.navigate('Info')}>
              <View
               style={{
                  flexDirection:'row',
                   justifyContent:'space-between',
                   marginTop:20,
                   backgroundColor:'#f7f9f9',
                   borderRadius:10,
                   padding:10,
                  
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
              <Entypo name="info-with-circle" size={24} color="black" />
              <Text style={{marginLeft:-190,fontFamily:'serif',fontWeight:'bold'}}>Info</Text>
              <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
              </TouchableOpacity>
              
             
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={{
                backgroundColor:'teal',
                padding:20,
                borderRadius:20,
                marginTop:30,
                marginBottom:10
                }}>
                <Text style={{
                    textAlign:'center',
                    fontWeight:700,
                    color:'#fff',
                    fontSize:18,
                    fontFamily:'serif'
                }}>Back</Text>
            </TouchableOpacity>
        </View>

        <View>
          <Image source={require('../assets/user.png')} style={{
            width:150,
            height:150,
            marginTop:-780,
            marginLeft:130
          }}/>
          
        </View>
      </View>
      
    </SafeAreaView>
  )
}

export default ProfileScreen