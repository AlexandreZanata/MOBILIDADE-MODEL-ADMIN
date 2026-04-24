import { useState, useCallback } from 'react';
import paymentBrandService from '@/services/paymentBrandService';
import { PaymentBrand, PaymentBrandFormData } from '@/types/payment';
import { message } from 'antd';

export interface UsePaymentBrandsReturn {
    brands: PaymentBrand[];
    loading: boolean;
    error: string | null;
    fetchBrands: (paymentMethodId?: string) => Promise<void>;
    createBrand: (data: PaymentBrandFormData) => Promise<PaymentBrand | null>;
    updateBrand: (id: string, data: Partial<PaymentBrandFormData>) => Promise<PaymentBrand | null>;
    deleteBrand: (id: string) => Promise<boolean>;
}

export const usePaymentBrands = (): UsePaymentBrandsReturn => {
    const [brands, setBrands] = useState<PaymentBrand[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBrands = useCallback(async (paymentMethodId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentBrandService.list(paymentMethodId);
            if (response.success) {
                setBrands(response.data || []);
            } else {
                setError(response.message || 'Erro ao buscar bandeiras de pagamento');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (data: PaymentBrandFormData): Promise<PaymentBrand | null> => {
        try {
            setLoading(true);
            const response = await paymentBrandService.create(data);
            if (response.success) {
                message.success('Bandeira criada com sucesso');
                return response.data as PaymentBrand;
            } else {
                message.error(response.message || 'Erro ao criar bandeira');
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

    const updateBrand = useCallback(async (id: string, data: Partial<PaymentBrandFormData>): Promise<PaymentBrand | null> => {
        try {
            setLoading(true);
            const response = await paymentBrandService.update(id, data);
            if (response.success) {
                message.success('Bandeira atualizada com sucesso');
                return response.data as PaymentBrand;
            } else {
                message.error(response.message || 'Erro ao atualizar bandeira');
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

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await paymentBrandService.delete(id);
            if (response.success) {
                message.success('Bandeira removida com sucesso');
                return true;
            } else {
                message.error(response.message || 'Erro ao remover bandeira');
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
        brands,
        loading,
        error,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
    };
};