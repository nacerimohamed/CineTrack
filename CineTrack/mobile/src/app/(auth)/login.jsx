import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import useAuthStore from '../../store/auth-store';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      const message = err.response?.data?.message;

      if (err.response?.status === 403) {
        setError(message || 'Please verify your email before logging in.');
      } else if (err.response?.status === 422) {
        setError('Invalid email or password.');
      } else {
        setError(message || 'Unable to connect to the server. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            CINE<Text style={styles.logoAccent}>TRACK</Text>
          </Text>
          <Text style={styles.tagline}>YOUR PERSONAL MOVIE JOURNAL</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your cinematic journey.
          </Text>

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#66666F"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#66666F"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>SIGN IN</Text>
            )}
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" style={styles.registerLink}>
              Create account
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>MADE FOR MOVIE LOVERS</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 45,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 65,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoAccent: {
    color: '#F05A3E',
  },
  tagline: {
    color: '#77777F',
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: '#888890',
    fontSize: 13,
    marginTop: 9,
    marginBottom: 38,
  },
  label: {
    color: '#B5B5BD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 18,
  },
  input: {
    height: 54,
    backgroundColor: '#17171C',
    borderWidth: 1,
    borderColor: '#292930',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 14,
  },
  error: {
    color: '#FF7665',
    fontSize: 12,
    marginTop: 16,
    lineHeight: 19,
  },
  loginButton: {
    height: 55,
    backgroundColor: '#F05A3E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.65,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerText: {
    color: '#888890',
    fontSize: 12,
  },
  registerLink: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    color: '#55555D',
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 65,
  },
});
