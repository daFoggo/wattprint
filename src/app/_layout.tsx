import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppTabs from '@/components/common/app-tabs';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { EnergyStoreProvider } from '@/features/energy/use-energy-store';
import { QueryProvider } from '@/providers/query-provider';
import '@/global.css';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="dark">
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <QueryProvider>
            <EnergyStoreProvider>
              <AppTabs />
            </EnergyStoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
