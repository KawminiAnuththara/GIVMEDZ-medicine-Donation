import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from '../components/HomeScreen'
import DonationScreen from '../constant/DonationScreen';
import FavouriteScreen from '../constant/FavouriteScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Tab=createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{
        tabBarShowLabel:false,
        headerShown:false,
        tabBarStyle:{backgroundColor:'teal',borderTopLeftRadius:30,borderTopRightRadius:30},
        tabBarInactiveTintColor:'#fff',
        tabBarActiveBackgroundColor:'purple'
    }}>
        <Tab.Screen name='Home2' component={HomeScreen} options={{
            tabBarIcon:()=>(
                <Feather name="home" size={25} color="white" />
            )
        }}/>
        <Tab.Screen name='Donation' component={DonationScreen} options={{
            tabBarBadge:3,
            tabBarIcon:()=>(
                <FontAwesome6 name="hand-holding-medical" size={25} color="white" />
            )
        }}/>
        <Tab.Screen name='Favourite' component={FavouriteScreen} options={{
            tabBarIcon:()=>(
                <MaterialIcons name="favorite-border" size={25} color="white" />
            )
        }}/>
    </Tab.Navigator>
  )
}

export default TabNavigation