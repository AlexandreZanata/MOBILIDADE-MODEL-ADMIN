import apiClient from './apiClient';

export interface PassengerRegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface PassengerRegisterResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

/**
 * Validar email
 */
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validar telefone brasileiro
 */
const validatePhoneBR = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Sanitizar entrada
 */
const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .trim();
};

const passengerRegistrationService = {
    register: async (data: PassengerRegisterRequest) => {
        // Validações
        if (!data.name || data.name.trim().length < 3) {
            throw new Error('Nome deve ter pelo menos 3 caracteres');
        }

        if (!validateEmail(data.email)) {
            throw new Error('Email inválido');
        }

        if (!validatePhoneBR(data.phone)) {
            throw new Error('Telefone inválido');
        }

        if (!data.password || data.password.length < 8) {
            throw new Error('Senha deve ter pelo menos 8 caracteres');
        }

        // Preparar dados sanitizados
        const sanitizedData = {
            name: sanitizeInput(data.name),
            email: data.email.toLowerCase().trim(),
            password: data.password,
            phone: data.phone.replace(/\D/g, ''),
        };

        try {
            const response = await apiClient.post<PassengerRegisterResponse>(
                '/passengers/register',
                sanitizedData
            );
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || error.message || 'Erro ao registrar passageiro';
            throw new Error(errorMessage);
        }
    },

    /**
     * Verificar email único
     */
    checkEmailAvailability: async (email: string) => {
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }

        try {
            // TODO: Implementar quando endpoint estiver disponível
            // return apiClient.get(`/passengers/check-email?email=${email}`);
            return { available: true };
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao verificar email');
        }
    },

    /**
     * Solicitar reenvio de email de verificação
     */
    resendVerificationEmail: async (email: string) => {
        if (!validateEmail(email)) {
            throw new Error('Email inválido');
        }

        try {
            const response = await apiClient.post('/passengers/email/resend', {
                email: email.toLowerCase().trim(),
            });
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'Erro ao reenviar email';
            throw new Error(errorMessage);
        }
    },
};

export default passengerRegistrationService;