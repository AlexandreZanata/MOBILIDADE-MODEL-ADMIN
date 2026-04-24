import api from './api';
import {
    DriverVehicle,
    PaginatedResponse,
    PaginationParams,
} from '@/types/driver-vehicle';

/**
 * ✅ DRIVER VEHICLE SERVICE - CORRIGIDO DEFINITIVAMENTE
 * Gerencia veículos de motoristas (aprovação, rejeição, listagem)
 *
 * ENDPOINTS CORRETOS CONFORME DOCUMENTAÇÃO:
 * - GET /v1/admin/vehicles (listar - SEM /drivers/)
 * - POST /v1/admin/drivers/vehicles/{vehicleId}/approve (COM /drivers/)
 * - POST /v1/admin/drivers/vehicles/{vehicleId}/reject (COM /drivers/)
 */

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const driverVehicleService = {
    /**
     * ✅ Listar veículos com filtros
     * GET /v1/admin/vehicles (CORRIGIDO - SEM /drivers/)
     */
    listVehicles: async (
        params?:  PaginationParams
    ): Promise<ServiceResponse<PaginatedResponse<DriverVehicle>>> => {
        try {
            console.log('🚗 Listando veículos de motoristas...');
            const queryParams:  Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt,licensePlate',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params. q;
            // ✅ Passa status com o filtro correto
            if (params?.status) queryParams['status[eq]'] = params.status;

            console.log('📋 Query params:', queryParams);
            console.log('🔗 Endpoint correto:   /v1/admin/vehicles');

            const response = await api.get<PaginatedResponse<DriverVehicle>>(
                '/v1/admin/vehicles',
                { params: queryParams }
            );

            console.log('✅ Resposta da API:', response.data);

            return {
                success: true,
                data: response.data,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('❌ Erro ao listar veículos:', errorMsg);
            console.error('Status HTTP:', error.response?.status);
            console.error('Resposta completa:', error. response?. data);

            return {
                success: false,
                error:  errorMsg || 'Erro ao listar veículos',
                data: {
                    items: [],
                    nextCursor: null,
                    prevCursor: null,
                    hasMore: false,
                    totalCount: null,
                },
            };
        }
    },

    /**
     * ✅ Obter detalhes de um veículo específico
     * GET /v1/admin/vehicles/{vehicleId}
     */
    getVehicle: async (
        vehicleId: string
    ): Promise<ServiceResponse<DriverVehicle>> => {
        try {
            console.log('🔍 Obtendo detalhes do veículo:', vehicleId);
            const response = await api.get<DriverVehicle>(
                `/v1/admin/vehicles/${vehicleId}`
            );
            console.log('✅ Veículo obtido:', response.data);

            return {
                success: true,
                data: response.data,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao obter veículo:', errorMsg);

            return {
                success: false,
                error: errorMsg || 'Erro ao obter veículo',
            };
        }
    },

    /**
     * ✅ Aprovar veículo de motorista
     * POST /v1/admin/drivers/vehicles/{vehicleId}/approve (COM /drivers/)
     */
    approveVehicle: async (vehicleId: string): Promise<ServiceResponse<void>> => {
        try {
            console.log('✅ Aprovando veículo:', vehicleId);
            console.log('🔗 Endpoint:  POST /v1/admin/drivers/vehicles/{vehicleId}/approve');

            const response = await api.post(
                `/v1/admin/drivers/vehicles/${vehicleId}/approve`
            );
            console.log('✅ Resposta da aprovação:', response.data);
            console.log('✅ Veículo aprovado com sucesso');

            return {
                success: true,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao aprovar veículo:', errorMsg);
            console.error('❌ Resposta da API:', error.response?. data);

            return {
                success: false,
                error:  errorMsg || 'Erro ao aprovar veículo',
            };
        }
    },

    /**
     * ✅ Rejeitar veículo de motorista
     * POST /v1/admin/drivers/vehicles/{vehicleId}/reject (COM /drivers/)
     * ✅ Usa rejectionReason conforme API documentation
     */
    rejectVehicle: async (
        vehicleId: string,
        rejectionReason:  string
    ): Promise<ServiceResponse<void>> => {
        try {
            console.log('❌ Rejeitando veículo:', vehicleId);
            console.log('📝 Motivo da rejeição:', rejectionReason);
            console.log('🔗 Endpoint:  POST /v1/admin/drivers/vehicles/{vehicleId}/reject');

            const response = await api.post(
                `/v1/admin/drivers/vehicles/${vehicleId}/reject`,
                {
                    rejectionReason,
                }
            );
            console.log('✅ Resposta da rejeição:', response.data);
            console.log('✅ Veículo rejeitado com sucesso');

            return {
                success: true,
            };
        } catch (error: any) {
            const errorMsg = error.response?. data?.error?.message || error. message;
            console.error('❌ Erro ao rejeitar veículo:', errorMsg);
            console.error('❌ Resposta da API:', error.response?.data);

            return {
                success: false,
                error: errorMsg || 'Erro ao rejeitar veículo',
            };
        }
    },
};

export default driverVehicleService;