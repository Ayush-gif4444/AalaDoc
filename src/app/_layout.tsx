import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { Redirect, Stack, usePathname, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Colors } from '@/components/ui/colors';

function RootNavigator() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();
  const isWelcomeScreen = pathname === '/' && segments[0] !== '(tabs)';

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!user && !isWelcomeScreen) {
    return <Redirect href="/" />;
  }

  if (user && isWelcomeScreen) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="select-doctor" />
        <Stack.Screen name="doctor/[id]" />
        <Stack.Screen name="confirm-appointment" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          {Platform.OS === 'web' ? (
            <View style={styles.webCanvas}>
              <View style={styles.webAppFrame}>
                <RootNavigator />
              </View>
            </View>
          ) : (
            <RootNavigator />
          )}
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webCanvas: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#E9EEF2',
  },
  webAppFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 20px rgba(23, 43, 58, 0.14)',
  },
});
