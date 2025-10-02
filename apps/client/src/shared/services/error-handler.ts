// services/errorHandler.ts
export interface ApiError {
  code: string; // e.g., "400", "500", "NETWORK_ERROR"
  message: string; // message from server or fallback
  statusCode?: number; // numeric HTTP status
}

/**
 * Converts an unknown error into a normalized ApiError object.
 */
export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}

/**
 * Checks if the error matches our ApiError structure.
 */
function isApiError(error: any): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Maps normalized errors to user-friendly messages.
 */
export function getErrorMessage(error: ApiError): string {
  console.log({ error });
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Please check your internet connection and try again.';
    case '400':
      return error.message || 'Invalid request. Please try again.';
    case '401':
      return error.message || 'You are not authorized. Please log in again.';
    case '403':
      return (
        error.message || 'You do not have permission to perform this action.'
      );
    case '404':
      return error.message || 'The requested resource was not found.';
    case '500':
      return 'Server error. Please try again later.';
    default:
      return error.message || 'Something went wrong. Please try again.';
  }
}