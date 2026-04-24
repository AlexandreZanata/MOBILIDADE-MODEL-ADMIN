import axios, { AxiosInstance } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vamu.joaoflavio.com';

// ✅ Flag para evitar loop infinito de refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

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

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * ✅ Interceptor para adicionar token de autenticação
 * POST /v1/auth/login
 * GET /v1/drivers/profile
 * POST /v1/passengers/register
 */
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log('🔑 Token adicionado ao header');
        }

        return config;
    },
    (error) => {
        console.error('❌ Erro no interceptor de requisição:', error);
        return Promise.reject(error);
    }
);

/**
 * ✅ Interceptor de resposta para tratar 401 e renovar token
 * Segue rigorosamente a API spec:
 * - POST /v1/auth/refresh (com refreshToken no BODY)
 * - Suporta múltiplas tentativas de requisição falhadas
 */
api. interceptors.response.use(
    (response) => {
        console.log('✅ Resposta bem-sucedida:', response.config. url);
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        // Se não é erro 401, rejeitar normalmente
        if (error.response?.status !== 401) {
            console.error('❌ Erro na requisição:', error.response?.status || error.message);
            return Promise.reject(error);
        }

        console.warn('⚠️ Erro 401 - Token pode estar expirado');

        // Se já está tentando renovar, adicionar à fila
        if (isRefreshing) {
            console.log('⏳ Refresh em andamento, adicionando à fila...');
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token) => {
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        } else {
                            reject(error);
                        }
                    },
                    reject: (err) => reject(err),
                });
            });
        }

        // Marcar como "tentando renovar"
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refresh_token');

        if (! refreshToken) {
            console. error('❌ Refresh token não encontrado');
            isRefreshing = false;
            processQueue(error, null);

            // Limpar tokens e redirecionar para login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';

            return Promise.reject(error);
        }

        // ✅ Tentar renovar token - USANDO BODY em vez de header
        return axios
            .post(
                `${API_BASE_URL}/v1/auth/refresh`,
                {
                    refreshToken: refreshToken, // ✅ NO BODY para evitar CORS
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                }
            )
            .then((response) => {
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Atualizar tokens no localStorage
                localStorage.setItem('access_token', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refresh_token', newRefreshToken);
                }

                console.log('✅ Token renovado com sucesso');

                // Atualizar header da requisição original
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Processar fila de requisições pendentes
                processQueue(null, accessToken);

                // Reexecutar requisição original
                return api(originalRequest);
            })
            .catch((refreshError) => {
                console. error('❌ Erro ao renovar token:', refreshError. message);

                // Refresh falhou, fazer logout
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_data');

                processQueue(refreshError, null);
                window.location.href = '/login';

                return Promise.reject(refreshError);
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
);

export default api;