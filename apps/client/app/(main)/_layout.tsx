import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/src/features/auth/hooks';
import { useAuthStore } from '@/src/shared/store/auth-store';
import { tokenStorage } from '@/src/shared/services';
import { useEffect, useState } from 'react';
import { LoadingIndicator } from '@/src/shared/components';
import { set } from 'react-hook-form';
import { getSubFromToken } from '@/src/shared/utils';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<string|null>(null);
  const [waitLoading, setWaitLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    async function fetchToken() {
       try {
          const token = await tokenStorage.getAccessToken();
          setSession(token);
          setWaitLoading(false);
          console.log({token: getSubFromToken(token)})
          setUser(getSubFromToken(token));
       } catch (error) {
          console.error('Error fetching token:', error);
          setWaitLoading(false);
        
       } 
    }
    fetchToken()
  }, [])

  if(waitLoading) {
    return <LoadingIndicator />
  }

  console.log({session})
  if(!session) {
    return <Redirect href="/sign-in" />
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
