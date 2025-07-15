// components/MenuButton.js
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function MenuButton() {
  const { logout } = useAuth();
  const [visible, setVisible] = useState(false);

  const handleLogout = async () => {
    setVisible(false);
    await logout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Entypo name="dots-three-vertical" size={22} color="#333" />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.option}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Settings coming soon')}>
            <Text style={styles.option}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 40, right: 20, zIndex: 999 },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    padding: 6,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
  },
});
