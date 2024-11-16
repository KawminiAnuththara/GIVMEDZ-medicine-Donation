import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../constant/ProfileScreen';
import UserDonationandOrders from '../constant/UserDonationandOrders';
import Account from '../constant/Account';
import EditProfileScreen from '../constant/EditProfileScreen';
import ReviewForm from '../constant/ReviewForm';
import ShowAll from '../constant/ShowAll';
import InfoScreen from '../constant/Info';
import ShareWithFriends from '../constant/ShareWithFriends';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
            <ProfileStack.Screen name="UserDonationandOrders" component={UserDonationandOrders} />
            <ProfileStack.Screen  name="Account" component={Account}/>
            <ProfileStack.Screen  name="EditProfileScreen" component={EditProfileScreen}/>
            <ProfileStack.Screen name="ReviewForm" component={ReviewForm}/>
            <ProfileStack.Screen name="Info" component={InfoScreen}/>
            <ProfileStack.Screen name="Share" component={ShareWithFriends}/>
           
        </ProfileStack.Navigator>
    );
}

export default ProfileStackNavigator;
