import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CreateRoomScreen from '../screens/CreateRoomScreen';
import JoinRoomScreen from '../screens/JoinRoomScreen';
import TypingReelScreen from '../screens/TypingReelScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LiveScreen from '../screens/LiveScreen';
import AddScreen from '../screens/AddScreen';





const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Create') iconName = 'game-controller';
          else if (route.name === 'Join') iconName = 'person-add';
          else if (route.name === 'Add') iconName = 'videocam';
          else if (route.name === 'Profile') iconName = 'person-circle';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Create" component={CreateRoomScreen} />
      <Tab.Screen name="Add" component={AddScreen} />

      <Tab.Screen name="Join" component={JoinRoomScreen} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} />
      
    </Tab.Navigator>
  );
}
