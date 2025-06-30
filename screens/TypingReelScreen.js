import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const prompt = "The quick brown fox jumps over the lazy dog";

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function TypingReelScreen() {
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [lastKey, setLastKey] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsActive(true);
      setStartTime(Date.now());
    }
  }, [countdown]);

  useEffect(() => {
    if (!isActive || typed.length === 0) return;

    const now = Date.now();
    const minutes = (now - startTime) / 60000;
    const words = typed.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(words / minutes);
    setWpm(isNaN(calculatedWpm) ? 0 : calculatedWpm);

    const promptWords = prompt.trim().split(/\s+/);
    const typedWords = typed.trim().split(/\s+/);
    let correct = 0;

    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === promptWords[i]) correct++;
    }

    const calculatedAccuracy = Math.round((correct / promptWords.length) * 100);
    setAccuracy(isNaN(calculatedAccuracy) ? 0 : calculatedAccuracy);
  }, [typed]);

  const handleTyping = (text) => {
    setTyped(text);
    const latestChar = text.slice(-1);
    if (latestChar) {
      setLastKey(latestChar.toUpperCase());
      setTimeout(() => setLastKey(''), 150); // fade out key highlight
    }
  };

  return (
    <View style={styles.container}>
      {countdown > 0 ? (
        <Text style={styles.countdown}>{countdown}</Text>
      ) : (
        <>
          <Text style={styles.prompt}>{prompt}</Text>
          <TextInput
            style={styles.input}
            value={typed}
            onChangeText={handleTyping}
            editable={isActive}
            placeholder="Start typing..."
            autoFocus
            multiline
          />
          <Text style={styles.stats}>WPM: {wpm}</Text>
          <Text style={styles.stats}>Accuracy: {accuracy}%</Text>

          <View style={styles.keyboard}>
            {KEY_ROWS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyRow}>
                {row.map((key) => (
                  <View
                    key={key}
                    style={[
                      styles.key,
                      lastKey === key ? styles.keyPressed : null
                    ]}
                  >
                    <Text style={styles.keyText}>{key}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' },
  prompt: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    fontSize: 18,
    padding: 10,
    borderRadius: 6,
    minHeight: 60,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  stats: { fontSize: 16, marginTop: 10 },
  countdown: { fontSize: 48, fontWeight: 'bold' },

  keyboard: { marginTop: 20 },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
  },
  key: {
    backgroundColor: '#ddd',
    margin: 2,
    padding: 10,
    borderRadius: 4,
    width: 30,
    alignItems: 'center',
  },
  keyPressed: {
    backgroundColor: '#2196F3',
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
