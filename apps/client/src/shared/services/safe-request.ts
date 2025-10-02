// services/safeRequest.ts
import { getErrorMessage, logger, normalizeError } from './';
import { toast } from './toast';

export async function safeRequest<T>(
  fn: () => Promise<T>,
  showToast = true,
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const apiError = normalizeError(error);
    //logger.error(apiError.message, { code: apiError.code });

    if (showToast) {
      toast(getErrorMessage(apiError));
    }

    return null;
  }
}