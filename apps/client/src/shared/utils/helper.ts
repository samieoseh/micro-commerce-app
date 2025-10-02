import { jwtDecode } from 'jwt-decode';

export const formatPrice = (price: number) => {
  return `₦${Math.round(price).toLocaleString('en-US')}`;
};

export const getSubFromToken = (accessToken: string | null): string | null => {
  if (!accessToken || typeof accessToken !== 'string') {
    console.warn('Invalid or missing token:', accessToken);
    return null;
  }

  try {
    const decodedToken: { sub?: string } = jwtDecode(accessToken);
    return decodedToken.sub || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};