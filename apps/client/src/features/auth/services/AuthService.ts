// services/AuthService.ts
import type {
  ForgotPasswordFormData,
  SignInFormData,
  SignUpFormData
} from '@/features/auth/schemas';

import type {
  SigninResponse,
  SignupResponse,
} from '@/features/auth/types';
import { AUTH_ENDPOINTS } from '@/src/shared/constants/api';
import { basicApiClient } from '@/src/shared/services';
import { safeRequest } from '@/src/shared/services/safe-request';
import { tokenStorage } from '@/src/shared/services/token-storage';
import { getSubFromToken } from '@/src/shared/utils';

export class AuthService {
  static async signIn(payload: SignInFormData) {
    const result = await safeRequest(() =>
      basicApiClient.post<SigninResponse & { sub: string | null }>(
        AUTH_ENDPOINTS.SIGN_IN,
        payload,
      ),
    );

    if (result?.data?.accessToken && result?.data?.refreshToken) {
      await tokenStorage.setTokens(
        result.data.accessToken,
        result.data.refreshToken,
      );

      // Decode the JWT for user identification
      const sub = getSubFromToken(result.data.accessToken);
      return { ...result, sub };
    }

    return result;
  }

  static async signUp(payload: SignUpFormData) {
    return safeRequest(() =>
      basicApiClient.post<SignupResponse>(AUTH_ENDPOINTS.SIGN_UP, payload),
    );
  }

  static async forgotPassword(payload: ForgotPasswordFormData) {
    console.log({ payload });
    return safeRequest(() =>
      basicApiClient.post<any>(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload),
    );
  }

  static async signOut() {
    await tokenStorage.clearTokens();
  }
}