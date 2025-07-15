import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, signup, guestLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      return Alert.alert('Missing Fields', 'Please fill in all fields.');
    }

    try {
      setLoading(true);
      if (isLoginMode) {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password);
      }
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Authentication Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLoginMode ? 'Login' : 'Sign Up'}</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAuth} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLoginMode ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLoginMode(!isLoginMode)}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          {isLoginMode
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={guestLogin} style={styles.guestButton}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2196F3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  linkButton: { marginTop: 12 },
  linkText: {
    textAlign: 'center',
    color: '#666',
    textDecorationLine: 'underline',
  },
  guestButton: {
    marginTop: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  guestText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
  },
});
