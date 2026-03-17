import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JoinRoomModal } from '../../src/features/rooms/components/JoinRoomModal';
import { RoomCard } from '../../src/features/rooms/components/RoomCard';
import { roomService } from '../../src/features/rooms/services';
import { Room } from '../../src/types';

export default function HomeScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6 pb-2">
        <Text className="text-3xl font-bold text-gray-800">KhaNu</Text>
        <Text className="text-gray-500 mt-1">Ghi lại hành trình của Khang và Nu</Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoomCard room={item} onLeave={fetchRooms} />}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchRooms} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">You haven't joined any rooms yet.</Text>
            </View>
          ) : null
        }
      />

      <View className="p-6 bg-white border-t border-gray-100 flex-row gap-4">
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl items-center ${rooms.length > 0 ? 'bg-gray-200' : 'bg-blue-100'}`}
          onPress={() => {
            if (rooms.length > 0) {
              Alert.alert("Notice", "You can only be in one room at a time.");
              return;
            }
            setShowJoinModal(true);
          }}
        >
          <Text className={`font-semibold text-base py-1 ${rooms.length > 0 ? 'text-gray-500' : 'text-blue-700'}`}>Join Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl items-center shadow-sm ${rooms.length > 0 ? 'bg-gray-200' : 'bg-[#e56f09]'}`}
          onPress={() => {
            if (rooms.length > 0) {
              Alert.alert("Notice", "You can only be in one room at a time.");
              return;
            }
            router.push('/rooms/create');
          }}
        >
          <Text className={`font-semibold text-base py-1 ${rooms.length > 0 ? 'text-gray-500' : 'text-white'}`}>Create Room</Text>
        </TouchableOpacity>
      </View>

      <JoinRoomModal
        visible={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSuccess={fetchRooms}
      />
    </SafeAreaView>
  );
}
