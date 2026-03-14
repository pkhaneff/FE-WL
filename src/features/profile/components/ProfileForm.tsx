import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useAppStore } from '../../../store';
import { useAuth } from '../../auth/hooks/useAuth';

export const ProfileForm = () => {
  const { user } = useAuth();
  const setAuth = useAppStore(state => state.setAuth);
  const token = useAppStore(state => state.token);
  const refreshToken = useAppStore(state => state.refreshToken);
  
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleUpdate = () => {
    if (user && token) {
      setAuth({ ...user, name, avatar }, token, refreshToken || undefined);
      alert('Profile updated successfully!');
    }
  };

  return (
    <View className="p-6 gap-4 w-full">
      <View className="items-center mb-6">
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-32 h-32 rounded-full mb-4 bg-gray-200" />
        ) : (
          <View className="w-32 h-32 rounded-full mb-4 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500 text-lg">No Avatar</Text>
          </View>
        )}
      </View>

      <Text className="text-sm font-medium text-gray-500 ml-1">Name</Text>
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 text-base"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text className="text-sm font-medium text-gray-500 ml-1 mt-2">Avatar URL</Text>
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 text-base"
        value={avatar}
        onChangeText={setAvatar}
        placeholder="Enter avatar URL"
      />

      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-xl items-center mt-6 shadow-sm"
        onPress={handleUpdate}
      >
        <Text className="text-white font-semibold text-lg">Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};
