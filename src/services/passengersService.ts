// src/services/passengersService. ts
import api from './api';

export interface PassengerRegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    cpf?: string;
    birthDate?: string;
}

export interface PassengerLoginPayload {
    email: string;
    password: string;
}

export interface PassengerVerifyEmailPayload {
    email: string;
    code: string;
}

export interface ServiceResponse {
    success: boolean;
    message: string;
    data: any;
    trace_id?: string;
}

export const passengersService = {
    /**
     * ✅ Registrar novo passageiro
     * POST /v1/passengers/register
     * Cria uma nova conta de passageiro e envia código de verificação por email
     */
    register: async (payload: PassengerRegisterPayload): Promise<ServiceResponse> => {
        try {
            console.log('📝 Registrando passageiro.. .');
            const response = await api.post<ServiceResponse>('/passengers/register', payload);
            console.log('✅ Passageiro registrado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao registrar passageiro:', error. response?.data);
            throw error;
        }
    },

    /**
     * ✅ Verificar email com código
     * POST /v1/passengers/verify-email
     * Valida o código de verificação enviado por email
     */
    verifyEmail: async (payload: PassengerVerifyEmailPayload): Promise<ServiceResponse> => {
        try {
            console. log('📧 Verificando email do passageiro...');
            const response = await api.post<ServiceResponse>('/passengers/verify-email', payload);
            console.log('✅ Email verificado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao verificar email:', error.response?.data);
            throw error;
        }
    },

    /**
     * ✅ Obter perfil do passageiro
     * GET /v1/passengers/profile
     * Retorna o perfil completo do passageiro autenticado
     */
    getProfile: async (): Promise<ServiceResponse> => {
        try {
            console. log('👤 Obtendo perfil do passageiro...');
            const response = await api.get<ServiceResponse>('/passengers/profile');
            console.log('✅ Perfil obtido:', response. data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao obter perfil:', error.response?. data);
            throw error;
        }
    },
};

export default passengersService;