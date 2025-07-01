import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { listenToRoom, updatePlayerData } from '../backend/firebase/battleService';

export default function BattleScreen({ route }) {
  const { roomId, playerName } = route.params;

  const [bothPlayersReady, setBothPlayersReady] = useState(false);
  const [playerText, setPlayerText] = useState('');
  const [opponentText, setOpponentText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [opponentName, setOpponentName] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [winner, setWinner] = useState('');
  const [prompt, setPrompt] = useState('');
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

  // ⏱️ Countdown logic
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsActive(true);
    }
  }, [countdown]);

  // 📡 Listen to room
  useEffect(() => {
  const unsub = listenToRoom(roomId, (roomData) => {
    if (!prompt && roomData.prompt) setPrompt(roomData.prompt);

    const players = roomData.players || {};
    const otherPlayers = Object.keys(players).filter((n) => n !== playerName);
    const opponent = otherPlayers[0];

    setOpponentName(opponent || 'Waiting...');

    // ⛔ Wait for both players
    if (Object.keys(players).length < 2) {
      setBothPlayersReady(false);
      setIsActive(false);       // Stop typing
      setCountdown(3);          // Reset countdown
      return;
    } else {
      setBothPlayersReady(true);
    }

    // ✅ Both players are here – now start the countdown if not already started
    if (!isActive && countdown === 3) {
      setCountdown(3); // triggers countdown effect
    }

    // Sync opponent’s text
    if (players[opponent]) {
      setOpponentText(players[opponent].typedText);
      if (players[opponent].finished && !winner) {
        setWinner(`${opponent} Wins 🥇`);
      }
    }

    if (players[playerName]?.finished && !winner) {
      setWinner(`${playerName} Wins 🏆`);
    }
  });

  return () => unsub();
}, [roomId, playerName, winner]);


  // 🧠 Stats calculator
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

  // 🎯 Handle typing
  const handleTyping = async (text) => {
    if (!isActive || winner) return;

    if (!startTime && text.length === 1) {
      setStartTime(Date.now());
    }

    setPlayerText(text);

    const isFinished = text.trim() === prompt;
    const newStats = isFinished ? calculateStats(text, startTime) : stats;

    if (isFinished) {
      setStats(newStats);
      setWinner(`${playerName} Wins 🏆`);
    }

    await updatePlayerData(roomId, playerName, {
      typedText: text,
      finished: isFinished,
      ...newStats,
    });
  };

  const handleReset = () => {
    Alert.alert("Reset", "Restarting is only available from the Lobby for now.");
  };

  return (
    <View style={styles.container}>
      {countdown > 0 ? (
        <Text style={styles.countdown}>{countdown}</Text>
      ) : (
        <>
          <Text style={styles.prompt}>{prompt}</Text>

          <View style={styles.playerBlock}>
            <Text style={styles.label}>{playerName}</Text>
            <TextInput
              style={styles.input}
              value={playerText}
              onChangeText={handleTyping}
              editable={bothPlayersReady && isActive && !winner} // 👈 Only type when ready
              placeholder={bothPlayersReady ? "Start typing..." : "Waiting for opponent..."}
              selectTextOnFocus={bothPlayersReady}
            />

            {stats.wpm ? (
              <Text style={styles.stats}>
                WPM: {stats.wpm}, Accuracy: {stats.accuracy}%
              </Text>
            ) : null}
          </View>

          <View style={styles.playerBlock}>
            <Text style={styles.label}>{opponentName}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#eee' }]}
              value={opponentText}
              editable={false}
            />
          </View>

          {winner ? (
            <>
              <Text style={styles.winnerText}>{winner}</Text>
              <Button title="Return to Lobby" onPress={() => Alert.alert("Not implemented yet")} />
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
