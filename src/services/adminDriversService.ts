import api from './api';
import {
    PaginatedResponse,
    PaginationParams,
} from '@/types/driver-vehicle';

/**
 * ✅ ADMIN DRIVERS SERVICE
 * Gerencia motoristas (listagem, deleção, reativação)
 * API: /v1/admin/drivers
 */

export interface AdminDriver {
    userId: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cnhNumber: string;
    cnhExpirationDate: string;
    cnhCategory: string;
    status: string;
    emailVerified: boolean;
    emailVerifiedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface DriverDocument {
    id: string;
    driverId: string;
    documentType: 'CNH' | 'CRLV';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploadedAt: string;
    rejectionReason?: string;
}
const adminDriversService = {
    /**
     * ✅ Listar motoristas
     * GET /v1/admin/drivers
     * Parâmetros: cursor, limit (1-100, default 20), sort, q (busca textual), status[eq/in], cnhCategory[eq]
     */
    listDrivers: async (params?: PaginationParams): Promise<PaginatedResponse<AdminDriver>> => {
        try {
            console.log('Listando motoristas...');
            const queryParams: Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt,name',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params. q;
            if (params?. status) queryParams['status[eq]'] = params. status;

            console.log('Query params:', queryParams);

            const response = await api.get<PaginatedResponse<AdminDriver>>(
                '/v1/admin/drivers',
                { params: queryParams }
            );

            console.log('Resposta completa da API:', response.data);
            console.log('Motoristas listados:', response.data?. items?.length || 0);

            // A API retorna diretamente a estrutura paginada
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('Erro ao listar motoristas:', errorMsg);

            // Retorna resposta vazia em caso de erro
            return {
                items: [],
                nextCursor: null,
                prevCursor: null,
                hasMore: false,
                totalCount: 0,
            };
        }
    },

    /**
     * ✅ Listar documentos do motorista
     * GET /v1/admin/drivers/{driverId}/documents
     */
    listDriverDocuments: async (driverId: string): Promise<PaginatedResponse<DriverDocument>> => {
        try {
            console.log('Listando documentos do motorista:', driverId);

            const response = await api.get<PaginatedResponse<DriverDocument>>(
                `/v1/admin/drivers/${driverId}/documents`
            );

            console.log('Documentos carregados:', response.data?.items?.length || 0);

            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?. data?.error?.message || error. message;
            console.error('Erro ao listar documentos:', errorMsg);

            return {
                items: [],
                nextCursor: null,
                prevCursor: null,
                hasMore: false,
                totalCount: 0,
            };
        }
    },

    /**
     * ✅ Baixar arquivo de documento
     * GET /v1/admin/drivers/documents/{documentId}/file
     */
    downloadDocumentFile: async (documentId: string): Promise<{ blob: Blob; fileName: string; contentType: string }> => {
        try {
            console.log('Baixando arquivo do documento:', documentId);

            const response = await api.get(
                `/v1/admin/drivers/documents/${documentId}/file`,
                { responseType: 'blob' }
            );

            const contentType = response.headers['content-type'] || 'application/octet-stream';
            const fileName = `documento_${documentId}.pdf`;

            console.log('Arquivo baixado com sucesso');

            return {
                blob: response.data,
                fileName,
                contentType,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('Erro ao baixar documento:', errorMsg);

            throw new Error(errorMsg || 'Erro ao baixar documento');
        }
    },

    /**
     * ✅ Deletar motorista (soft delete)
     * DELETE /v1/admin/drivers/{driverId}
     */
    deleteDriver: async (driverId: string): Promise<void> => {
        try {
            console.log('Deletando motorista:', driverId);
            await api.delete(`/v1/admin/drivers/${driverId}`);
            console.log('Motorista deletado');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('Erro ao deletar motorista:', errorMsg);

            throw new Error(errorMsg || 'Erro ao deletar motorista');
        }
    },

    /**
     * ✅ Reativar motorista (reversão de soft delete)
     * POST /v1/admin/drivers/{driverId}/reactivate
     */
    reactivateDriver: async (driverId: string): Promise<void> => {
        try {
            console.log('Reativando motorista:', driverId);
            await api.post(`/v1/admin/drivers/${driverId}/reactivate`);
            console.log('Motorista reativado');
        } catch (error: any) {
            const errorMsg = error. response?.data?.error?.message || error.message;
            console. error('Erro ao reativar motorista:', errorMsg);

            throw new Error(errorMsg || 'Erro ao reativar motorista');
        }
    },
};

export default adminDriversService;