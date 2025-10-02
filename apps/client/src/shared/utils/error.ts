// shared/services/handle-async-error.ts
import { toast } from '@/src/shared/services/toast';
// Example: integrate with Sentry (or any logger of your choice)

interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: string | string[];
}

export function handleAsyncError(error: unknown, context?: string) {
  let userMessage = 'Something went wrong. Please try again.';
  let logMessage = 'Unexpected error';

  if (isApiError(error)) {
    // Backend-defined error shape
    const apiError = error.response?.data as ApiErrorResponse;
    userMessage = apiError?.message || apiError?.error || userMessage;
    console.log({ apiError });
    logMessage = JSON.stringify(apiError);
  } else if (isNetworkError(error)) {
    userMessage = 'Network error. Please check your connection.';
    logMessage = 'Network error';
  } else if (error instanceof Error) {
    // JS runtime error
    userMessage = error.message || userMessage;
    logMessage = error.stack || error.message;
  }

  // Show friendly feedback to the user
  toast(userMessage);

  // Always log locally for dev
  if (__DEV__) {
    console.error('[handleAsyncError]', logMessage, error);
  }
}

// --- Type Guards ---

function isApiError(error: any): error is { response?: { data?: any } } {
  return error && typeof error === 'object' && 'response' in error;
}

function isNetworkError(error: any) {
  return error?.message?.includes('Network Error');
}