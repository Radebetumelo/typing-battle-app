import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import TypingReelScreen from '../screens/TypingReelScreen';
import LiveScreen from '../screens/LiveScreen';
import MultiplayerLobbyScreen from '../screens/MultiplayerLobbyScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TypingReel" component={TypingReelScreen} />
      <Stack.Screen name="Live" component={LiveScreen} />
      <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
    </Stack.Navigator>
  );
}
