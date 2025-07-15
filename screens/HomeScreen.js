import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MenuButton from '../components/MenuButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    < SafeAreaView style={{ flex: 1}}>
    <View style={{ flex: 1 }}>
  <MenuButton />
  {/* rest of your screen content */}
</View>
    <View style={styles.container}>
      <Text style={styles.title}>🏁 Typing Battle App</Text>
      <Button title="Typing Reel" onPress={() => navigation.navigate('TypingReel')} />
      <Button title="Battle Mode" onPress={() => navigation.navigate('Battle')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
       
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
});
