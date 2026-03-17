import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Wish, WishStatus } from '../../../src/types';
import { wishService } from '../../../src/features/wishes/services';
import { WishItem } from '../../../src/features/wishes/components/WishItem';
import { useAppStore } from '../../../src/store';
import { useWishesStore } from '../../../src/store/wishes';

const EMPTY_WISHES: Wish[] = [];

export default function MyWishesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const user = useAppStore((state) => state.user);
  const roomWishesMap = useWishesStore((state) => state.roomWishes);
  const setRoomWishes = useWishesStore((state) => state.setRoomWishes);
  const updateWishStatusLocal = useWishesStore((state) => state.updateWishStatus);
  const removeWishLocal = useWishesStore((state) => state.removeWish);
  const addHistoryWish = useWishesStore((state) => state.addHistoryWish);

  const roomWishes = useMemo(() => {
    if (!id) return EMPTY_WISHES;
    return roomWishesMap[id] ?? EMPTY_WISHES;
  }, [id, roomWishesMap]);

  const wishes = useMemo(() => {
    if (!user) return [];
    return roomWishes.filter((wish) => wish.creatorId === user.id);
  }, [roomWishes, user]);

  const loadMyWishes = useCallback(async () => {
    if (!id || !user) return;
    setLoading(true);
    try {
      const wishesData = await wishService.getRoomWishes(id);
      setRoomWishes(id, wishesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadMyWishes();
  }, [loadMyWishes]);

  const handleStatusChange = async (wishId: string, status: WishStatus) => {
    try {
      if (!id) return;
      await wishService.updateWishStatus(id, wishId, status);
      updateWishStatusLocal(id, wishId, status);
      if (status === 'deleted') {
        removeWishLocal(id, wishId);
      }
      if (status === 'confirmed' || status === 'deleted') {
        const target = roomWishes.find((wish) => wish.id === wishId);
        if (target) {
          addHistoryWish(id, { ...target, status });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: 'My Wishes' }} />
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={wishes}
          keyExtractor={w => w.id}
          renderItem={({ item }) => (
            <WishItem wish={item} onStatusChange={handleStatusChange} />
          )}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-gray-500">You haven't created any wishes yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
