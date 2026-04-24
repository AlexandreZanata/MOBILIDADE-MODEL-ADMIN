import api from './api';

/**
 * ✅ DRIVERS SERVICE
 * Todos os endpoints seguem EXATAMENTE a documentação da API com /v1/
 */

export interface DriverProfileResponse {
    userId: string;
    cnhNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface DriverRegisterPayload {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
    cnhNumber: string;
    cnhExpirationDate: string;
    cnhCategory: string;
}

export interface DriverRegisterResponse {
    userId: string;
    email: string;
    status: string;
    verificationCodeSent: boolean;
    createdAt: string;
}

export interface VerifyEmailPayload {
    email: string;
    code: string;
}

export interface VerifyEmailResponse {
    message: string;
}

export interface DocumentUploadResponse {
    documentId: string;
    status: string;
    createdAt: string;
}

const driversService = {
    /**
     * ✅ Registrar novo motorista
     * POST /v1/drivers/register
     * Cria nova conta e envia código de verificação por email
     */
    registerDriver: async (payload: DriverRegisterPayload): Promise<DriverRegisterResponse> => {
        try {
            console.log('📝 Registrando novo motorista:', payload. email);
            const response = await api.post<DriverRegisterResponse>(
                '/v1/drivers/register',
                payload
            );
            console.log('✅ Motorista registrado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao registrar motorista:', error. response?.data);
            const errorMessage =
                error.response?.data?. error?. message ||
                error.response?. data?.message ||
                'Erro ao registrar motorista';
            throw new Error(errorMessage);
        }
    },

    /**
     * ✅ Verificar email com código
     * POST /v1/drivers/verify-email
     * Valida código e atualiza status para AWAITING_CNH
     */
    verifyEmail: async (payload: VerifyEmailPayload): Promise<VerifyEmailResponse> => {
        try {
            console.log('📧 Verificando email:', payload.email);
            const response = await api.post<VerifyEmailResponse>(
                '/v1/drivers/verify-email',
                payload
            );
            console.log('✅ Email verificado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao verificar email:', error.response?.data);
            const errorMessage =
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Erro ao verificar email';
            throw new Error(errorMessage);
        }
    },

    /**
     * ✅ Upload de documento
     * POST /v1/drivers/documents
     * Content-Type: multipart/form-data
     * Campos: documentType (CNH ou VEHICLE_DOC), vehicleId (obrigatório se VEHICLE_DOC), file
     */
    uploadDocument: async (
        file: File,
        documentType: 'CNH' | 'VEHICLE_DOC',
        vehicleId?: string
    ): Promise<DocumentUploadResponse> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const params = new URLSearchParams();
            params.append('documentType', documentType);
            if (vehicleId) {
                params.append('vehicleId', vehicleId);
            }

            console.log('📄 Fazendo upload de documento:', documentType);
            const response = await api. post<DocumentUploadResponse>(
                `/v1/drivers/documents? ${params.toString()}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console. log('✅ Documento enviado:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao fazer upload:', error.response?.data);
            const errorMessage =
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Erro ao fazer upload';
            throw new Error(errorMessage);
        }
    },

    /**
     * ✅ Obter perfil do motorista
     * GET /v1/drivers/profile
     * Retorna perfil completo do motorista autenticado
     */
    getProfile: async (): Promise<DriverProfileResponse> => {
        try {
            console.log('👤 Obtendo perfil do motorista.. .');
            const response = await api.get<DriverProfileResponse>('/v1/drivers/profile');
            console.log('✅ Perfil obtido:', response.data);
            return response. data;
        } catch (error: any) {
            console. error('❌ Erro ao obter perfil:', error.response?.data);
            const errorMessage =
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Erro ao obter perfil';
            throw new Error(errorMessage);
        }
    },
};

export default driversService;