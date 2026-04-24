import apiClient from './apiClient';
import { PaymentBrand, PaymentBrandFormData } from '@/types/payment';

const paymentBrandService = {
    list: async (paymentMethodId?: string) => {
        const params: Record<string, string> = {};
        if (paymentMethodId) {
            params.payment_method_id = paymentMethodId;
        }
        return apiClient.get<PaymentBrand[]>('/admin/payment-brands', params);
    },

    create: async (data: PaymentBrandFormData) => {
        return apiClient.post<PaymentBrand>('/admin/payment-brands', data);
    },

    update: async (id: string, data: Partial<PaymentBrandFormData>) => {
        return apiClient.put<PaymentBrand>(`/admin/payment-brands/${id}`, data);
    },

    delete: async (id: string) => {
        return apiClient.delete(`/admin/payment-brands/${id}`);
    },
};

export default paymentBrandService;