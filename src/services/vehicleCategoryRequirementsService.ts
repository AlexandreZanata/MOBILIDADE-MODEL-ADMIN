import api from './api';

/**
 * ✅ VEHICLE CATEGORY REQUIREMENTS SERVICE
 * Gerencia requisitos de categoria de veículos (ano mínimo por categoria)
 * API: /v1/admin/vehicle-category-requirements
 */

export interface VehicleCategoryRequirement {
    id: string;
    serviceCategoryId: string;
    minYear: number;
    createdAt: string;
    updatedAt: string;
}

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const vehicleCategoryRequirementsService = {
    /**
     * ✅ Listar todos os requisitos de categoria
     * GET /v1/admin/vehicle-category-requirements
     */
    listRequirements: async (): Promise<ServiceResponse<VehicleCategoryRequirement[]>> => {
        try {
            console.log('📋 Listando requisitos de categoria de veículos...');
            const response = await api.get<VehicleCategoryRequirement[]>(
                '/v1/admin/vehicle-category-requirements'
            );
            console.log('✅ Requisitos carregados:', response.data);
            return {
                success: true,
                data: response.data,
            };
        } catch (error:  any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('❌ Erro ao listar requisitos:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao listar requisitos',
                data: [],
            };
        }
    },

    /**
     * ✅ Obter requisito de uma categoria específica
     * GET /v1/admin/vehicle-category-requirements/category/{categoryId}
     */
    getRequirementByCategory: async (
        categoryId: string
    ): Promise<ServiceResponse<VehicleCategoryRequirement>> => {
        try {
            console.log('🔍 Obtendo requisito da categoria:', categoryId);
            const response = await api.get<VehicleCategoryRequirement>(
                `/v1/admin/vehicle-category-requirements/category/${categoryId}`
            );
            console.log('✅ Requisito obtido:', response.data);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.error('❌ Erro ao obter requisito:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao obter requisito',
            };
        }
    },

    /**
     * ✅ Criar ou atualizar requisito de categoria
     * POST /v1/admin/vehicle-category-requirements
     */
    createOrUpdateRequirement: async (
        serviceCategoryId: string,
        minYear: number
    ): Promise<ServiceResponse<VehicleCategoryRequirement>> => {
        try {
            console.log('💾 Criando/Atualizando requisito de categoria.. .');
            console.log('📝 Dados:', { serviceCategoryId, minYear });

            const response = await api.post<VehicleCategoryRequirement>(
                '/v1/admin/vehicle-category-requirements',
                {
                    serviceCategoryId,
                    minYear,
                }
            );
            console.log('✅ Requisito criado/atualizado:', response.data);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?. error?.message || error.message;
            console.error('❌ Erro ao criar/atualizar requisito:', errorMsg);
            return {
                success: false,
                error: errorMsg || 'Erro ao criar/atualizar requisito',
            };
        }
    },

    /**
     * ✅ Deletar requisito de uma categoria
     * DELETE /v1/admin/vehicle-category-requirements/category/{categoryId}
     */
    deleteRequirement: async (categoryId: string): Promise<ServiceResponse<void>> => {
        try {
            console.log('🗑️ Deletando requisito da categoria:', categoryId);
            await api.delete(
                `/v1/admin/vehicle-category-requirements/category/${categoryId}`
            );
            console.log('✅ Requisito deletado com sucesso');
            return {
                success: true,
            };
        } catch (error: any) {
            const errorMsg = error.response?.data?.error?. message || error.message;
            console.error('❌ Erro ao deletar requisito:', errorMsg);
            return {
                success: false,
                error:  errorMsg || 'Erro ao deletar requisito',
            };
        }
    },
};

export default vehicleCategoryRequirementsService;