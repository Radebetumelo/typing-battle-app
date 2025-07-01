import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './navigation/MainTabs';





export default function App() {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Home">
    //     <Stack.Screen name="Home" component={HomeScreen} />
    //     <Stack.Screen name="TypingReel" component={TypingReelScreen} />
    //     <Stack.Screen name="BattleScreen" component={BattleScreen} />
    //     <Stack.Screen name="Profile" component={ProfileScreen} />
    //     <Stack.Screen name="MultiplayerLobby" component={MultiplayerLobbyScreen} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
