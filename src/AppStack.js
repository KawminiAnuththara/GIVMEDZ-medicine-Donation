import { View, Text } from 'react-native'
import React,{useState,useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import MainScreen from '../components/MainScreen';
import LoginScreen from '../constant/LoginScreen';
import Capsule from '../components/Capsule';
import Tablet from '../components/Tablet';
import RegisterScreen from '../constant/RegisterScreen';
import { firebase } from './Config';
import HomeScreen from '../components/HomeScreen';
import CustomDrawer from '../components/CustomDrawer';
import ShowAll from '../constant/ShowAll';


const Stack=createStackNavigator();

const AppStack = () => {

  const [initializing,setInitializing]=useState(true);
  const [user,setUser]=useState();

  function onAuthStateChanged(user){
    setUser(user);

    if(initializing) setInitializing(false);
  }
  useEffect(()=>{
    const subscriber=firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);
  if (initializing) return null;

  if(!user){
    return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen component={MainScreen} name="MainScreen" />
      <Stack.Screen component={CustomDrawer} name="CustomDrawer"/>
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={Capsule} name="Capsule" />
      <Stack.Screen component={Tablet} name="Tablet" />
      <Stack.Screen component={RegisterScreen} name="Register"/>
      <Stack.Screen component={ShowAll} name="ShowAll"/>
      
      
        </Stack.Navigator>
    );
  }
  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
       <Stack.Screen component={HomeScreen} name="HomeScreen" />
    </Stack.Navigator>
  )
  
}

export default ()=>{
  return(
    <NavigationContainer independent={true}>
      <AppStack/>
    </NavigationContainer>
  )
}