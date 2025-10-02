export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEV: process.env.NODE_ENV !== 'production',
};