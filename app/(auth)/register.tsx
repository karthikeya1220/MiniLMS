import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen(): React.JSX.Element {
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (): Promise<void> => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (error: any) {
      if (error.response?.data?.errors?.length > 0) {
        // The API returns an array of error objects like [{ email: "Email is invalid" }]
        const firstErrorObj = error.response.data.errors[0];
        const firstErrorMessage = Object.values(firstErrorObj)[0] as string;
        setErrorMessage(firstErrorMessage || 'Registration failed.');
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 48,
          backgroundColor: '#0F172A',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: '700',
            color: '#F8FAFC',
            marginBottom: 8,
          }}
        >
          Create account
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#94A3B8',
            marginBottom: 40,
          }}
        >
          Start your learning journey
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
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          placeholder="Email"
          placeholderTextColor="#64748B"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          accessibilityLabel="Email address"
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
          onSubmitEditing={handleRegister}
          accessibilityLabel="Password"
        />

        <Pressable
          onPress={handleRegister}
          disabled={isSubmitting}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#4F46E5' : '#6366F1',
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: isSubmitting ? 0.7 : 1,
          })}
          accessibilityLabel="Create account"
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}
            >
              Create account
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
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login">
            <Text style={{ color: '#6366F1', fontSize: 14, fontWeight: '600' }}>
              Sign in
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
