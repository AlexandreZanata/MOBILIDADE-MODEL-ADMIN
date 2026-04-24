import api from './api';
import {
    DriverDocument,
    PaginatedResponse,
    PaginationParams,
} from '@/types/driver-document';

/**
 * ✅ DRIVER DOCUMENT SERVICE
 * Gerencia documentos de motoristas (CNH, CRLV)
 * API: /v1/admin/drivers/documents
 */

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const driverDocumentService = {
    /**
     * ✅ Listar documentos pendentes
     * GET /v1/admin/drivers/documents/pending
     */
    listPendingDocuments: async (params?: PaginationParams): Promise<ServiceResponse<PaginatedResponse<DriverDocument>>> => {
        try {
            console.log('📄 Listando documentos pendentes.. .');
            const queryParams: Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt,driverName',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params. q;

            console.log('📋 Query params:', queryParams);

            const response = await api.get<PaginatedResponse<DriverDocument>>(
                '/v1/admin/drivers/documents/pending',
                { params: queryParams }
            );

            console.log('✅ Resposta da API:', response. data);
            console.log('✅ Total de documentos:', response.data?. items?.length || 0);

            // Log cada documento para debug
            response.data?.items?.forEach((doc, idx) => {
                console.log(`📋 Doc ${idx}: ID=${doc.id}, driverId=${doc.driverId}, type=${doc. documentType}, status=${doc.status}`);
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('❌ Erro ao listar documentos:', errorMsg);

            return {
                success: false,
                error: errorMsg || 'Erro ao listar documentos',
                data: {
                    items: [],
                    nextCursor: null,
                    prevCursor: null,
                    hasMore: false,
                    totalCount: 0,
                },
            };
        }
    },

    /**
     * ✅ Aprovar documento
     * POST /v1/admin/drivers/documents/{documentId}/approve
     */
    approveDocument: async (documentId: string): Promise<ServiceResponse<void>> => {
        try {
            console.log('✅ Aprovando documento:', documentId);
            const response = await api.post(
                `/v1/admin/drivers/documents/${documentId}/approve`
            );
            console.log('✅ Resposta de aprovação:', response.data);

            return {
                success: true,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao aprovar documento:', errorMsg);

            return {
                success: false,
                error: errorMsg || 'Erro ao aprovar documento',
            };
        }
    },

    /**
     * ✅ Rejeitar documento
     * POST /v1/admin/drivers/documents/{documentId}/reject
     * Body: { rejectionReason: string }
     */
    rejectDocument: async (
        documentId: string,
        rejectionReason: string
    ): Promise<ServiceResponse<void>> => {
        try {
            console.log('❌ Rejeitando documento:', documentId);
            console.log('📝 Motivo:', rejectionReason);

            const response = await api.post(
                `/v1/admin/drivers/documents/${documentId}/reject`,
                { rejectionReason }
            );

            console.log('✅ Resposta de rejeição:', response.data);

            return {
                success: true,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao rejeitar documento:', errorMsg);

            return {
                success: false,
                error: errorMsg || 'Erro ao rejeitar documento',
            };
        }
    },

    /**
     * ✅ Baixar arquivo do documento
     * GET /v1/admin/drivers/documents/{documentId}/file
     */
    downloadDocumentFile: async (documentId: string): Promise<ServiceResponse<Blob>> => {
        try {
            console.log('⬇️ Baixando arquivo do documento:', documentId);
            const response = await api.get(
                `/v1/admin/drivers/documents/${documentId}/file`,
                { responseType: 'blob' }
            );

            console.log('✅ Arquivo baixado com sucesso');

            return {
                success: true,
                data: response. data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao baixar arquivo:', errorMsg);

            return {
                success: false,
                error: errorMsg || 'Erro ao baixar arquivo',
            };
        }
    },
};

export default driverDocumentService;