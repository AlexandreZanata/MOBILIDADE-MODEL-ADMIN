// src/services/paymentService. ts
import api from './api';

export interface PaymentMethod {
    id: string;
    name: string;
    slug: string;
    description: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CardBrand {
    id: string;
    paymentMethodId: string;
    name: string;
    slug: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const paymentService = {
    /**
     * GET /v1/payment-methods
     * Listar todas as formas de pagamento habilitadas
     */
    getAllPaymentMethods: async (): Promise<PaymentMethod[]> => {
        try {
            console.log('Buscando métodos de pagamento...');
            const response = await api.get<PaymentMethod[]>('/v1/payment-methods');
            console.log('Métodos de pagamento:', response.data);
            return response.data || [];
        } catch (error: any) {
            console.error('Erro ao buscar métodos de pagamento:', error);
            return [];
        }
    },

    /**
     * GET /v1/payment-methods/{id}
     * Obter forma de pagamento específica por ID
     */
    getPaymentMethodById: async (id: string): Promise<PaymentMethod | null> => {
        try {
            const response = await api.get<PaymentMethod>(`/v1/payment-methods/${id}`);
            return response.data || null;
        } catch (error: any) {
            console.error(`Erro ao buscar método de pagamento ${id}:`, error);
            return null;
        }
    },

    /**
     * GET /v1/card-brands
     * Listar bandeiras de cartão
     */
    getCardBrands: async (): Promise<CardBrand[]> => {
        try {
            const response = await api.get<CardBrand[]>('/v1/card-brands');
            return response.data || [];
        } catch (error: any) {
            console.error('Erro ao buscar bandeiras de cartão:', error);
            return [];
        }
    },
};