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

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const googleLogin = useAuthStore((state) => state.googleLogin);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      const result = await googleLogin();

      if (result) {
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.log('Google login error:', err);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to sign in with Google. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmation) {
      setError('Please complete all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await register(name.trim(), email.trim(), password, confirmation);

      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      const validationErrors = data?.errors;

      if (validationErrors) {
        setError(Object.values(validationErrors).flat().join('\n'));
      } else {
        setError(data?.message || 'Unable to create your account.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>Account created!</Text>
        <Text style={styles.successText}>
          Please check your email and verify your account before signing in.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.buttonText}>GO TO SIGN IN</Text>
        </Pressable>
      </View>
    );
  }

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

        {!showEmailForm ? (
          <View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Join CineTrack and start your movie journey.
            </Text>

           <Pressable
  style={[styles.googleButton, styles.googleDisabled]}
  disabled={true}
>
  <Text style={styles.googleIcon}>G</Text>
  <Text style={styles.googleButtonText}>
    GOOGLE SIGN-IN COMING SOON
  </Text>
</Pressable>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            <Pressable
              style={styles.emailButton}
              onPress={() => {
                setError('');
                setShowEmailForm(true);
              }}
            >
              <Text style={styles.emailButtonText}>
                CONTINUE WITH EMAIL
              </Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        ) : (
          <View>
            <Pressable
              onPress={() => {
                setShowEmailForm(false);
                setError('');
              }}
            >
              <Text style={styles.backText}>← BACK TO OPTIONS</Text>
            </Pressable>

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Enter your details to get started.
            </Text>

            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#66666F"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
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
              placeholder="At least 8 characters"
              placeholderTextColor="#66666F"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor="#66666F"
              value={confirmation}
              onChangeText={setConfirmation}
              secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, loading && styles.disabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
              )}
            </Pressable>
          </View>
        )}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.loginLink}>
            Sign in
          </Link>
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
    paddingVertical: 35,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 45,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 32,
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
  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
  },
  subtitle: {
    color: '#888890',
    fontSize: 13,
    marginTop: 9,
    marginBottom: 25,
  },
  googleButton: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 21,
    fontWeight: '900',
    marginRight: 13,
  },
  googleButtonText: {
    color: '#17171C',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#292930',
  },
  separatorText: {
    color: '#77777F',
    fontSize: 11,
    marginHorizontal: 15,
  },
  emailButton: {
    height: 55,
    borderWidth: 1,
    borderColor: '#F05A3E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  backText: {
    color: '#F05A3E',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 22,
  },
  label: {
    color: '#B5B5BD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 15,
    marginBottom: 9,
  },
  input: {
    height: 52,
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
    marginTop: 15,
    lineHeight: 19,
  },
  button: {
    height: 54,
    backgroundColor: '#F05A3E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  disabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#888890',
    fontSize: 12,
  },
  loginLink: {
    color: '#F05A3E',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    color: '#55555D',
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 40,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successIcon: {
    color: '#FFFFFF',
    backgroundColor: '#F05A3E',
    width: 65,
    height: 65,
    borderRadius: 33,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 35,
    overflow: 'hidden',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 25,
  },
  successText: {
    color: '#9999A1',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 12,
  },
googleDisabled: {
  opacity: 0.55,
},
});
