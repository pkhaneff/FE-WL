import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { wishService } from '../../../../../src/features/wishes/services';
import { WishType } from '../../../../../src/types';
import { useWishesStore } from '../../../../../src/store/wishes';

export default function UpdateWishScreen() {
  const { id, wishId } = useLocalSearchParams<{ id: string, wishId: string }>();
  const router = useRouter();
  
  const [type, setType] = useState<WishType>('gift');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const updateWishContent = useWishesStore((state) => state.updateWishContent);

  useEffect(() => {
    loadWish();
  }, [wishId]);

  const loadWish = async () => {
    if (!wishId || !id) return;
    try {
      const wish = await wishService.getWishById(id, wishId);
      setType(wish.type);
      setContent(wish.content);
    } catch (e) {
      console.error(e);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim() || !wishId || !id) return;
    setSaving(true);
    try {
      await wishService.updateWishContent(id, wishId, type, content);
      updateWishContent(id, wishId, type, content);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const types: { value: WishType, label: string }[] = [
    { value: 'gift', label: 'Gift' },
    { value: 'habit', label: 'Good Habit' },
    { value: 'bad_habit', label: 'Bad Habit to drop' },
    { value: 'question', label: 'Question to answer' },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Update Wish' }} />
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
          onPress={handleUpdate}
          disabled={saving || !content.trim()}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
