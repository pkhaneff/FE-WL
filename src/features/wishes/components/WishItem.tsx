import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wish } from '../../../types';
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

interface Props {
  wish: Wish;
  onStatusChange?: (id: string, status: 'confirmed' | 'deleted') => void;
  showActions?: boolean;
}

export const WishItem = ({ wish, onStatusChange, showActions = true }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const isMine = wish.creatorId === user?.id;

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className={`px-2 py-1 rounded-md ${getTypeColor(wish.type).split(' ')[0]}`}>
          <Text className={`text-xs font-bold uppercase ${getTypeColor(wish.type).split(' ')[1]}`}>
            {getTypeName(wish.type)}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">
          {new Date(wish.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text className="text-gray-800 text-base mb-3 leading-6">{wish.content}</Text>
      
      <View className="pt-3 border-t border-gray-50 flex-row justify-between items-center mt-1">
        <Text className="text-sm font-medium text-gray-500">
          {isMine ? 'Created by me' : 'From partner'}
        </Text>

        {showActions && wish.status === 'active' && (
          <View className="flex-row gap-2">
            {!isMine && (
              <TouchableOpacity 
                className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-100"
                onPress={() => onStatusChange?.(wish.id, 'confirmed')}
              >
                <Text className="text-green-600 font-medium text-sm">Got it!</Text>
              </TouchableOpacity>
            )}
            
            {isMine && (
              <TouchableOpacity 
                className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                onPress={() => router.push(`/rooms/${wish.roomId}/wishes/${wish.id}/update`)}
              >
                <Text className="text-blue-600 font-medium text-sm">Edit</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-100"
              onPress={() => onStatusChange?.(wish.id, 'deleted')}
            >
              <Text className="text-red-500 font-medium text-sm">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
