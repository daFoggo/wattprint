import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { QueryProvider } from '@/providers/query-provider';
import '@/src/global.css';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="dark">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <QueryProvider>
            <AnimatedSplashOverlay />
            <AppTabs />
          </QueryProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}