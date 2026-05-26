import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Profile — Sprint 6
 * Shows basic user info and a working logout button (auth is live).
 */
export default function ProfileScreen(): React.JSX.Element {
  const { user, logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#0F172A',
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#6366F1',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 36 }}>👤</Text>
      </View>

      {user !== null && (
        <>
          <Text
            style={{
              color: '#F8FAFC',
              fontSize: 22,
              fontWeight: '700',
              marginBottom: 4,
            }}
          >
            {user.fullName}
          </Text>
          <Text style={{ color: '#94A3B8', fontSize: 14, marginBottom: 4 }}>
            @{user.username}
          </Text>
          <Text style={{ color: '#64748B', fontSize: 14, marginBottom: 40 }}>
            {user.email}
          </Text>
        </>
      )}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#991B1B' : '#7F1D1D',
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 40,
          alignItems: 'center',
        })}
        accessibilityLabel="Sign out"
        accessibilityRole="button"
      >
        <Text style={{ color: '#FCA5A5', fontSize: 16, fontWeight: '600' }}>
          Sign out
        </Text>
      </Pressable>
    </View>
  );
}
