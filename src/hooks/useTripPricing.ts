import { useState, useCallback } from 'react';
import { paymentService } from '@/services/api/paymentService';
import { TripPricing, TripPricingFormData } from '@/types/payment';
import { message } from 'antd';

interface UseTripPricingReturn {
    pricing: TripPricing | null;
    loading: boolean;
    error: string | null;
    fetchPricing: () => Promise<void>;
    updatePricing: (data: TripPricingFormData) => Promise<TripPricing | null>;
}

export const useTripPricing = (): UseTripPricingReturn => {
    const [pricing, setPricing] = useState<TripPricing | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPricing = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getTripPricing();
            if (response.success) {
                setPricing(response. data || null);
            } else {
                setError(response.message || 'Erro ao buscar configurações de tarifas');
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePricing = useCallback(async (data: TripPricingFormData) => {
        try {
            setLoading(true);
            const response = await paymentService.updateTripPricing(data);
            if (response.success) {
                message.success('Configuração de tarifas atualizada com sucesso');
                setPricing(response.data || null);
                return response.data || null;
            } else {
                message.error(response.message || 'Erro ao atualizar configuração de tarifas');
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

    return {
        pricing,
        loading,
        error,
        fetchPricing,
        updatePricing,
    };
};