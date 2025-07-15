import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';
import TypingReelScreen from '../screens/TypingReelScreen';
import LiveScreen from '../screens/LiveScreen';
import MultiplayerLobbyScreen from '../screens/MultiplayerLobbyScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, isGuest } = useAuth();

  const isLoggedIn = user || isGuest;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="TypingReel" component={TypingReelScreen} />
          <Stack.Screen name="Live" component={LiveScreen} />
          <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
