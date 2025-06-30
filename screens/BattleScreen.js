import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

const prompt = "Battle typing mode is now active and intense!";

export default function BattleScreen() {
  const [p1Text, setP1Text] = useState('');
  const [p2Text, setP2Text] = useState('');
  const [p1Start, setP1Start] = useState(null);
  const [p2Start, setP2Start] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [winner, setWinner] = useState('');
  const [stats, setStats] = useState({ p1: {}, p2: {} });

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsActive(true);
    }
  }, [countdown]);

  // Calculate stats
  const calculateStats = (text, start) => {
    const now = Date.now();
    const minutes = (now - start) / 60000;
    const words = text.trim().split(/\s+/).length;
    const promptWords = prompt.trim().split(/\s+/);
    const typedWords = text.trim().split(/\s+/);
    let correct = 0;
    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === promptWords[i]) correct++;
    }
    const accuracy = Math.round((correct / promptWords.length) * 100);
    const wpm = Math.round(words / minutes);
    return { wpm, accuracy };
  };

  const handleTyping = (player, text) => {
    if (!isActive || winner) return;

    if (player === 'p1') {
      if (!p1Start && text.length === 1) setP1Start(Date.now());
      setP1Text(text);
      if (text.trim() === prompt) {
        const statsP1 = calculateStats(text, p1Start);
        setStats((prev) => ({ ...prev, p1: statsP1 }));
        setWinner('Player 1 Wins 🏆');
      }
    } else {
      if (!p2Start && text.length === 1) setP2Start(Date.now());
      setP2Text(text);
      if (text.trim() === prompt) {
        const statsP2 = calculateStats(text, p2Start);
        setStats((prev) => ({ ...prev, p2: statsP2 }));
        setWinner('Player 2 Wins 🥇');
      }
    }
  };

  const handleReset = () => {
    setP1Text('');
    setP2Text('');
    setP1Start(null);
    setP2Start(null);
    setCountdown(3);
    setIsActive(false);
    setWinner('');
    setStats({ p1: {}, p2: {} });
  };

  return (
    <View style={styles.container}>
      {countdown > 0 ? (
        <Text style={styles.countdown}>{countdown}</Text>
      ) : (
        <>
          <Text style={styles.prompt}>{prompt}</Text>

          <View style={styles.playerBlock}>
            <Text style={styles.label}>Player 1</Text>
            <TextInput
              style={styles.input}
              value={p1Text}
              onChangeText={(text) => handleTyping('p1', text)}
              editable={!winner}
              placeholder="Start typing..."
            />
            {stats.p1.wpm && (
              <Text style={styles.stats}>WPM: {stats.p1.wpm}, Accuracy: {stats.p1.accuracy}%</Text>
            )}
          </View>

          <View style={styles.playerBlock}>
            <Text style={styles.label}>Player 2</Text>
            <TextInput
              style={styles.input}
              value={p2Text}
              onChangeText={(text) => handleTyping('p2', text)}
              editable={!winner}
              placeholder="Start typing..."
            />
            {stats.p2.wpm && (
              <Text style={styles.stats}>WPM: {stats.p2.wpm}, Accuracy: {stats.p2.accuracy}%</Text>
            )}
          </View>

          {winner ? (
            <>
              <Text style={styles.winnerText}>{winner}</Text>
              <Button title="Battle Again" onPress={handleReset} />
            </>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  countdown: { fontSize: 48, textAlign: 'center', marginBottom: 20 },
  prompt: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  playerBlock: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  stats: { fontSize: 14, marginTop: 5 },
  winnerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: 'green',
  },
});
