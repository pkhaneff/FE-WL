import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { wishService } from '../../../../src/features/wishes/services';
import { WishType } from '../../../../src/types';
import { useWishesStore } from '../../../../src/store/wishes';

export default function CreateWishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [type, setType] = useState<WishType>('gift');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const upsertWish = useWishesStore((state) => state.upsertWish);

  const handleCreate = async () => {
    if (!content.trim() || !id) return;
    setLoading(true);
    try {
      const created = await wishService.createWish(id, type, content);
      upsertWish(id, created);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const types: { value: WishType, label: string }[] = [
    { value: 'gift', label: 'Gift' },
    { value: 'habit', label: 'Good Habit' },
    { value: 'bad_habit', label: 'Bad Habit to drop' },
    { value: 'question', label: 'Question to answer' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Create Wish' }} />
      <ScrollView className="p-6">
        <Text className="text-sm font-medium text-gray-800 mb-3">Wish Type</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {types.map(t => (
            <TouchableOpacity 
              key={t.value}
              onPress={() => setType(t.value)}
              className={`px-4 py-2 border rounded-full ${
                type === t.value ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
              }`}
            >
              <Text className={type === t.value ? 'text-white' : 'text-gray-700'}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-medium text-gray-800 mb-3">Description</Text>
        <TextInput
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base min-h-[120px]"
          placeholder="Describe your wish..."
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center mt-8 shadow-sm"
          onPress={handleCreate}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Create Wish</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
