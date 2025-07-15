import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const filters = [
  { name: 'Normal', style: {} },
  { name: 'Warm', style: { backgroundColor: 'rgba(255, 200, 150, 0.1)' } },
  { name: 'Cool', style: { backgroundColor: 'rgba(100, 200, 255, 0.1)' } },
  { name: 'Gray', style: { backgroundColor: 'rgba(200, 200, 200, 0.2)' } },
];

const prompt = 'My name is Tumelo and i am a software developer. I love coding and creating new things.';

const KEYBOARD_LAYOUT = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];

export default function LiveScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [filterIndex, setFilterIndex] = useState(0);

  const [score, setScore] = useState(88);
  const [lastWpm, setLastWpm] = useState(70);
  const [topWpm, setTopWpm] = useState(120);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [topSpeed, setTopSpeed] = useState(0);
  const [lastWPM, setLastWPM] = useState(0);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50 && filterIndex > 0) {
          setFilterIndex(filterIndex - 1); // swipe right
        } else if (gesture.dx < -50 && filterIndex < filters.length - 1) {
          setFilterIndex(filterIndex + 1); // swipe left
        }
      },
    })
  ).current;

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <CameraView style={StyleSheet.absoluteFill} facing="front" />

      {/* Filter overlay */}
      <View style={[styles.filterOverlay, filters[filterIndex].style]} />

      {/* Filter name display */}
      <Text style={styles.filterLabel}>{filters[filterIndex].name}</Text>

      {/* Top HUD */}
      <View style={styles.topContainer}>
        {/* Profile + Follow */}
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={require('../assets/user-avatar.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.followText}>+ Follow</Text>
        </TouchableOpacity>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        {/* Viewers */}
        <View style={styles.viewersContainer}>
          {[1, 2, 3].map((v, i) => (
            <Image
              key={i}
              source={require('../assets/viewer.jpg')}
              style={styles.viewerAvatar}
            />
          ))}
        </View>
      </View>

      {/* WPM Stats */}
      <View style={styles.wpmContainer}>
        <View style={[styles.wpmBox, styles.gradientBox]}>
          <Text style={styles.wpmLabel}>Last WPM</Text>
          <Text style={styles.wpmValue}>{lastWpm}</Text>
        </View>
        <View style={[styles.wpmBox, styles.gradientBox2]}>
          <Text style={styles.wpmLabel}>Top WPM</Text>
          <Text style={styles.wpmValue}>{topWpm}</Text>
        </View>
      </View>

      {/* Live Indicator */}
      <View style={styles.overlay}>
        <Text style={styles.text}>🔴 You are Live</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  overlay: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 8,
  },
  text: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  topContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  profileContainer: { alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  followText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
    backgroundColor: '#007bff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewersContainer: { flexDirection: 'row' },
  viewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },

  wpmContainer: {
    position: 'absolute',
    top: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  wpmBox: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  wpmLabel: { fontSize: 12, color: '#fff', opacity: 0.7 },
  wpmValue: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  gradientBox: { backgroundColor: '#f77062' },
  gradientBox2: { backgroundColor: '#36d1dc' },

  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  filterLabel: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 2,
  },
});
