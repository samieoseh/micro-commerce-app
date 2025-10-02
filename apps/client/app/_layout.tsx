import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

import { fontConfig } from '@/constants/fonts';
import { themes } from '@/constants/theme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import '../global.css';

const queryClient = new QueryClient({});

export default function RootLayout() {
  
  const colorScheme = useColorScheme();

  const themeColors =
    colorScheme === 'dark' ? themes.darkTheme.colors : themes.lightTheme.colors;

  const paperTheme =
    colorScheme === 'dark'
      ? {
          ...MD3DarkTheme,
          colors: themeColors,
          fonts: configureFonts({ config: fontConfig }),
        }
      : {
          ...MD3LightTheme,
          colors: themeColors,
          fonts: configureFonts({ config: fontConfig }),
        };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <Slot />
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}