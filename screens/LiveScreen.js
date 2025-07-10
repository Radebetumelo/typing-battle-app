import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function LiveScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleLive = () => {
    setIsLive((prev) => !prev);
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>No access to camera.</Text></View>;
  }

  return (
    <View style={styles.container}>
      {isLive && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ref={cameraRef}
        >
          <View style={styles.overlay}>
            <Text style={styles.liveText}>🔴 LIVE</Text>
            {/* Future: Add typing prompt + stats overlay */}
          </View>
        </Camera>
      )}

      <TouchableOpacity style={styles.button} onPress={toggleLive}>
        <Text style={styles.buttonText}>{isLive ? 'Stop Live' : 'Go Live'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,0,0,0.2)',
    padding: 6,
    borderRadius: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
    margin: 20,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});
