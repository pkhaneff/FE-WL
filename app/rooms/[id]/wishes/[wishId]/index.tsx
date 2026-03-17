import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAuth } from '../../../../../src/features/auth/hooks/useAuth';
import { wishService } from '../../../../../src/features/wishes/services';
import { Wish, WishStatus } from '../../../../../src/types';
import { useWishesStore } from '../../../../../src/store/wishes';

const getStatusLabel = (status: WishStatus) => {
  switch (status) {
    case 'requested':
      return 'Requested';
    case 'rejected':
      return 'Returned';
    case 'confirmed':
      return 'Confirmed';
    case 'deleted':
      return 'Deleted';
    default:
      return 'Pending';
  }
};

export default function WishDetailScreen() {
  const { id, wishId } = useLocalSearchParams<{ id: string; wishId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const updateWishStatusLocal = useWishesStore((state) => state.updateWishStatus);
  const addHistoryWish = useWishesStore((state) => state.addHistoryWish);

  const isMine = String(wish?.creatorId || '') === String(user?.id || '');

  useEffect(() => {
    loadWish();
  }, [wishId]);

  const loadWish = async () => {
    if (!id || !wishId) return;
    setLoading(true);
    try {
      const data = await wishService.getWishById(id, wishId);
      setWish(data);
    } catch (error) {
      console.error(error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const canRequest = !isMine && (wish?.status === 'pending' || wish?.status === 'rejected');
  const canConfirm = isMine && wish?.status === 'requested';

  const handleRequestConfirm = () => {
    Alert.alert(
      'Request Confirmation',
      'Send a confirmation request to the wish owner?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            if (!id || !wishId) return;
            setSubmitting(true);
            try {
              await wishService.updateWishStatus(id, wishId, 'requested');
              updateWishStatusLocal(id, wishId, 'requested');
              setWish((prev) => (prev ? { ...prev, status: 'requested' } : prev));
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not request confirmation');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const handleConfirm = () => {
    Alert.alert(
      'Confirm Completion',
      'Are you sure this wish has been completed?',
      [
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            if (!id || !wishId) return;
            setSubmitting(true);
            try {
              await wishService.updateWishStatus(id, wishId, 'rejected');
              updateWishStatusLocal(id, wishId, 'rejected');
              setWish((prev) => (prev ? { ...prev, status: 'rejected' } : prev));
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not reject wish');
            } finally {
              setSubmitting(false);
            }
          }
        },
        {
          text: 'Confirm',
          onPress: async () => {
            if (!id || !wishId) return;
            setSubmitting(true);
            try {
              await wishService.updateWishStatus(id, wishId, 'confirmed');
              updateWishStatusLocal(id, wishId, 'confirmed');
              setWish((prev) => (prev ? { ...prev, status: 'confirmed' } : prev));
              if (wish) {
                addHistoryWish(id, { ...wish, status: 'confirmed' });
              }
              router.push(`/rooms/${id}/history`);
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not confirm wish');
            } finally {
              setSubmitting(false);
            }
          }
        }
      ]
    );
  };

  if (loading || !wish) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'Wish Detail' }} />
      <ScrollView className="flex-1 p-6">
        <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <Text className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Status: {getStatusLabel(wish.status)}
          </Text>
          <Text className="text-base font-semibold text-gray-900 mb-2">{wish.content}</Text>
          <Text className="text-xs text-gray-400">
            {isMine ? 'Created by me' : 'From partner'}
          </Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-6">
        {canRequest && (
          <TouchableOpacity
            className="bg-amber-500 rounded-xl p-4 items-center"
            onPress={handleRequestConfirm}
            disabled={submitting}
          >
            <Text className="text-white font-semibold">Request Confirm</Text>
          </TouchableOpacity>
        )}

        {canConfirm && (
          <TouchableOpacity
            className="bg-green-600 rounded-xl p-4 items-center"
            onPress={handleConfirm}
            disabled={submitting}
          >
            <Text className="text-white font-semibold">Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
