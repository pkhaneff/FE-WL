import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { roomService } from '../../src/features/rooms/services';
import { useRouter, Stack } from 'expo-router';

export default function CreateRoomScreen() {
  const [name, setName] = useState('');
  const [passRoom, setPassRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim() || !passRoom.trim()) return;
    setLoading(true);
    try {
      const room = await roomService.createRoom(name, passRoom);
      router.replace(`/rooms/${room.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Create Room', headerShown: true }} />
      <View className="p-6 flex-1">
        <Text className="text-lg font-bold text-gray-800 mb-2">Room Name</Text>
        <Text className="text-sm text-gray-500 mb-4">Give your shared wishlist a special name.</Text>
        
        <TextInput
          className="bg-gray-100 p-4 rounded-xl text-base border border-gray-200 mb-6"
          placeholder="e.g. Our Anniversary"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text className="text-lg font-bold text-gray-800 mb-2">Room Pass</Text>
        <Text className="text-sm text-gray-500 mb-4">Share this pass with your partner to join.</Text>

        <TextInput
          className="bg-gray-100 p-4 rounded-xl text-base border border-gray-200 mb-6"
          placeholder="Enter room pass"
          secureTextEntry
          value={passRoom}
          onChangeText={setPassRoom}
        />

        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center shadow-sm"
          onPress={handleCreate}
          disabled={loading || !name.trim() || !passRoom.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Create</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
