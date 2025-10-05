import { jwtDecode } from 'jwt-decode';

export const formatPrice = (price: number) => {
  return `₦${Math.round(price).toLocaleString('en-US')}`;
};

export const getSubFromToken = (accessToken: string | null): {"email": string, role: string, "id": number} | null => {
  if (!accessToken || typeof accessToken !== 'string') {
    console.warn('Invalid or missing token:', accessToken);
    return null;
  }

  try {
    const decodedToken: {"email": string, role: string, "id": number} = jwtDecode(accessToken);
    const user = {email: decodedToken.email, role: decodedToken.role, id: decodedToken.id}
    return user || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};