import { useState, useCallback } from 'react';
import vehicleReferenceService from '@/services/vehicleReferenceService';
import { VehicleModel } from '@/types/vehicle-reference';
import { message } from 'antd';

interface UseVehicleModelsReturn {
    models: VehicleModel[];
    loading: boolean;
    error: string | null;
    fetchModels: (brandId: string, activeOnly?: boolean) => Promise<void>;
    fetchPublicModels: (brandId: string) => Promise<void>;
    createModel: (data: { brand_id: string; name: string; type: string; active: boolean }) => Promise<VehicleModel | null>;
    updateModel: (id: string, data: Partial<{ name: string; type: string; active: boolean }>) => Promise<VehicleModel | null>;
    deleteModel: (id: string) => Promise<boolean>;
}

export const useVehicleModels = (): UseVehicleModelsReturn => {
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchModels = useCallback(async (brandId: string, _activeOnly?: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleReferenceService.getModelsByBrand(brandId, {
                limit: 100,
                sort: 'name',
            });
            if (response.success && response.data) {
                setModels(response.data.items || []);
            } else {
                setError(response.error || 'Erro ao buscar modelos de veículos');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPublicModels = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleReferenceService.getModelsByBrand(brandId, {
                limit: 100,
            });
            if (response.success && response.data) {
                setModels(response.data.items || []);
            } else {
                setError(response.error || 'Erro ao buscar modelos de veículos');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createModel = useCallback(async (data: { brand_id: string; name: string; type: string; active: boolean }) => {
        try {
            setLoading(true);
            // Converter para o formato esperado pela API
            const payload = {
                brandId: data.brand_id,
                name: data.name,
                slug: data.name.toLowerCase().replace(/\s+/g, '-'),
            };
            const response = await vehicleReferenceService.createModel(payload);
            if (response.success && response.data) {
                message.success('Modelo de veículo criado com sucesso');
                return response.data;
            } else {
                message.error(response.error || 'Erro ao criar modelo de veículo');
                return null;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateModel = useCallback(async (id: string, data: Partial<{ name: string; type: string; active: boolean }>) => {
        try {
            setLoading(true);
            const payload: { name?: string; slug?: string } = {};
            if (data.name) {
                payload.name = data.name;
                payload.slug = data.name.toLowerCase().replace(/\s+/g, '-');
            }
            const response = await vehicleReferenceService.updateModel(id, payload);
            if (response.success && response.data) {
                message.success('Modelo de veículo atualizado com sucesso');
                return response.data;
            } else {
                message.error(response.error || 'Erro ao atualizar modelo de veículo');
                return null;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteModel = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await vehicleReferenceService.deleteModel(id);
            if (response.success) {
                message.success('Modelo de veículo deletado com sucesso');
                return true;
            } else {
                message.error(response.error || 'Erro ao deletar modelo de veículo');
                return false;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        models,
        loading,
        error,
        fetchModels,
        fetchPublicModels,
        createModel,
        updateModel,
        deleteModel,
    };
};