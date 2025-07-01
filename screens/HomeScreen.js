import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏁 Typing Battle App</Text>
      <Button title="Typing Reel" onPress={() => navigation.navigate('TypingReel')} />
      <Button title="Battle Mode" onPress={() => navigation.navigate('Battle')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Battle Lobby" onPress={() => navigation.navigate('MultiplayerLobby')} />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
});
