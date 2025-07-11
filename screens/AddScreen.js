import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.getParent()?.navigate('TypingReel')}>
        <Ionicons name="videocam" size={40} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.getParent()?.navigate('Live')}>
        <MaterialCommunityIcons name="broadcast" size={40} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => alert('Choose from gallery')}>
        <Ionicons name="images" size={40} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconButton: {
    marginHorizontal: 20,
  },
});
