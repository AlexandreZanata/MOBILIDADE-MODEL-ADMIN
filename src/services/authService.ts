import api from './api';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    roles?: string[];
    emailVerified?: boolean;
    emailVerifiedAt?: string;
    createdAt?: string;
}

export interface AuthRefreshResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface LogoutResponse {
    success: boolean;
}

const authService = {
    /**
     * ✅ Login - POST /v1/auth/login
     * Segue exatamente a especificação da API
     *
     * Request Body:
     * {
     *   "email": "admin@vamu.local",
     *   "password": "Admin123!"
     * }
     *
     * Response (200 OK):
     * {
     *   "id": "018f1234-5678-9abc-def0-123456789abc",
     *   "email": "admin@vamu.local",
     *   "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.. .",
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     *   "roles": ["admin"],
     *   "emailVerified": true,
     *   "emailVerifiedAt": "2025-11-28T16:00:00Z",
     *   "createdAt": "2025-11-28T16:00:00Z"
     * }
     */
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        try {
            console.log('🔐 Enviando requisição de login para:', `${api.defaults.baseURL}/v1/auth/login`);
            console.log('📨 Payload:', payload);

            const response = await api.post<AuthResponse>('/v1/auth/login', payload);

            // Validar resposta
            if (!response.data || !response.data.accessToken || !response.data.refreshToken) {
                throw new Error('Resposta inválida do servidor: tokens não recebidos');
            }

            console.log('✅ Resposta de login completa:', response.data);
            console.log('📋 Roles recebidas:', response.data.roles);
            console.log('✅ Email verificado?  :', response.data.emailVerified);

            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao fazer login:', error. response?.data || error.message);
            throw error;
        }
    },

    /**
     * ✅ Refresh Token - POST /v1/auth/refresh
     * Renova o access token usando um refresh token válido
     *
     * ✅ USANDO BODY em vez de header (para evitar problemas CORS)
     *
     * Request Body:
     * {
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
     * }
     *
     * Response (200 OK):
     * {
     *   "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
     * }
     */
    refreshToken: async (refreshToken: string): Promise<AuthRefreshResponse> => {
        try {
            console.log('🔄 Enviando requisição de refresh token.. .');

            // ✅ IMPORTANTE: Enviar refresh token NO BODY (não no header) para evitar CORS
            const response = await api.post<AuthRefreshResponse>(
                '/v1/auth/refresh',
                {
                    refreshToken: refreshToken, // ✅ No body conforme spec da API
                }
            );

            if (!response.data || !response. data.accessToken) {
                throw new Error('Resposta inválida do servidor: access token não recebido');
            }

            console.log('✅ Refresh token renovado com sucesso');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                console.error('❌ Refresh token inválido ou expirado');
            } else {
                console.error('❌ Erro ao renovar token:', error.response?.data || error.message);
            }
            throw error;
        }
    },

    /**
     * ✅ Logout - POST /v1/auth/logout
     * Revoga o refresh token e invalida a sessão
     *
     * Envia refresh token no body para evitar CORS
     *
     * Response (204 No Content)
     */
    logout: async (accessToken: string, refreshToken: string): Promise<LogoutResponse> => {
        try {
            console.log('🚪 Enviando requisição de logout...');

            // ✅ Logout com refresh token no body
            await api.post(
                '/v1/auth/logout',
                {
                    refreshToken: refreshToken,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('✅ Logout realizado com sucesso');
            return { success: true };
        } catch (error: any) {
            console.error('❌ Erro ao fazer logout:', error.response?.data || error.message);
            // Mesmo com erro, retornar sucesso para limpar local
            return { success: true };
        }
    },

    /**
     * ✅ Obter dados do usuário autenticado
     * Tenta obter perfil de motorista ou passageiro baseado nos roles
     */
    getAuthenticatedUser: async (roles?: string[]): Promise<any | null> => {
        try {
            // Se é admin, não fazer chamadas adicionais de perfil
            if (roles?.includes('admin')) {
                console.log('✅ Usuário é admin, dados já obtidos do login');
                return null;
            }

            console.log('👤 Buscando dados adicionais do usuário...');

            // Para não-admin, tentar motorista
            try {
                const response = await api.get('/v1/drivers/profile');
                console.log('✅ Perfil de motorista obtido');
                return response.data;
            } catch (driverError: any) {
                if (driverError.response?.status !== 404) {
                    console.error('Erro inesperado ao buscar perfil de motorista:', driverError);
                }
                console.log('ℹ️ Não é motorista, tentando passageiro...');

                // Fallback para passageiro
                try {
                    const response = await api.get('/v1/passengers/profile');
                    console. log('✅ Perfil de passageiro obtido');
                    return response.data;
                } catch (passengerError: any) {
                    if (passengerError.response?.status !== 404) {
                        console.error('Erro inesperado ao buscar perfil de passageiro:', passengerError);
                    }
                    console.log('ℹ️ Não é passageiro');
                    return null;
                }
            }
        } catch (error) {
            console.error('❌ Erro ao obter dados do usuário:', error);
            return null;
        }
    },
};

export default authService;