import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const prompt = 'Typing reels are the future of focus and flow!';

const KEYBOARD_LAYOUT = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M']
];

export default function TypingReelScreen() {
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [score, setScore] = useState(0);
  const [topSpeed, setTopSpeed] = useState(0);
  const [lastWPM, setLastWPM] = useState(0);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (typed.length === prompt.length) {
      setLastWPM(wpm);
      if (wpm > topSpeed) setTopSpeed(wpm);
    }
  }, [typed]);

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

    // Recalculate stats
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

      const newScore = Math.round((currentWPM * currentAccuracy) / 100);
      setScore(newScore);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        style={styles.hiddenInput}
        value=""
        onChangeText={(text) => {
          const last = text.slice(-1);
          handleKeyPress(last);
        }}
      />

      <View style={styles.statsBox}>
        <Text style={styles.stat}>⚡ WPM: {wpm}</Text>
        <Text style={styles.stat}>🎯 Accuracy: {accuracy}%</Text>
        <Text style={styles.stat}>🏅 Score: {score}</Text>
        <Text style={styles.stat}>⏪ Last: {lastWPM} WPM</Text>
        <Text style={styles.stat}>🌟 Top: {topSpeed} WPM</Text>
      </View>

      <View style={styles.promptContainer}>
        {prompt.split('').map((char, index) => {
          const isCurrent = index === typed.length;
          return (
            <Text
              key={index}
              style={[
                styles.letter,
                isCurrent && styles.currentLetter
              ]}
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
                style={[
                  styles.key,
                  activeKey === key && styles.keyActive
                ]}
              >
                <Text style={styles.keyText}>{key}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  hiddenInput: { opacity: 0, position: 'absolute', height: 1, width: 1 },
  statsBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 2,
  },
  promptContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  letter: {
    fontSize: 26,
    margin: 2,
    fontWeight: '500',
    color: '#222',
  },
  currentLetter: {
    textDecorationLine: 'underline',
    textDecorationColor: '#2196F3',
    textDecorationStyle: 'solid',
  },
  keyboardContainer: {
    alignItems: 'center',
    marginTop: 10,
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
});
