import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { wishService } from '../../../src/features/wishes/services';
import { WishItem } from '../../../src/features/wishes/components/WishItem';
import { useWishesStore } from '../../../src/store/wishes';
import { Wish } from '../../../src/types';

const EMPTY_WISHES: Wish[] = [];

export default function WishHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const roomHistory = useWishesStore((state) => state.roomHistory);
  const setRoomHistory = useWishesStore((state) => state.setRoomHistory);

  const wishes = useMemo(() => {
    if (!id) return EMPTY_WISHES;
    return roomHistory[id] ?? EMPTY_WISHES;
  }, [id, roomHistory]);

  const loadHistory = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const wishesData = await wishService.getRoomWishesHistory(id);
      setRoomHistory(id, wishesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: 'Wish History' }} />
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={wishes}
          keyExtractor={w => w.id}
          renderItem={({ item }) => (
            <WishItem wish={item} showActions={false} />
          )}
          contentContainerStyle={{ padding: 24 }}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-gray-500">No confirmed or deleted wishes yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
