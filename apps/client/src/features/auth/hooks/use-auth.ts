// hooks/useAuth.ts
import { useAuthStore } from '@/src/shared/store/auth-store';
import { router } from 'expo-router';
import type { ForgotPasswordFormData, SignInFormData } from '../schemas';
import type { SignUpFormData } from '../schemas/sign-up-schema';
import { AuthService } from '../services';

export function useAuth() {
  const { setUser } = useAuthStore();

  const signInWithPassword = async (payload: SignInFormData) => {
    const result = await AuthService.signIn(payload);
    if (result?.sub) {
      setUser(result.sub);
    }
    return result;
  };

  const signUp = async (payload: SignUpFormData) => {
    return AuthService.signUp(payload);
  };



 
  const forgotPassword = async (payload: ForgotPasswordFormData) => {
    return AuthService.forgotPassword(payload);
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    router.replace('/sign-in');
  };

  return {
    signInWithPassword,
    signUp,
    forgotPassword,
    signOut,
  };
}