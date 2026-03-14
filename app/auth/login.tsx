import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthForm } from '../../src/features/auth/components/AuthForm';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <AuthForm onSuccess={handleSuccess} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
