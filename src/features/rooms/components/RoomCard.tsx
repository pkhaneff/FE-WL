import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Room } from '../../../types';
import { useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { roomService } from '../services';

interface Props {
  room: Room;
  onLeave?: () => void;
}

export const RoomCard = ({ room, onLeave }: Props) => {
  const router = useRouter();
  const swipeableRef = useRef<Swipeable>(null);

  const handleLeave = () => {
    // Close swipeable first
    swipeableRef.current?.close();
    
    Alert.alert(
      "Confirm",
      "Are you sure you want to leave this room?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await roomService.leaveRoom(room.id);
              if (onLeave) {
                onLeave();
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not leave room');
            }
          }
        }
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <View className="mb-3 w-20 flex-row">
        <TouchableOpacity
          className="flex-1 bg-red-500 rounded-xl justify-center items-center ml-2 shadow-sm"
          onPress={handleLeave}
        >
          <Text className="text-white font-medium">Leave</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable 
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
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
    </Swipeable>
  );
};
