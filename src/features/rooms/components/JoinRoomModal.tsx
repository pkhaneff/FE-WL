import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { roomService } from '../services';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinRoomModal = ({ visible, onClose, onSuccess }: Props) => {
  const [joinCode, setJoinCode] = useState('');
  const [passRoom, setPassRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!joinCode.trim() || !passRoom.trim()) return;
    setLoading(true);
    setError('');
    try {
      await roomService.joinRoom(joinCode.toUpperCase(), passRoom);
      setJoinCode('');
      setPassRoom('');
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white p-6 rounded-2xl w-full max-w-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">Join a Room</Text>
          <Text className="text-gray-500 mb-6">Enter the room code and pass shared by your partner.</Text>
          
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-base mb-2 border border-gray-200 text-center uppercase"
            placeholder="e.g. HOME99A"
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="characters"
            maxLength={7}
          />
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-base mb-2 border border-gray-200"
            placeholder="Room pass"
            secureTextEntry
            value={passRoom}
            onChangeText={setPassRoom}
          />

          {error ? <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text> : null}

          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity 
              className="flex-1 p-4 rounded-xl bg-gray-100 items-center"
              onPress={onClose}
              disabled={loading}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 p-4 rounded-xl bg-blue-600 items-center"
              onPress={handleJoin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Join Room</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
