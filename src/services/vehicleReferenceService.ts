import api from './api';

/**
 * ✅ VEHICLE REFERENCE SERVICE
 * Gerencia dados de referência de veículos (marcas, modelos, anos mínimos)
 * API: /v1/admin/vehicle-reference
 */

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
    name:  string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleMinYear {
    id: string;
    minYear: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    description?:  string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    items:  T[];
    nextCursor:  string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

interface ServiceResponse<T> {
    success: boolean;
    error?: string;
    data?: T;
}

const vehicleReferenceService = {
    // ========== BRANDS ==========

    /**
     * ✅ Listar marcas
     * GET /v1/admin/vehicle-reference/brands
     */
    listBrands: async (params?:  {
        cursor?: string;
        limit?: number;
        sort?: string;
        q?: string;
    }): Promise<ServiceResponse<PaginatedResponse<VehicleBrand>>> => {
        try {
            console.log('📦 Carregando marcas de veículos...');
            const queryParams:  Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt,name',
            };

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params.q;

            const response = await api.get<PaginatedResponse<VehicleBrand>>(
                '/v1/admin/vehicle-reference/brands',
                { params: queryParams }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('❌ Erro ao carregar marcas:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao carregar marcas',
            };
        }
    },

    /**
     * ✅ Obter marca por ID
     * GET /v1/admin/vehicle-reference/brands/{id}
     */
    getBrand: async (id: string): Promise<ServiceResponse<VehicleBrand>> => {
        try {
            const response = await api.get<VehicleBrand>(
                `/v1/admin/vehicle-reference/brands/${id}`
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?. data?.error?.message || error. message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Criar marca
     * POST /v1/admin/vehicle-reference/brands
     */
    createBrand: async (data: {
        name: string;
        slug: string;
    }): Promise<ServiceResponse<VehicleBrand>> => {
        try {
            const response = await api.post<VehicleBrand>(
                '/v1/admin/vehicle-reference/brands',
                data
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Atualizar marca
     * PATCH /v1/admin/vehicle-reference/brands/{id}
     */
    updateBrand:  async (
        id: string,
        data: {
            name?: string;
            slug?: string;
        }
    ): Promise<ServiceResponse<VehicleBrand>> => {
        try {
            const response = await api.patch<VehicleBrand>(
                `/v1/admin/vehicle-reference/brands/${id}`,
                data
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Deletar marca
     * DELETE /v1/admin/vehicle-reference/brands/{id}
     */
    deleteBrand: async (id: string): Promise<ServiceResponse<void>> => {
        try {
            await api.delete(`/v1/admin/vehicle-reference/brands/${id}`);
            return {
                success: true,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    // ========== MODELS ==========

    /**
     * ✅ Listar modelos
     * GET /v1/admin/vehicle-reference/models
     */
    listModels: async (params?: {
        cursor?:  string;
        limit?: number;
        sort?: string;
        q?: string;
        brandId?: string;
    }): Promise<ServiceResponse<PaginatedResponse<VehicleModel>>> => {
        try {
            console.log('🚗 Carregando modelos de veículos...');
            const queryParams: Record<string, any> = {
                limit:  params?.limit || 20,
                sort: params?.sort || '-createdAt,name',
            };

            if (params?.cursor) queryParams.cursor = params. cursor;
            if (params?. q) queryParams.q = params.q;
            if (params?.brandId) queryParams['brandId[eq]'] = params.brandId;

            const response = await api. get<PaginatedResponse<VehicleModel>>(
                '/v1/admin/vehicle-reference/models',
                { params:  queryParams }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao carregar modelos:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao carregar modelos',
            };
        }
    },

    /**
     * ✅ Obter modelos por marca
     * GET /v1/admin/vehicle-reference/models/brand/{brandId}
     */
    getModelsByBrand: async (
        brandId: string,
        params?: {
            cursor?: string;
            limit?: number;
            sort?: string;
            q?: string;
        }
    ): Promise<ServiceResponse<PaginatedResponse<VehicleModel>>> => {
        try {
            const queryParams: Record<string, any> = {
                limit: params?.limit || 20,
                sort: params?.sort || '-createdAt,name',
            };

            if (params?. cursor) queryParams.cursor = params.cursor;
            if (params?.q) queryParams.q = params.q;

            const response = await api.get<PaginatedResponse<VehicleModel>>(
                `/v1/admin/vehicle-reference/models/brand/${brandId}`,
                { params: queryParams }
            );

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Obter modelo por ID
     * GET /v1/admin/vehicle-reference/models/{id}
     */
    getModel: async (id:  string): Promise<ServiceResponse<VehicleModel>> => {
        try {
            const response = await api.get<VehicleModel>(
                `/v1/admin/vehicle-reference/models/${id}`
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Criar modelo
     * POST /v1/admin/vehicle-reference/models
     */
    createModel: async (data:  {
        brandId: string;
        name:  string;
        slug: string;
    }): Promise<ServiceResponse<VehicleModel>> => {
        try {
            const response = await api.post<VehicleModel>(
                '/v1/admin/vehicle-reference/models',
                data
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?. error?.message || error.message;
            return {
                success:  false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Atualizar modelo
     * PATCH /v1/admin/vehicle-reference/models/{id}
     */
    updateModel: async (
        id: string,
        data:  {
            brandId?: string;
            name?:  string;
            slug?: string;
        }
    ): Promise<ServiceResponse<VehicleModel>> => {
        try {
            const response = await api.patch<VehicleModel>(
                `/v1/admin/vehicle-reference/models/${id}`,
                data
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?. error?.message || error.message;
            return {
                success:  false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Deletar modelo
     * DELETE /v1/admin/vehicle-reference/models/{id}
     */
    deleteModel: async (id: string): Promise<ServiceResponse<void>> => {
        try {
            await api.delete(`/v1/admin/vehicle-reference/models/${id}`);
            return {
                success: true,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    // ========== MIN YEAR ==========

    /**
     * ✅ Obter configuração de ano mínimo
     * GET /v1/admin/vehicle-reference/min-year
     */
    getMinYear: async (): Promise<ServiceResponse<VehicleMinYear>> => {
        try {
            console.log('⚙️ Carregando configuração de ano mínimo...');
            const response = await api.get<VehicleMinYear>(
                '/v1/admin/vehicle-reference/min-year'
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    /**
     * ✅ Atualizar configuração de ano mínimo
     * PATCH /v1/admin/vehicle-reference/min-year
     */
    updateMinYear: async (minYear: number): Promise<ServiceResponse<VehicleMinYear>> => {
        try {
            const response = await api.patch<VehicleMinYear>(
                '/v1/admin/vehicle-reference/min-year',
                { minYear }
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            return {
                success: false,
                error: errorMsg,
            };
        }
    },

    // ========== SERVICE CATEGORIES ==========

    /**
     * ✅ Listar categorias de serviço
     * GET /v1/admin/service-categories (ou similar)
     */
    listServiceCategories: async (): Promise<ServiceResponse<ServiceCategory[]>> => {
        try {
            console.log('📂 Carregando categorias de serviço...');
            const response = await api.get<ServiceCategory[]>(
                '/v1/admin/service-categories'
            );
            return {
                success: true,
                data:  response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao carregar categorias:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao carregar categorias',
                data: [],
            };
        }
    },
};

export default vehicleReferenceService;