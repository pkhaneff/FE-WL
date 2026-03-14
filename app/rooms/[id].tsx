import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Room, Wish } from '../../src/types';
import { roomService } from '../../src/features/rooms/services';
import { wishService } from '../../src/features/wishes/services';
import { WishItem } from '../../src/features/wishes/components/WishItem';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [roomData, wishesData] = await Promise.all([
        roomService.getRoomById(id),
        wishService.getRoomWishes(id)
      ]);
      setRoom(roomData);
      setWishes(wishesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (wishId: string, status: 'confirmed' | 'deleted') => {
    try {
      await wishService.updateWishStatus(wishId, status);
      await loadData();
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
        renderItem={({ item }) => (
          <WishItem wish={item} onStatusChange={handleStatusChange} />
        )}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={loadData}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-500">No active wishes in this room.</Text>
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
