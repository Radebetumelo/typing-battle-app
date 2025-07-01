// backend/firebase/battleService.js
import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// 1. Create a new battle room
export const createBattleRoom = async (creatorName) => {
  const roomId = generateRoomCode();
  const roomRef = doc(db, 'battleRooms', roomId);

  await setDoc(roomRef, {
    status: 'waiting', // waiting | active | finished
    prompt: "Typing battles are exciting and competitive!",
    createdAt: Date.now(),
    players: {
      [creatorName]: {
        typedText: '',
        wpm: 0,
        accuracy: 0,
        finished: false
      }
    }
  });

  return roomId;
};

// 2. Join an existing room
export const joinBattleRoom = async (roomId, playerName) => {
  const roomRef = doc(db, 'battleRooms', roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error('Room does not exist');
  }

  const roomData = roomSnap.data();

  if (Object.keys(roomData.players).length >= 2) {
    throw new Error('Room is full');
  }

  await updateDoc(roomRef, {
    [`players.${playerName}`]: {
      typedText: '',
      wpm: 0,
      accuracy: 0,
      finished: false
    },
    status: 'active'
  });
};

// 3. Live room updates (listener)
export const listenToRoom = (roomId, callback) => {
  const roomRef = doc(db, 'battleRooms', roomId);

  return onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

// 4. Update player progress
export const updatePlayerData = async (roomId, playerName, data) => {
  const roomRef = doc(db, 'battleRooms', roomId);
  await updateDoc(roomRef, {
    [`players.${playerName}`]: data
  });
};

// Utility to generate 6-letter room codes
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
