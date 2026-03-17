import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Room, Wish, WishStatus } from '../../src/types';
import { roomService } from '../../src/features/rooms/services';
import { wishService } from '../../src/features/wishes/services';
import { WishItem } from '../../src/features/wishes/components/WishItem';
import { useWishesStore } from '../../src/store/wishes';

const EMPTY_WISHES: Wish[] = [];

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const roomWishes = useWishesStore((state) => state.roomWishes);
  const setRoomWishes = useWishesStore((state) => state.setRoomWishes);
  const updateWishStatusLocal = useWishesStore((state) => state.updateWishStatus);
  const removeWishLocal = useWishesStore((state) => state.removeWish);
  const addHistoryWish = useWishesStore((state) => state.addHistoryWish);

  const wishes = useMemo(() => {
    if (!id) return EMPTY_WISHES;
    return roomWishes[id] ?? EMPTY_WISHES;
  }, [id, roomWishes]);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [roomData, wishesData] = await Promise.all([
        roomService.getRoomById(id),
        wishService.getRoomWishes(id)
      ]);
      setRoom(roomData);
      setRoomWishes(id, wishesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (wishId: string, status: WishStatus) => {
    try {
      await wishService.updateWishStatus(id as string, wishId, status);
      updateWishStatusLocal(id as string, wishId, status);
      if (status === 'deleted') {
        removeWishLocal(id as string, wishId);
      }
      if (status === 'confirmed' || status === 'deleted') {
        const target = wishes.find((wish) => wish.id === wishId);
        if (target) {
          addHistoryWish(id as string, { ...target, status });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading && !room) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          title: room?.name || 'Loading...',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/rooms/${id}/history`)}>
              <Text className="text-blue-600 font-medium">History</Text>
            </TouchableOpacity>
          )
        }} 
      />
      
      <FlatList
        data={wishes}
        keyExtractor={w => w.id}
        ListHeaderComponent={() => (
          <View className="flex-row justify-between mb-4 mt-2">
            <TouchableOpacity 
              className="bg-blue-100 px-4 py-2 rounded-lg flex-1 mr-2 items-center"
              onPress={() => router.push(`/rooms/${id}/my-wishes`)}
            >
              <Text className="text-blue-700 font-semibold">My Wishes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-200 px-4 py-2 rounded-lg flex-1 ml-2 items-center"
              onPress={() => router.push(`/rooms/${id}/history`)}
            >
              <Text className="text-gray-700 font-semibold">History</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <WishItem wish={item} onStatusChange={handleStatusChange} />
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={loadData}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">No pending wishes in this room.</Text>
            </View>
          ) : null
        }
      />

      <View className="absolute bottom-8 left-6 right-6">
        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center shadow-md"
          onPress={() => router.push(`/rooms/${id}/wishes/create`)}
        >
          <Text className="text-white font-semibold text-lg">Add New Wish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
