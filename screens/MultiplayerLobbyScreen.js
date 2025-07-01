import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createBattleRoom, joinBattleRoom } from '../backend/firebase/battleService';

export default function MultiplayerLobbyScreen({ navigation }) {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = async () => {
    if (!playerName) return Alert.alert('Enter your name');

    try {
      const newRoomId = await createBattleRoom(playerName);
      Alert.alert('Room created!', `Room Code: ${newRoomId}`);
      navigation.navigate('BattleScreen', { roomId: newRoomId, playerName });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName || !roomId) return Alert.alert('Enter name and room code');

    try {
      await joinBattleRoom(roomId.toUpperCase(), playerName);
      navigation.navigate('BattleScreen', { roomId: roomId.toUpperCase(), playerName });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Multiplayer Lobby</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={playerName}
        onChangeText={setPlayerName}
      />

      <Button title="Create Room" onPress={handleCreateRoom} />

      <Text style={styles.or}>OR</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Room Code"
        value={roomId}
        onChangeText={setRoomId}
        autoCapitalize="characters"
      />

      <Button title="Join Room" onPress={handleJoinRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6,
    padding: 12, fontSize: 16, marginBottom: 10,
    backgroundColor: '#f9f9f9'
  },
  or: { textAlign: 'center', marginVertical: 10, fontWeight: 'bold' },
});
