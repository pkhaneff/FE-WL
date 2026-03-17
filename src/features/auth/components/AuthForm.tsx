import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../../store';
import { authService } from '../services';

interface Props {
  onSuccess: () => void;
}

export const AuthForm = ({ onSuccess }: Props) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAppStore(state => state.setAuth);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authService.login(email, password);
        setAuth(data.user, data.accessToken, data.refreshToken);
      } else {
        const data = await authService.register(email, password, username, fullName);
        setAuth(data.user, data.accessToken, data.refreshToken);
      }
      onSuccess();
    } catch (e) {
      console.error(e);
      // Show error handling here
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white gap-4 w-full max-w-sm mx-auto">
      <Text className="text-3xl font-bold text-center text-[#e56f09] mb-6">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </Text>

      {!isLogin && (
        <>
          <Text className="text-sm font-medium text-gray-700">Username</Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-base mb-2 border border-gray-200"
            placeholder="Username (letters, numbers, underscore)"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <Text className="text-sm font-medium text-gray-700">Full name</Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-xl text-base mb-2 border border-gray-200"
            placeholder="Full name (optional)"
            value={fullName}
            onChangeText={setFullName}
          />
        </>
      )}
      <Text className="text-sm font-medium text-gray-700">Email</Text>
      <TextInput
        className="bg-gray-100 p-4 rounded-xl text-base border border-gray-200"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Text className="text-sm font-medium text-gray-700">Password</Text>
      <TextInput
        className="bg-gray-100 p-4 rounded-xl text-base mb-2 border border-gray-200"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        className="bg-[#e56f09] p-4 rounded-xl items-center shadow-sm"
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        className="mt-4 p-2 items-center"
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text className="text-blue-600 font-medium">
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
