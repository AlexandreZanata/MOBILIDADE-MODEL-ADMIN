import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../api';

interface ServiceResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface DriverApplication {
    userId: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    cnhNumber: string;
    cnhExpirationDate: string;
    cnhCategory: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

export interface VehicleBrand {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleModel {
    id: string;
    brandId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

class DriverService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Erro na requisição da API:', error.message);
                if (error.response?.status === 401) {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * ✅ Listar motoristas (que estão em processo de aprovação)
     * GET /v1/admin/drivers
     * Filtra por status AWAITING_CNH, AWAITING_VEHICLE, etc
     */
    async getDriverApplications(
        cursor?: string,
        perPage: number = 15,
        status?: string
    ): Promise<ServiceResponse<PaginatedResponse<DriverApplication>>> {
        try {
            console.log('📋 Buscando motoristas para aprovação...');
            const params: Record<string, any> = {
                limit: perPage,
                sort: '-createdAt',
            };

            if (cursor) {
                params.cursor = cursor;
            }

            // Filtrar por status se fornecido
            if (status) {
                params['status[eq]'] = status;
            }

            const response = await this. api.get<PaginatedResponse<DriverApplication>>(
                '/v1/admin/drivers',
                { params }
            );
            console.log('✅ Motoristas obtidos:', response.data.items.length);
            return {
                success: true,
                data: response. data,
            };
        } catch (error) {
            console.error('❌ Erro ao buscar motoristas:', error);
            return {
                success: false,
                message: 'Erro ao buscar motoristas',
                data: { items: [], nextCursor: null, prevCursor: null, hasMore: false, totalCount: 0 },
            };
        }
    }

    /**
     * ✅ Aprovar documento de motorista
     * POST /v1/admin/drivers/documents/{documentId}/approve
     */
    async approveDocument(documentId: string): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('✅ Aprovando documento:', documentId);
            const response = await this.api. post<{ message: string }>(
                `/v1/admin/drivers/documents/${documentId}/approve`
            );
            console.log('✅ Documento aprovado');
            return {
                success: true,
                data: response. data,
            };
        } catch (error) {
            console.error('❌ Erro ao aprovar documento:', error);
            return {
                success: false,
                message: 'Erro ao aprovar documento',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Rejeitar documento de motorista
     * POST /v1/admin/drivers/documents/{documentId}/reject
     */
    async rejectDocument(
        documentId: string,
        rejectionReason: string
    ): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('❌ Rejeitando documento:', documentId);
            const response = await this.api.post<{ message: string }>(
                `/v1/admin/drivers/documents/${documentId}/reject`,
                { rejectionReason }
            );
            console.log('✅ Documento rejeitado');
            return {
                success: true,
                data: response. data,
            };
        } catch (error) {
            console.error('❌ Erro ao rejeitar documento:', error);
            return {
                success: false,
                message: 'Erro ao rejeitar documento',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Aprovar veículo de motorista
     * POST /v1/admin/drivers/vehicles/{vehicleId}/approve
     */
    async approveVehicle(vehicleId: string): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('✅ Aprovando veículo:', vehicleId);
            const response = await this.api.post<{ message: string }>(
                `/v1/admin/drivers/vehicles/${vehicleId}/approve`
            );
            console. log('✅ Veículo aprovado');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Erro ao aprovar veículo:', error);
            return {
                success: false,
                message: 'Erro ao aprovar veículo',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Rejeitar veículo de motorista
     * POST /v1/admin/drivers/vehicles/{vehicleId}/reject
     */
    async rejectVehicle(
        vehicleId: string,
        rejectionReason: string
    ): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('❌ Rejeitando veículo:', vehicleId);
            const response = await this. api.post<{ message: string }>(
                `/v1/admin/drivers/vehicles/${vehicleId}/reject`,
                { rejectionReason }
            );
            console.log('✅ Veículo rejeitado');
            return {
                success: true,
                data: response. data,
            };
        } catch (error) {
            console.error('❌ Erro ao rejeitar veículo:', error);
            return {
                success: false,
                message: 'Erro ao rejeitar veículo',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Listar marcas de veículos (público)
     * GET /v1/admin/vehicle-reference/brands
     */
    async getPublicVehicleBrands(): Promise<ServiceResponse<VehicleBrand[]>> {
        try {
            console.log('🚗 Buscando marcas de veículos...');
            const response = await this.api.get<PaginatedResponse<VehicleBrand>>(
                '/v1/admin/vehicle-reference/brands',
                {
                    params: {
                        limit: 100,
                    },
                }
            );
            console.log('✅ Marcas obtidas:', response.data.items. length);

            // Extrair apenas os items do array paginado
            const brands = response.data.items || [];
            return {
                success: true,
                data: brands,
            };
        } catch (error) {
            console.error('❌ Erro ao buscar marcas:', error);
            return {
                success: false,
                message: 'Erro ao buscar marcas',
                data: [],
            };
        }
    }

    /**
     * ✅ Listar modelos de veículos por marca
     * GET /v1/admin/vehicle-reference/models/brand/{brandId}
     */
    async getPublicVehicleModels(brandId: string): Promise<ServiceResponse<VehicleModel[]>> {
        try {
            console.log('🚗 Buscando modelos para marca:', brandId);
            const response = await this.api.get<PaginatedResponse<VehicleModel>>(
                `/v1/admin/vehicle-reference/models/brand/${brandId}`,
                {
                    params: {
                        limit: 100,
                    },
                }
            );
            console.log('✅ Modelos obtidos:', response.data.items.length);

            // Extrair apenas os items do array paginado
            const models = response.data.items || [];
            return {
                success: true,
                data: models,
            };
        } catch (error) {
            console.error('❌ Erro ao buscar modelos:', error);
            return {
                success: false,
                message: 'Erro ao buscar modelos',
                data: [],
            };
        }
    }

    /**
     * ✅ Obter configuração de ano mínimo
     * GET /v1/admin/vehicle-reference/min-year
     */
    async getMinimumYear(): Promise<ServiceResponse<{ id: string; minYear: number; createdAt: string; updatedAt: string }>> {
        try {
            console. log('📅 Buscando ano mínimo de veículos...');
            const response = await this.api.get<{
                id: string;
                minYear: number;
                createdAt: string;
                updatedAt: string;
            }>('/v1/admin/vehicle-reference/min-year');
            console.log('✅ Ano mínimo obtido:', response.data.minYear);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Erro ao buscar ano mínimo:', error);
            return {
                success: false,
                message: 'Erro ao buscar ano mínimo',
                data: { id: '', minYear: 1990, createdAt: '', updatedAt: '' },
            };
        }
    }

    /**
     * ✅ Deletar motorista
     * DELETE /v1/admin/drivers/{driverId}
     */
    async deleteDriver(driverId: string): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('🗑️ Deletando motorista:', driverId);
            const response = await this.api.delete<{ message: string }>(
                `/v1/admin/drivers/${driverId}`
            );
            console.log('✅ Motorista deletado');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Erro ao deletar motorista:', error);
            return {
                success: false,
                message: 'Erro ao deletar motorista',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Reativar motorista
     * POST /v1/admin/drivers/{driverId}/reactivate
     */
    async reactivateDriver(driverId: string): Promise<ServiceResponse<{ message: string }>> {
        try {
            console.log('🔄 Reativando motorista:', driverId);
            const response = await this.api.post<{ message: string }>(
                `/v1/admin/drivers/${driverId}/reactivate`
            );
            console. log('✅ Motorista reativado');
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Erro ao reativar motorista:', error);
            return {
                success: false,
                message: 'Erro ao reativar motorista',
                data: { message: '' },
            };
        }
    }

    /**
     * ✅ Registrar veículo
     * POST /v1/drivers/vehicles (se aplicável) ou via outro endpoint
     */
    async registerVehicle(payload: {
        brand_id: string;
        model_id: string;
        year: number;
        plate: string;
        chassis: string;
        color: string;
        metadata?: Record<string, any>;
    }): Promise<ServiceResponse<any>> {
        try {
            console.log('🚗 Registrando veículo.. .');
            // Usar o endpoint correto da sua API
            const response = await this. api.post<any>('/v1/drivers/vehicles', payload);
            console.log('✅ Veículo registrado');
            return {
                success: true,
                data: response. data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao registrar veículo:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao registrar veículo',
                data: null,
            };
        }
    }
}

export const driverService = new DriverService();