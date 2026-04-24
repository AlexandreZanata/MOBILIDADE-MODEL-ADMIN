import { useState, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment';
import { App } from 'antd';

interface UsePaymentMethodsReturn {
    methods: PaymentMethod[];
    loading: boolean;
    error: string | null;
    fetchMethods: (type?: string) => Promise<void>;
    createMethod: (data: PaymentMethodFormData) => Promise<PaymentMethod | null>;
    updateMethod: (id: string, data: Partial<PaymentMethodFormData>) => Promise<PaymentMethod | null>;
    deleteMethod: (id: string) => Promise<boolean>;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
    const { message } = App.useApp();
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMethods = useCallback(async (type?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getPaymentMethods(type);
            if (response.success) {
                setMethods(response.data || []);
            } else {
                setError(response.message || 'Erro ao buscar métodos de pagamento');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createMethod = useCallback(async (data: PaymentMethodFormData) => {
        try {
            setLoading(true);
            const response = await paymentService.createPaymentMethod(data);
            if (response.success) {
                message.success('Método de pagamento criado com sucesso');
                return response.data;
            } else {
                message.error(response.message || 'Erro ao criar método de pagamento');
                return null;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ?  err.message : 'Erro desconhecido';
            message.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMethod = useCallback(async (id: string, data: Partial<PaymentMethodFormData>) => {
        try {
            setLoading(true);
            const response = await paymentService.updatePaymentMethod(id, data);
            if (response.success) {
                message. success('Método de pagamento atualizado com sucesso');
                return response.data;
            } else {
                message.error(response.message || 'Erro ao atualizar método de pagamento');
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

    const deleteMethod = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const response = await paymentService.deletePaymentMethod(id);
            if (response.success) {
                message.success('Método de pagamento removido com sucesso');
                return true;
            } else {
                message.error(response.message || 'Erro ao remover método de pagamento');
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
        methods,
        loading,
        error,
        fetchMethods,
        createMethod,
        updateMethod,
        deleteMethod,
    };
};