import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vamu.joaoflavio.com';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    trace_id: string;
}

interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details: Record<string, any>;
    };
    trace_id: string;
}

class ApiClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshTokenPromise: Promise<void> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });

        // Recuperar token armazenado
        this.accessToken = localStorage.getItem('access_token');

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - adiciona token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token') || this.accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - trata erros e refresh token
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<ApiErrorResponse>) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Se erro é 401 e não é tentativa de retry
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Se já há uma promise de refresh, aguardar
                    if (this.refreshTokenPromise) {
                        try {
                            await this.refreshTokenPromise;
                            return this.client(originalRequest);
                        } catch (err) {
                            return Promise.reject(err);
                        }
                    }

                    // Executar refresh token
                    this.refreshTokenPromise = this.attemptTokenRefresh();

                    try {
                        await this.refreshTokenPromise;
                        this.refreshTokenPromise = null;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        this.refreshTokenPromise = null;
                        this.handleUnauthorized();
                        return Promise.reject(refreshError);
                    }
                }

                // Outros erros 401
                if (error.response?.status === 401) {
                    this.handleUnauthorized();
                }

                return Promise.reject(error);
            }
        );
    }

    private async attemptTokenRefresh(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            throw new Error('Refresh token não disponível');
        }

        try {
            const response = await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
                `${API_BASE_URL}/auth/refresh`,
                { refresh_token: refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                }
            );

            if (response.data.data) {
                this.setAccessToken(response.data.data.access_token);
                localStorage.setItem('refresh_token', response.data.data.refresh_token);
            }
        } catch (error) {
            this.handleUnauthorized();
            throw error;
        }
    }

    private handleUnauthorized(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_in');
        this.accessToken = null;
        window.location.href = '/login';
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get<ApiResponse<T>>(endpoint, { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.put<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.delete<ApiResponse<T>>(endpoint);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.patch<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const apiError = error as AxiosError<ApiErrorResponse>;
            const errorMessage =
                apiError.response?.data?.error?.message ||
                apiError.message ||
                'Erro na requisição';

            const customError = new Error(errorMessage);
            (customError as any).response = apiError.response;
            return customError;
        }
        return error;
    }

    setAccessToken(token: string): void {
        this.accessToken = token;
        localStorage.setItem('access_token', token);
    }

    getAccessToken(): string | null {
        return this.accessToken || localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    getInstance(): AxiosInstance {
        return this.client;
    }
}

export default new ApiClient();