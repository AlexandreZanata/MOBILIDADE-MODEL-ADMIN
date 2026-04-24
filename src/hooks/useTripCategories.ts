import { useState, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { TripCategory, TripCategoryFormData } from '@/types/payment';
import { message } from 'antd';

interface UseTripCategoriesReturn {
    categories: TripCategory[];
    loading: boolean;
    error: string | null;
    fetchCategories: (activeOnly?: boolean) => Promise<void>;
    createCategory: (data: TripCategoryFormData) => Promise<TripCategory | null>;
    updateCategory: (id: string, data: Partial<TripCategoryFormData>) => Promise<TripCategory | null>;
    deleteCategory: (id: string) => Promise<boolean>;
}

export const useTripCategories = (): UseTripCategoriesReturn => {
    const [categories, setCategories] = useState<TripCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async (activeOnly?: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getTripCategories(activeOnly);
            if (response.success) {
                setCategories(response. data || []);
            } else {
                setError(response. message || 'Erro ao buscar categorias de corrida');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message. error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = useCallback(async (data: TripCategoryFormData) => {
        try {
            setLoading(true);
            const response = await paymentService.createTripCategory(data);
            if (response.success) {
                message.success('Categoria de corrida criada com sucesso');
                return response.data;
            } else {
                message.error(response.message || 'Erro ao criar categoria de corrida');
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

    const updateCategory = useCallback(async (id: string, data: Partial<TripCategoryFormData>) => {
        try {
            setLoading(true);
            const response = await paymentService.updateTripCategory(id, data);
            if (response.success) {
                message.success('Categoria de corrida atualizada com sucesso');
                return response.data;
            } else {
                message.error(response.message || 'Erro ao atualizar categoria de corrida');
                return null;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err. message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await paymentService.deleteTripCategory(id);
            if (response.success) {
                message.success('Categoria de corrida removida com sucesso');
                return true;
            } else {
                message.error(response. message || 'Erro ao remover categoria de corrida');
                return false;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ?  err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};