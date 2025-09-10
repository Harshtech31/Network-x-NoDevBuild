import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ProfileProvider } from '../contexts/ProfileContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ProfileProvider>
      <NavigationThemeProvider value={DefaultTheme}>
        <Stack initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPasswordScreen" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="CollaborationScreen" options={{ headerShown: false }} />
          <Stack.Screen name="PersonDetailScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ProjectDetailScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ClubDetailScreen" options={{ headerShown: false }} />
          <Stack.Screen name="UserProfileScreen" options={{ headerShown: false }} />
          <Stack.Screen name="MessagesScreen" options={{ headerShown: false }} />
          <Stack.Screen name="NotificationsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </ProfileProvider>
  );
}
