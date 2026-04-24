import api from './api';

/**
 * ✅ ADMIN PASSENGERS SERVICE
 * Gerencia passageiros (listagem, deleção, reativação)
 * API: /v1/admin/passengers
 */

export interface Passenger {
    userId: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birthDate: string;
    emailVerified: boolean;
    emailVerifiedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedPassengersResponse {
    items: Passenger[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

export interface PaginationParams {
    cursor?: string;
    limit?: number;
    sort?: string;
    q?: string;
    birthDate?: {
        gte?: string;
        lte?: string;
    };
}

interface ServiceResponse<T> {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
}

const adminPassengersService = {
    /**
     * ✅ Listar passageiros
     * GET /v1/admin/passengers
     *
     * Retorna passageiros com paginação cursor, filtros, busca e ordenação
     * Parâmetros:
     * - cursor: UUID para paginação
     * - limit: 1-100 (default 20)
     * - sort: ex: -createdAt,name
     * - q: busca textual (nome, email, CPF, telefone)
     * - birthDate[gte/lte]: filtro por data de nascimento
     */
    listPassengers: async (params?: PaginationParams): Promise<PaginatedPassengersResponse> => {
        try {
            console.log('📋 Listando passageiros.. .');

            const queryParams: Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params.q;

            if (params?.birthDate) {
                if (params.birthDate.gte) queryParams['birthDate[gte]'] = params.birthDate.gte;
                if (params.birthDate.lte) queryParams['birthDate[lte]'] = params.birthDate.lte;
            }

            const response = await api.get<PaginatedPassengersResponse>(
                '/v1/admin/passengers',
                { params: queryParams }
            );

            console.log('✅ Passageiros obtidos:', response.data. items?. length || 0);
            return response. data;
        } catch (error: any) {
            console.error('❌ Erro ao listar passageiros:', error. response?.data || error.message);
            throw error;
        }
    },

    /**
     * ✅ Deletar passageiro
     * DELETE /v1/admin/passengers/{passengerId}
     *
     * Realiza soft delete de um passageiro e seu usuário associado
     * A operação é reversível
     */
    deletePassenger: async (passengerId: string): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log('🗑️ Deletando passageiro:', passengerId);

            const response = await api.delete<ServiceResponse<{ message: string }>>(
                `/v1/admin/passengers/${passengerId}`
            );

            console.log('✅ Passageiro deletado com sucesso');
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao deletar passageiro:', error.response?.data || error. message);
            throw error;
        }
    },

    /**
     * ✅ Reativar passageiro
     * POST /v1/admin/passengers/{passengerId}/reactivate
     *
     * Reativa um passageiro que foi deletado (soft delete)
     * Restaurando seu acesso ao sistema
     */
    reactivatePassenger: async (passengerId: string): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log('🔄 Reativando passageiro:', passengerId);

            const response = await api.post<ServiceResponse<{ message: string }>>(
                `/v1/admin/passengers/${passengerId}/reactivate`
            );

            console.log('✅ Passageiro reativado com sucesso');
            return response.data;
        } catch (error: any) {
            console.error('❌ Erro ao reativar passageiro:', error.response?.data || error. message);
            throw error;
        }
    },
};

export default adminPassengersService;