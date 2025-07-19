import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  PanResponder,
  Animated,
  NativeModules, // Import NativeModules
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const { ScreenRecorder } = NativeModules; // Access the native module

const prompt =
  'My name is Tumelo and i am a software developer. I love coding and creating new things.';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const filters = [
  { name: '', style: {} },
  { name: '', style: { backgroundColor: 'rgba(255, 200, 150, 0.1)' } },
  { name: '', style: { backgroundColor: 'rgba(100, 200, 255, 0.1)' } },
  { name: '', style: { backgroundColor: 'rgba(200, 200, 200, 0.2)' } },
];

export default function TypingReelScreen() {
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWPM] = useState(0);
  const [recording, setRecording] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [score, setScore] = useState(0);
  const [topSpeed, setTopSpeed] = useState(0);
  const [cameraRef, setCameraRef] = useState(null);
  const [lastWPM, setLastWPM] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [filterIndex, setFilterIndex] = useState(0);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const recordingTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();

      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      if (audioStatus !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Audio recording permission is required to record videos.'
        );
      }

      if (!mediaPermission?.granted) await requestMediaPermission();
    })();
  }, []);

  useEffect(() => {
    if (typed.length === prompt.length) {
      setLastWPM(wpm);
      if (wpm > topSpeed) setTopSpeed(wpm);
    }
  }, [typed]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50 && filterIndex > 0) {
          setFilterIndex(filterIndex - 1);
        } else if (gesture.dx < -50 && filterIndex < filters.length - 1) {
          setFilterIndex(filterIndex + 1);
        }
      },
    })
  ).current;

  const handleKeyPress = (char) => {
    const key = char.toUpperCase();
    if (typed.length >= prompt.length) return;

    if (!startTime) setStartTime(Date.now());

    const nextChar = prompt[typed.length];
    if (key === nextChar.toUpperCase()) {
      setTyped((prev) => prev + key);
    }

    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 150);

    const now = Date.now();
    const minutes = (now - startTime) / 60000;
    const words = typed.trim().split(/\s+/).length;
    if (minutes > 0) {
      const currentWPM = Math.round(words / minutes);
      setWPM(currentWPM);

      const correct = typed
        .split('')
        .filter((c, i) => c === prompt[i])
        .length;
      const currentAccuracy = Math.round((correct / prompt.length) * 100);
      setAccuracy(currentAccuracy);

      const newScore = Math.round(currentWPM * currentAccuracy);
      setScore(newScore);
    }
  };

  const startRecording = async () => {
    if (!ScreenRecorder) {
      Alert.alert('ScreenRecorder not available', 'Native module is missing.');
      return;
    }

    if (recording) return;

    setRecording(true);

    try {
      // Start screen recording using the native module
      await ScreenRecorder.startRecording();

      // Start progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 60000,
        useNativeDriver: false,
      }).start();

      // Auto-stop after 60 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording(true); // true means auto-stopped
      }, 60000);
    } catch (err) {
      console.warn('Recording error:', err);
      Alert.alert('Recording Failed', 'Failed to start screen recording.');
      setRecording(false);
      progressAnim.setValue(0);
    }
  };

  const stopRecording = async () => {
    if (!ScreenRecorder) {
      Alert.alert('ScreenRecorder not available', 'Native module is missing.');
      return;
    }

    if (!recording) return;

    try {
      // Stop screen recording using the native module
      await ScreenRecorder.stopRecording();
      Alert.alert('Saved!', 'Video saved to your gallery.');
    } catch (err) {
      console.warn('Stop recording error:', err);
      Alert.alert('Stop Recording Failed', 'Failed to stop screen recording.');
    } finally {
      setRecording(false);
      progressAnim.setValue(0);
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
        recordingTimeout.current = null;
      }
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CameraView
          mode="video"
          style={StyleSheet.absoluteFill}
          key={facing}
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={() => {
            setIsCameraReady(true);
            Alert.alert('Camera is ready!');
          }}
        />
      </View>
      <View style={[styles.filterOverlay, filters[filterIndex].style]} />

      <Text style={styles.filterLabel}>{filters[filterIndex].name}</Text>

      <TouchableOpacity
        onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>Flip</Text>
      </TouchableOpacity>

      <TextInput
        autoFocus
        style={styles.hiddenInput}
        value=""
        onChangeText={(text) => {
          const last = text.slice(-1);
          handleKeyPress(last);
        }}
      />
      <View style={styles.overlayContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        <View style={styles.wpmContainer}>
          <View style={[styles.wpmBox, styles.gradientBox]}>
            <Text style={styles.wpmLabel}>Last WPM</Text>
            <Text style={styles.wpmValue}>{lastWPM}</Text>
          </View>
          <View style={[styles.wpmBox, styles.gradientBox3]}>
            <Text style={styles.wpmLabel}>Accuracy</Text>
            <Text style={styles.wpmValue}>{accuracy}%</Text>
          </View>
          <View style={[styles.wpmBox, styles.gradientBox2]}>
            <Text style={styles.wpmLabel}>Top WPM</Text>
            <Text style={styles.wpmValue}>{topSpeed}</Text>
          </View>
        </View>

        <View style={styles.promptContainer}>
          {prompt.split('').map((char, index) => {
            const isCurrent = index === typed.length;
            return (
              <Text
                key={index}
                style={[styles.letter, isCurrent && styles.currentLetter]}
              >
                {char}
              </Text>
            );
          })}
        </View>

        <View style={styles.keyboardContainer}>
          {KEYBOARD_LAYOUT.map((row, rIdx) => (
            <View key={rIdx} style={styles.keyRow}>
              {row.map((key) => (
                <View
                  key={key}
                  style={[styles.key, activeKey === key && styles.keyActive]}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.recordContainer}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={recording ? stopRecording : startRecording}
        />
        {recording && (
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  hiddenInput: { opacity: 0, position: 'absolute', height: 1, width: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  promptContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 300, // ⬅️ Push it below stats
    paddingHorizontal: 10,
    zIndex: 1, // ensure it's above camera but below score
  },
  letter: {
    fontSize: 20,
    margin: 2,
    fontWeight: '500',
    color: '#fff',
  },
  currentLetter: {
    textDecorationLine: 'underline',
    textDecorationColor: '#2196F3',
    textDecorationStyle: 'solid',
  },
  keyboardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 190,
    zIndex: 1,
  },
  keyRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  key: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  keyActive: {
    backgroundColor: '#2196F3',
  },
  keyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  scoreContainer: {
    width: '100%',
    position: 'absolute',
    top: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    zIndex: 5, // same here
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'linear-gradient(45deg, #f77062, #36d1dc, #8E2DE2)',
  },
  wpmContainer: {
    position: 'absolute',
    top: 90,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    zIndex: 5, // higher than prompt and keys
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
  gradientBox3: { backgroundColor: '#8E2DE2' },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  filterLabel: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 2,
  },
  toggleButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  recordContainer: {
    width: '80%',
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  recordButton: {
    backgroundColor: '#000',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 40,
  },
  progressBar: {
    height: 7,
    backgroundColor: '#2196F3',
    position: 'absolute',
    bottom: 5,
    left: 0,
    width: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2, // Ensure it's above the camera
    backgroundColor: 'transparent', // Make sure it's transparent
  },
});