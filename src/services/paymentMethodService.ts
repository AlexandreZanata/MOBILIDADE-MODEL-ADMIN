import apiClient from './apiClient';

export interface PaymentMethod {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string;
    requires_card_brand: boolean;
    active: boolean;
}

const paymentMethodService = {
    list: async (type?: string) => {
        return apiClient.get<PaymentMethod[]>('/admin/payment-methods', { type });
    },

    create: async (data: Omit<PaymentMethod, 'id'>) => {
        return apiClient.post('/admin/payment-methods', data);
    },

    update: async (id: string, data: Partial<PaymentMethod>) => {
        return apiClient.put(`/admin/payment-methods/${id}`, data);
    },

    delete: async (id: string) => {
        return apiClient.delete(`/admin/payment-methods/${id}`);
    },
};

export default paymentMethodService;