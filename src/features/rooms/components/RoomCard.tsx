import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Room } from '../../../types';
import { useRouter } from 'expo-router';

interface Props {
  room: Room;
}

export const RoomCard = ({ room }: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center justify-between mb-3"
      onPress={() => router.push(`/rooms/${room.id}`)}
    >
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800">{room.name}</Text>
        <Text className="text-gray-500 text-sm mt-1">Code: {room.code}</Text>
      </View>
      <View className="bg-blue-50 px-3 py-1 rounded-full">
        <Text className="text-blue-600 font-medium">View</Text>
      </View>
    </TouchableOpacity>
  );
};
