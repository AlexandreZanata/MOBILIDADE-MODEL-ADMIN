import { useState, useCallback } from 'react';
import vehicleBrandService from '@/services/vehicleBrandService';
import { VehicleBrand } from '@/types/driver';
import { message } from 'antd';

interface UseVehicleBrandsReturn {
    brands: VehicleBrand[];
    loading: boolean;
    error: string | null;
    fetchBrands: (activeOnly?: boolean) => Promise<void>;
    fetchPublicBrands: () => Promise<void>;
    createBrand: (data: { name: string; active: boolean }) => Promise<VehicleBrand | null>;
    updateBrand: (id: string, data: Partial<{ name: string; active: boolean }>) => Promise<VehicleBrand | null>;
    deleteBrand: (id: string) => Promise<boolean>;
}

export const useVehicleBrands = (): UseVehicleBrandsReturn => {
    const [brands, setBrands] = useState<VehicleBrand[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = useCallback(async (activeOnly?: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleBrandService.list(activeOnly);
                setBrands(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPublicBrands = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleBrandService.getPublic();
                setBrands(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (data: { name: string; active: boolean }) => {
        try {
            setLoading(true);
            const response = await vehicleBrandService.create(data);
                message.success('Marca de veículo criada com sucesso');
                return response.data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBrand = useCallback(async (id: string, data: Partial<{ name: string; active: boolean }>) => {
        try {
            setLoading(true);
            const response = await vehicleBrandService.update(id, data as { name: string; active: boolean });
                message.success('Marca de veículo atualizada com sucesso');
                return response.data;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await vehicleBrandService.delete(id);
                message.success('Marca de veículo deletada com sucesso');
                return true;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        brands,
        loading,
        error,
        fetchBrands,
        fetchPublicBrands,
        createBrand,
        updateBrand,
        deleteBrand,
    };
};