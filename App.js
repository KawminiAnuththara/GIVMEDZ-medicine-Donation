import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { firebase } from './src/Config';
import 'expo-dev-client';

// Import your screens
import MainScreen from './components/MainScreen';
import LoginScreen from './constant/LoginScreen';
import RegisterScreen from './constant/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import CustomDrawer from './components/CustomDrawer';
import ProfileScreen from './constant/ProfileScreen';
import MessageScreen from './constant/MessageScreen';
import OrderScreen from './constant/OrderScreen';
import SettingScreen from './constant/SettingScreen';
import TabNavigation from './src/TabNavigation';
import UserDonationandOrders from './constant/UserDonationandOrders';
import ProfileStackNavigator from './src/ProfileStackNavigator';
import ShowAll from './constant/ShowAll';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack for screens after user logs in
const AppStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={HomeScreen} name="HomeScreen" />
            {/* Add ShowAll here if it should be accessible after login */}
            <Stack.Screen component={ShowAll} name="ShowAll" />
        </Stack.Navigator>
    );
}

// Stack for authentication screens
const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen component={MainScreen} name="MainScreen" />
            <Stack.Screen component={LoginScreen} name="LoginScreen" />
            <Stack.Screen component={RegisterScreen} name="Register" />
            <Stack.Screen component={ShowAll} name="ShowAll" />
            {/* Remove HomeScreen from AuthStack if it's only for logged-in users */}
        </Stack.Navigator>
    );
}

// Drawer navigation for logged-in users
const DrawerNavigation = () => {
    return (
        <Drawer.Navigator 
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: 'teal',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: { marginLeft: 25, fontFamily: 'serif', fontSize: 15 },
            }}>
            <Drawer.Screen component={TabNavigation} name="Home" />
            <Drawer.Screen component={ProfileStackNavigator} name="Profile" />
            <Drawer.Screen component={MessageScreen} name="Message" />
            <Drawer.Screen component={OrderScreen} name="Order" />
            <Drawer.Screen component={SettingScreen} name="Setting" />
            <Drawer.Screen component={ShowAll} name="ShowAll" />
        </Drawer.Navigator>
    );
}

// Root navigator to switch between authenticated and non-authenticated stacks
const RootNavigator = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return (
        <NavigationContainer independent={true}>
            {user ? <DrawerNavigation /> : <AuthStack />}
        </NavigationContainer>
    );
}

export default RootNavigator;