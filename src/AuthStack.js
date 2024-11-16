import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import ProfileScreen from '../constant/ProfileScreen';
import MessageScreen from '../constant/MessageScreen';
import OrderScreen from '../constant/OrderScreen';
import SettingScreen from '../constant/SettingScreen';
import CustomDrawer from '../components/CustomDrawer';
import TabNavigation from './TabNavigation';
const Drawer=createDrawerNavigator();


const AuthStack = () => {
  return (
    <Drawer.Navigator drawerContent={props=><CustomDrawer {...props}/>}
     screenOptions={{headerShown:false,
     drawerActiveBackgroundColor:'teal',
     drawerActiveTintColor:'#fff',
     drawerInactiveTintColor:'#333',
     drawerLabelStyle:{marginLeft:25,fontFamily:'serif',fontSize:15}}}>
      
        <Drawer.Screen component={TabNavigation} name="Home"/>
        <Drawer.Screen component={ProfileScreen} name="Profile" />
        <Drawer.Screen component={MessageScreen} name="Message" />
        <Drawer.Screen component={OrderScreen} name="Order" />
        <Drawer.Screen component={SettingScreen} name="Setting" />
    
    </Drawer.Navigator>
  )
}

export default AuthStack