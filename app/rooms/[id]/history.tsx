import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Wish } from '../../../src/types';
import { wishService } from '../../../src/features/wishes/services';
import { WishItem } from '../../../src/features/wishes/components/WishItem';

export default function WishHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [id]);

  const loadHistory = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const wishesData = await wishService.getRoomWishes(id, true);
      setWishes(wishesData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
