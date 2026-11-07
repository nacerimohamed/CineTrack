import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import useAuthStore from '../../store/auth-store';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'M';

  const handleLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
              router.replace('/(auth)/login');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>
        CINE<Text style={styles.orange}>TRACK</Text>
      </Text>

      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      <Text style={styles.name}>{user?.name || 'Movie Lover'}</Text>
      <Text style={styles.username}>
        {user?.email || 'No email available'}
      </Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.number}>0</Text>
          <Text style={styles.label}>WATCHED</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>0</Text>
          <Text style={styles.label}>REVIEWS</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.number}>0</Text>
          <Text style={styles.label}>WATCHLIST</Text>
        </View>
      </View>

      <Pressable
        style={[styles.logoutButton, loading && styles.disabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#F05A3E" />
        ) : (
          <Text style={styles.logoutText}>SIGN OUT</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    padding: 22,
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  orange: {
    color: '#F05A3E',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '900',
    alignSelf: 'flex-start',
    marginTop: 45,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#29201F',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    borderWidth: 2,
    borderColor: '#F05A3E',
  },
  avatarText: {
    color: '#F05A3E',
    fontSize: 35,
    fontWeight: '900',
  },
  name: {
    color: 'white',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 15,
  },
  username: {
    color: '#85858D',
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#17171C',
    borderRadius: 15,
    paddingVertical: 23,
    marginTop: 35,
    width: '100%',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  number: {
    color: '#F05A3E',
    fontSize: 24,
    fontWeight: '900',
  },
  label: {
    color: '#85858D',
    fontSize: 9,
    marginTop: 7,
    letterSpacing: 1,
  },
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F05A3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logoutText: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  disabled: {
    opacity: 0.6,
  },
});

