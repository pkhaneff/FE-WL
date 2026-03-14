import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileForm } from '../../src/features/profile/components/ProfileForm';
import { useAuth } from '../../src/features/auth/hooks/useAuth';

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-6 pb-2">
          <Text className="text-3xl font-bold text-gray-800">Profile</Text>
          <Text className="text-gray-500 mt-1">{user?.email}</Text>
        </View>
        
        <ProfileForm />

        <View className="px-6 mt-8 mb-12">
          <TouchableOpacity 
            className="bg-red-50 p-4 rounded-xl border border-red-100 items-center"
            onPress={logout}
          >
            <Text className="text-red-600 font-semibold text-lg">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
