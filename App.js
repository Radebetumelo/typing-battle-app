import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import TypingReelScreen from './screens/TypingReelScreen';
import BattleScreen from './screens/BattleScreen';
import ProfileScreen from './screens/ProfileScreen';
import MultiplayerLobbyScreen from './screens/MultiplayerLobbyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TypingReel" component={TypingReelScreen} />
        <Stack.Screen name="Battle" component={BattleScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
