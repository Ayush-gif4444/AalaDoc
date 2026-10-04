import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/components/ui/colors';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = () => {
    setMode('signUp');
    setErrorMessage('');
    setShowSignInModal(true);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (mode === 'signUp' && !displayName.trim()) {
      setErrorMessage('Enter your name to create an account.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signUp') {
        await signUp(displayName, email, password);
      } else {
        await signIn(email, password);
      }
      setShowSignInModal(false);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Enter your email address first.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      Alert.alert('Check your email', 'We sent you a password reset link.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header Branding */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>AalaDoc</Text>
          <Text style={styles.brandSubtitle}>Your health, our priority</Text>
        </View>

        {/* Doctor Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('@/assets/images/welcome/doctor_illustration.jpg')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>

          <View style={styles.signInRow}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                setMode('signIn');
                setErrorMessage('');
                setShowSignInModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Sign In Modal */}
      <Modal
        visible={showSignInModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignInModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSignInModal(false);
                  setErrorMessage('');
                }}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {mode === 'signIn'
                ? 'Sign in to access your appointments'
                : 'Create an account to book your next appointment'}
            </Text>

            {mode === 'signUp' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  autoComplete="name"
                  placeholder="Your name"
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                placeholder="you@example.com"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                placeholder="At least 6 characters"
                returnKeyType="done"
              />
            </View>

            {mode === 'signIn' && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={handlePasswordReset}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

            <TouchableOpacity
              style={[styles.modalSignInBtn, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Text style={styles.modalSignInBtnText}>
                {isSubmitting
                  ? 'Please wait...'
                  : mode === 'signIn' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modeSwitchRow}>
              <Text style={styles.modeSwitchLabel}>
                {mode === 'signIn' ? "Don't have an account? " : 'Already registered? '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                  setErrorMessage('');
                }}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.modeSwitchLink}>
                  {mode === 'signIn' ? 'Create one' : 'Sign in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function getAuthErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not enabled in Firebase.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 12,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: '100%',
    height: 320,
    maxHeight: 360,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalScrollView: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  modalSignInBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalSignInBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: 12,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  errorMessage: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.65,
  },
  modeSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  modeSwitchLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  modeSwitchLink: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
