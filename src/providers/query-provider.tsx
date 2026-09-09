import { ApiError } from '@/lib/api-client';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import NetInfo from '@react-native-community/netinfo';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

function DevToolsPlugin({ client }: { client: QueryClient }) {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReactQueryDevTools(client);
  }
  return null;
}

export function QueryProvider({ children }: PropsWithChildren) {
  const client = getQueryClient();

  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(state.isConnected ?? true);
      });
    });

    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={client}>
      <DevToolsPlugin client={client} />
      {children}
    </QueryClientProvider>
  );
}