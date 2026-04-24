import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/authService';

interface User {
    id: string;
    name: string;
    email: string;
    type?: string;
    type_label?: string;
    roles?: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * ✅ Chaves do localStorage - Padronizadas conforme API
 */
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user_data',
} as const;

/**
 * ✅ Funções auxiliares para localStorage
 */
const storageUtils = {
    getUser: (): User | null => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER);
            if (! data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Erro ao ler usuário do localStorage:', error);
            return null;
        }
    },

    setUser: (user: User | null): void => {
        try {
            if (user === null) {
                localStorage.removeItem(STORAGE_KEYS. USER);
                console.log('🗑️ Usuário removido do localStorage');
            } else {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                console.log('✅ Usuário salvo no localStorage:', user. email);
            }
        } catch (error) {
            console. error('❌ Erro ao salvar usuário no localStorage:', error);
        }
    },

    clearAll: (): void => {
        try {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS. REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            console. log('🗑️ Todos os dados de autenticação removidos do localStorage');
        } catch (error) {
            console.error('❌ Erro ao limpar localStorage:', error);
        }
    },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [refreshTokenTimer, setRefreshTokenTimer] = useState<ReturnType<typeof setInterval> | null>(null);

    /**
     * ✅ Verificação correta se é admin
     */
    const isAdmin = user?.roles?.includes('admin') === true;

    /**
     * ✅ Renovar access token usando refresh token
     * POST /v1/auth/refresh
     *
     * Segue a especificação da API:
     * - Pode enviar refresh token via header X-Refresh-Token
     * - Pode enviar refresh token no body
     * - Retorna novo accessToken e refreshToken
     */
    const refreshAccessToken = async (): Promise<boolean> => {
        try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (!refreshToken) {
                console.warn('⚠️ Refresh token não encontrado');
                return false;
            }

            console.log('🔄 Renovando access token.. .');

            const response = await authService.refreshToken(refreshToken);

            if (! response || !response.accessToken) {
                console.error('❌ Resposta de refresh inválida');
                return false;
            }

            // Atualizar tokens no localStorage
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response. accessToken);

            // Se o servidor retorna novo refresh token, também atualizar
            if (response.refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
            }

            console.log('✅ Access token renovado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao renovar token:', error);

            // Se falhar na renovação, fazer logout
            await logout();
            return false;
        }
    };

    /**
     * ✅ Configurar renovação automática de token
     * Renova 5 minutos antes da expiração teórica (55 minutos após login)
     */
    const setupTokenRefreshTimer = () => {
        // Limpar timer anterior se existir
        if (refreshTokenTimer) {
            clearInterval(refreshTokenTimer);
        }

        // Renovar token a cada 55 minutos (antes de 1 hora de expiração)
        const timer = setInterval(() => {
            console.log('⏰ Verificando se precisa renovar token...');
            refreshAccessToken();
        }, 55 * 60 * 1000); // 55 minutos em ms

        setRefreshTokenTimer(timer);
        console.log('⏱️ Timer de renovação automática configurado (55 min)');
    };

    /**
     * ✅ Verificar autenticação ao montar o componente
     * Restaura sessão se tokens existirem
     */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const storedUser = storageUtils.getUser();

                console.log('🔍 Verificando autenticação na inicialização...');
                console.log('✓ Access token existe? ', !!accessToken);
                console. log('✓ Refresh token existe?', !!refreshToken);
                console.log('✓ Usuário armazenado existe?', !!storedUser);

                if (!accessToken || ! refreshToken) {
                    console.log('❌ Tokens não encontrados, usuário desautenticado');
                    setIsAuthenticated(false);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Se tem tokens, restaurar usuário do localStorage
                if (storedUser) {
                    console.log('✅ Usuário restaurado do localStorage:', storedUser.email);
                    setUser(storedUser);
                    setIsAuthenticated(true);

                    // Configurar renovação automática de token
                    setupTokenRefreshTimer();
                } else {
                    console.warn('⚠️ Tokens existem mas usuário não está em localStorage');
                    setIsAuthenticated(false);
                    setUser(null);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('❌ Erro ao verificar autenticação:', error);
                storageUtils.clearAll();
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
            }
        };

        checkAuth();

        // Cleanup ao desmontar
        return () => {
            if (refreshTokenTimer) {
                clearInterval(refreshTokenTimer);
            }
        };
    }, []);

    /**
     * ✅ Atualizar localStorage sempre que user muda
     */
    useEffect(() => {
        if (user) {
            storageUtils.setUser(user);
        }
    }, [user]);

    /**
     * ✅ Login - POST /v1/auth/login
     *
     * Segue exatamente a especificação da API
     *
     * Request:
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
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            console.log('🔐 Iniciando login...');

            // Chamar API de login
            const response = await authService.login({ email, password });
            console.log('✅ Resposta do login:', response);

            if (!response || !response.accessToken || !response.refreshToken) {
                throw new Error('Resposta inválida do servidor: tokens não recebidos');
            }

            // Armazenar tokens conforme spec da API
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
            console.log('💾 Tokens armazenados');

            // Extrair roles da resposta
            const roles = response.roles || [];
            console.log('👤 Roles do usuário:', roles);
            console.log('👮 É admin?', roles.includes('admin'));

            // Criar objeto de usuário com dados do login
            const userData: User = {
                id: response.id,
                name: response.email. split('@')[0],
                email: response.email,
                roles: roles,
            };

            // IMPORTANTE: Atualizar state (isso vai disparar o useEffect de persistência)
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Login bem-sucedido! ');

            // Tentar obter dados adicionais do perfil (opcional, não é crítico)
            try {
                console.log('📦 Tentando obter perfil adicional...');
                const userResponse = await authService.getAuthenticatedUser(roles);
                if (userResponse) {
                    const updatedUser = {
                        ... userData,
                        name: userResponse.name || userData.name,
                        type: userResponse.type,
                        type_label: userResponse.type_label,
                    };
                    setUser(updatedUser);
                    console.log('✅ Perfil adicional obtido e atualizado');
                } else {
                    console.log('ℹ️ Nenhum perfil adicional disponível (normal para admin)');
                }
            } catch (profileError) {
                console.warn('⚠️ Não foi possível obter perfil adicional (normal para admin):', profileError);
            }

            // Configurar renovação automática de token após login bem-sucedido
            setupTokenRefreshTimer();

            setIsLoading(false);
        } catch (error: any) {
            console.error('❌ Erro ao fazer login:', error);
            storageUtils.clearAll();
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            throw error;
        }
    };

    /**
     * ✅ Logout - POST /v1/auth/logout
     * Revoga o refresh token e invalida a sessão
     */
    const logout = async () => {
        try {
            console.log('🚪 Iniciando logout...');

            // Limpar timer de renovação
            if (refreshTokenTimer) {
                clearInterval(refreshTokenTimer);
                setRefreshTokenTimer(null);
            }

            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            // Tentar fazer logout na API (mesmo que falhe, limpar local)
            if (accessToken && refreshToken) {
                try {
                    await authService. logout(accessToken, refreshToken);
                    console.log('✅ Logout realizado no servidor');
                } catch (error) {
                    console.warn('⚠️ Erro ao fazer logout no servidor, limpando local mesmo assim:', error);
                }
            }

            // Limpar dados locais independentemente
            storageUtils.clearAll();
            setIsAuthenticated(false);
            setUser(null);
            console.log('✅ Logout concluído');
        } catch (error) {
            console.error('❌ Erro ao fazer logout:', error);
            // Mesmo com erro, limpar dados locais
            storageUtils. clearAll();
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                isAdmin,
                login,
                logout,
                refreshAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};