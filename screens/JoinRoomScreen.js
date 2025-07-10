import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function JoinRoomScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Room</Text>
      <Text>Enter a code to join a friend's battle room.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});
