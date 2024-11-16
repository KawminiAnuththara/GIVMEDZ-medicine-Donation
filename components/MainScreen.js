import { StyleSheet, Text, View,SafeAreaView,TouchableOpacity,ImageBackground } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { BlurView } from "@react-native-community/blur";

export default function MainScreen({navigation}) {
    
  return (
    <SafeAreaView style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
      <ImageBackground source={require('../assets/1st.jpeg')} resizeMode='cover'  style={styles.image}>
      <View>
        <Text style={{fontSize:50,fontWeight:'bold',color:'#fff',fontFamily:"serif",marginTop:200,textAlign:'center'}}>GIVMEDZ</Text>
        <Text style={{fontSize:20,textAlign:"center,",color:"drakGray",marginBottom:10,textAlign:'center'}}>Find and Donate Medicine</Text>
      </View>

      <View >
      <TouchableOpacity style={{
        backgroundColor:'rgba(0,0,0,0.6)',
        padding:20,width:'90%',
        borderRadius:20,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:300,
        marginLeft:20,
        opacity:1,
        
      }}
          onPress={()=>navigation.navigate('LoginScreen')}>
        <Text style={{fontWeight:"bold",fontSize:18,color:'#fff',fontFamily:'serif',marginLeft:20}}>Let's Started</Text>
        <MaterialIcons name="arrow-forward-ios" size={22} color="#fff"/>
      </TouchableOpacity>
      </View>
      </ImageBackground>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
   image:{
    flex:1,
    width:'100%'
    
   }
})