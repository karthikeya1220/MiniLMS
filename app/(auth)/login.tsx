import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen(): React.JSX.Element {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username and password are required.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ username: username.trim(), password });
    } catch {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          backgroundColor: '#0F172A',
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#F8FAFC',
            marginBottom: 8,
          }}
        >
          Welcome back
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#94A3B8',
            marginBottom: 40,
          }}
        >
          Sign in to continue learning
        </Text>

        {errorMessage !== null && (
          <View
            style={{
              backgroundColor: '#7F1D1D',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#FCA5A5', fontSize: 14 }}>
              {errorMessage}
            </Text>
          </View>
        )}

        <TextInput
          style={{
            backgroundColor: '#1E293B',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#F8FAFC',
            fontSize: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          placeholder="Username"
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          accessibilityLabel="Username"
        />

        <TextInput
          style={{
            backgroundColor: '#1E293B',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: '#F8FAFC',
            fontSize: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          placeholder="Password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          accessibilityLabel="Password"
        />

        <Pressable
          onPress={handleLogin}
          disabled={isSubmitting}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#4F46E5' : '#6366F1',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: isSubmitting ? 0.7 : 1,
          })}
          accessibilityLabel="Sign in"
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}
            >
              Sign in
            </Text>
          )}
        </Pressable>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: '#94A3B8', fontSize: 14 }}>
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/(auth)/register">
            <Text style={{ color: '#6366F1', fontSize: 14, fontWeight: '600' }}>
              Register
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
