import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'wattprint_auth_token';
const REFRESH_TOKEN_KEY = 'wattprint_refresh_token';

const isWeb = Platform.OS === 'web';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.warn('Error reading auth token from secure store:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.warn('Error writing auth token to secure store:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.warn('Error deleting auth token from secure store:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.warn('Error reading refresh token from secure store:', error);
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.warn('Error writing refresh token to secure store:', error);
    }
  },

  async clearAll(): Promise<void> {
    await Promise.allSettled([
      this.removeToken(),
      isWeb && typeof window !== 'undefined'
        ? Promise.resolve(localStorage.removeItem(REFRESH_TOKEN_KEY))
        : SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};