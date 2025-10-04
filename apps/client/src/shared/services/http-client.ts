// services/basicApiClient.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ENV } from '../constants';
import { tokenStorage } from './token-storage';

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

class BasicApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 100000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Inject token before every request
    this.client.interceptors.request.use(async (config) => {
      const token = await tokenStorage.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`${config.baseURL}${config.url}`);
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config;
        // Handle 401 (Unauthorized)
        if (
          error.response?.status === 401 && (error.response?.data as any)?.code === 'TOKEN_EXPIRED' &&
          !originalRequest._retry // prevent infinite loops
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshToken = await tokenStorage.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token available');

            // Call refresh endpoint
            const refreshResponse = await this.client.post('/auth/refresh', {
              refresh_token: refreshToken,
            });

            const newAccessToken = (refreshResponse.data as any).access_token;
            const newRefreshToken = (refreshResponse.data as any).refresh_token;

            await tokenStorage.setTokens(newAccessToken, newRefreshToken);

            processQueue(null, newAccessToken);

            // Retry original request
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (err) {
            processQueue(err, null);
            await tokenStorage.clearTokens();
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        const apiError = {
          code: error.response?.status?.toString() || 'NETWORK_ERROR',
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            'Network error occurred',
          statusCode: error.response?.status,
        };

        return Promise.reject(apiError);
      },
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const basicApiClient = new BasicApiClient();