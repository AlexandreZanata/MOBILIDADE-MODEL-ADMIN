import api from './api';

export interface Vehicle {
    id: string;
    driverId: string;
    brandId: string;
    modelId: string;
    year: number;
    plate: string;
    chassis: string;
    color: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}

export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

interface ServiceResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

/**
 * ✅ ADMIN VEHICLES SERVICE
 * Gerencia veículos de motoristas para aprovação/rejeição
 */
const adminVehiclesService = {
    /**
     * ✅ Listar motoristas pendentes (como veículos pendentes)
     * GET /v1/admin/drivers
     */
    listPendingVehicles: async (params?: {
        cursor?: string;
        limit?: number;
        sort?: string;
        q?: string;
    }): Promise<ServiceResponse<Vehicle[]>> => {
        try {
            console.log('📋 Listando veículos pendentes (motoristas)...');
            const queryParams: Record<string, any> = {
                limit: params?.limit || 50,
                sort: params?.sort || '-createdAt',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params.q;

            // Buscar motoristas
            const response = await api.get<PaginatedResponse<any>>(
                '/v1/admin/drivers',
                { params: queryParams }
            );

            console.log('✅ Motoristas obtidos:', response.data.items. length);

            // Converter motoristas em veículos (para exibição)
            const vehicles: Vehicle[] = response.data. items.map((driver: any) => ({
                id: driver.userId,
                driverId: driver.userId,
                brandId: '',
                modelId: '',
                year: new Date(). getFullYear(),
                plate: 'N/A',
                chassis: '',
                color: '',
                status: driver.status === 'ONBOARDING' ? 'pending' : 'approved',
                createdAt: driver.createdAt,
                updatedAt: driver.updatedAt,
                metadata: {
                    motoristName: driver.name,
                    motoristEmail: driver.email,
                    motoristPhone: driver.phone,
                    motoristCPF: driver.cpf,
                    motoristCNH: driver.cnhNumber,
                    motoristStatus: driver.status,
                    motoristEmailVerified: driver.emailVerified,
                },
            }));

            console.log('✅ Motoristas pendentes mapeados:', vehicles.length, vehicles);

            return {
                success: true,
                data: vehicles,
            };
        } catch (error: any) {
            console.error('❌ Erro ao listar veículos pendentes:', error. response?.data || error.message);
            return {
                success: false,
                message: 'Erro ao listar veículos pendentes',
                data: [],
            };
        }
    },

    /**
     * ✅ Listar todos os motoristas processados
     */
    listVehicles: async (params?: {
        cursor?: string;
        limit?: number;
        sort?: string;
        status?: 'approved' | 'rejected' | 'pending';
        q?: string;
    }): Promise<ServiceResponse<Vehicle[]>> => {
        try {
            console.log('📋 Listando veículos processados (motoristas)...');
            const queryParams: Record<string, any> = {
                limit: params?.limit || 50,
                sort: params?.sort || '-updatedAt',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params. q;

            const response = await api.get<PaginatedResponse<any>>(
                '/v1/admin/drivers',
                { params: queryParams }
            );

            console.log('✅ Motoristas obtidos:', response.data.items. length);

            // Converter motoristas em veículos
            const vehicles: Vehicle[] = response.data.items.map((driver: any) => ({
                id: driver.userId,
                driverId: driver.userId,
                brandId: '',
                modelId: '',
                year: new Date().getFullYear(),
                plate: 'N/A',
                chassis: '',
                color: '',
                status: driver. status === 'ONBOARDING' ? 'pending' : 'approved',
                createdAt: driver.createdAt,
                updatedAt: driver.updatedAt,
                metadata: {
                    motoristName: driver.name,
                    motoristEmail: driver.email,
                    motoristPhone: driver.phone,
                    motoristCPF: driver.cpf,
                    motoristCNH: driver.cnhNumber,
                    motoristStatus: driver.status,
                    motoristEmailVerified: driver.emailVerified,
                },
            }));

            console.log('✅ Motoristas processados mapeados:', vehicles.length);

            return {
                success: true,
                data: vehicles,
            };
        } catch (error: any) {
            console.error('❌ Erro ao listar veículos:', error.response?.data || error.message);
            return {
                success: false,
                message: 'Erro ao listar veículos',
                data: [],
            };
        }
    },

    /**
     * ✅ Obter motorista por ID
     */
    getVehicle: async (vehicleId: string): Promise<ServiceResponse<Vehicle>> => {
        try {
            console.log('🔍 Obtendo motorista:', vehicleId);

            const response = await api.get<any>(
                `/v1/admin/drivers/${vehicleId}`
            );
            console.log('✅ Motorista obtido');

            const vehicle: Vehicle = {
                id: response.data. userId,
                driverId: response.data.userId,
                brandId: '',
                modelId: '',
                year: new Date(). getFullYear(),
                plate: 'N/A',
                chassis: '',
                color: '',
                status: response.data. status === 'ONBOARDING' ?  'pending' : 'approved',
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt,
                metadata: response.data,
            };

            return {
                success: true,
                data: vehicle,
            };
        } catch (error: any) {
            console.error('❌ Erro ao obter motorista:', error.response?.data);
            return {
                success: false,
                message: 'Erro ao obter motorista',
                data: {} as Vehicle,
            };
        }
    },

    /**
     * ✅ Aprovar motorista
     * POST /v1/admin/drivers/{driverId}/approve (assumindo que existe)
     */
    approveVehicle: async (vehicleId: string): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log('✅ Aprovando motorista:', vehicleId);
            const response = await api.post<{ message: string }>(
                `/v1/admin/drivers/${vehicleId}/approve`
            );
            console.log('✅ Motorista aprovado');

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao aprovar motorista:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.error?.message || 'Erro ao aprovar motorista',
                data: { message: '' },
            };
        }
    },

    /**
     * ✅ Rejeitar motorista
     * POST /v1/admin/drivers/{driverId}/reject
     */
    rejectVehicle: async (
        vehicleId: string,
        rejectionReason: string
    ): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log('❌ Rejeitando motorista:', vehicleId);
            const response = await api.post<{ message: string }>(
                `/v1/admin/drivers/${vehicleId}/reject`,
                { rejectionReason }
            );
            console.log('✅ Motorista rejeitado');

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao rejeitar motorista:', error.response?.data);
            return {
                success: false,
                message: error.response?.data?.error?.message || 'Erro ao rejeitar motorista',
                data: { message: '' },
            };
        }
    },

    /**
     * ✅ Deletar motorista
     */
    deleteVehicle: async (vehicleId: string): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log('🗑️ Deletando motorista:', vehicleId);
            const response = await api.delete<{ message: string }>(
                `/v1/admin/drivers/${vehicleId}`
            );
            console.log('✅ Motorista deletado');

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao deletar motorista:', error.response?.data);
            return {
                success: false,
                message: 'Erro ao deletar motorista',
                data: { message: '' },
            };
        }
    },
};

export default adminVehiclesService;