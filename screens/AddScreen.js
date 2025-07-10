import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

export default function AddScreen() {
  const navigation = useNavigation();

  const handlePickVideo = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to media library.');
      return;
    }

    let result = await MediaLibrary.getAssetsAsync({
      mediaType: 'video',
      first: 1,
    });

    if (result.assets.length > 0) {
      const video = result.assets[0];
      Alert.alert('Video Selected', `Filename: ${video.filename}`);
      // You can handle or navigate with this video URI here
    } else {
      Alert.alert('No video found', 'Please record or save a video first.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add New</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TypingReelScreen')}>
        <Text style={styles.buttonText}>🎥 Record a Reel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Live')}>
        <Text style={styles.buttonText}>🔴 Go Live</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handlePickVideo}>
        <Text style={styles.buttonText}>📁 Upload from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
