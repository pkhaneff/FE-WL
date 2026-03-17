import React from 'react';
import { View, Text, TouchableOpacity, Alert, Pressable } from 'react-native';
import { Wish, WishStatus } from '../../../types';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/hooks/useAuth';

const getTypeColor = (type: Wish['type']) => {
  switch (type) {
    case 'gift': return 'bg-pink-100 text-pink-700';
    case 'habit': return 'bg-green-100 text-green-700';
    case 'bad_habit': return 'bg-red-100 text-red-700';
    case 'question': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTypeName = (type: Wish['type']) => {
  switch (type) {
    case 'gift': return 'Gift';
    case 'habit': return 'Good Habit';
    case 'bad_habit': return 'Bad Habit';
    case 'question': return 'Question';
    default: return 'Wish';
  }
};

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

interface Props {
  wish: Wish;
  onStatusChange?: (id: string, status: WishStatus) => void;
  showActions?: boolean;
}

export const WishItem = ({ wish, onStatusChange, showActions = true }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const isMine = String(wish.creatorId) === String(user?.id);

  const canEdit = isMine && (wish.status === 'pending' || wish.status === 'rejected');
  const canDelete = isMine && (wish.status === 'pending' || wish.status === 'rejected');

  const handleDelete = () => {
    Alert.alert(
      'Delete Wish',
      'Are you sure you want to delete this wish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onStatusChange?.(wish.id, 'deleted');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Could not delete wish');
            }
          }
        }
      ]
    );
  };

  return (
    <View className="mb-2 shadow-sm bg-white rounded-xl border border-gray-100 p-3">
      <Pressable onPress={() => router.push(`/rooms/${wish.roomId}/wishes/${wish.id}`)}>
        <View className="flex-row justify-between items-center mb-1">
          <View className={`px-2 py-0.5 rounded-md ${getTypeColor(wish.type).split(' ')[0]}`}>
            <Text className={`text-[10px] font-bold uppercase ${getTypeColor(wish.type).split(' ')[1]}`}>
              {getTypeName(wish.type)}
            </Text>
          </View>
          <Text className="text-[10px] text-gray-400">
            {new Date(wish.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text className="text-gray-800 text-sm mb-2 leading-5">{wish.content}</Text>
      </Pressable>

      <View className="pt-2 border-t border-gray-50 flex-row justify-between items-center">
        <Text className="text-xs font-medium text-gray-500">
          {isMine ? 'Created by me' : 'From partner'}
        </Text>

        <Text className="text-[10px] font-semibold text-gray-400">
          {getStatusLabel(wish.status)}
        </Text>

        {showActions && (
          <View className="flex-row gap-2">
            {canEdit && (
              <TouchableOpacity
                className="bg-blue-50 px-2 py-1 rounded-lg border border-blue-100"
                onPress={() => router.push(`/rooms/${wish.roomId}/wishes/${wish.id}/update`)}
              >
                <Text className="text-blue-600 font-medium text-xs">Edit</Text>
              </TouchableOpacity>
            )}
            
            {canDelete && (
              <TouchableOpacity
                className="bg-red-50 px-2 py-1 rounded-lg border border-red-100"
                onPress={handleDelete}
              >
                <Text className="text-red-500 font-medium text-xs">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
