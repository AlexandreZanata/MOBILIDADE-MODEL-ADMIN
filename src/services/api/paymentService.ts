import api from '../api';
import {
    PaymentMethod,
    PaymentBrand,
    TripCategory,
    TripPricing,
    PaymentMethodFormData,
    TripCategoryFormData,
    TripPricingFormData,
    ApiResponse,
} from '@/types/payment';

class PaymentService {
    // ========== PAYMENT METHODS ==========

    async getPaymentMethods(type?: string): Promise<ApiResponse<PaymentMethod[]>> {
        const params = type ? { type } : {};
        const response = await api.get<PaymentMethod[]>(
            '/v1/payment-methods',
            { params }
        );
        return { success: true, message: '', data: response.data, trace_id: '' };
    }

    async createPaymentMethod(data: PaymentMethodFormData): Promise<ApiResponse<PaymentMethod>> {
        const response = await api.post<PaymentMethod>(
            '/v1/payment-methods',
            data
        );
        return { success: true, message: '', data: response.data, trace_id: '' };
    }

    async updatePaymentMethod(id: string, data: Partial<PaymentMethodFormData>): Promise<ApiResponse<PaymentMethod>> {
        const response = await api.put<PaymentMethod>(
            `/v1/payment-methods/${id}`,
            data
        );
        return { success: true, message: '', data: response.data, trace_id: '' };
    }

    async deletePaymentMethod(id: string): Promise<ApiResponse<void>> {
        await api.delete<void>(
            `/v1/payment-methods/${id}`
        );
        return { success: true, message: '', data: undefined as void, trace_id: '' };
    }

    // ========== PAYMENT BRANDS ==========

    async getCardBrands(): Promise<ApiResponse<PaymentBrand[]>> {
        const response = await api.get<PaymentBrand[]>(
            '/v1/card-brands'
        );
        return { success: true, message: '', data: response.data, trace_id: '' };
    }

    async getCardBrandById(id: string): Promise<ApiResponse<PaymentBrand>> {
        const response = await api.get<PaymentBrand>(
            `/v1/card-brands/${id}`
        );
        return { success: true, message: '', data: response.data, trace_id: '' };
    }

    // ========== TRIP CATEGORIES ==========

    async getTripCategories(activeOnly?: boolean): Promise<ApiResponse<TripCategory[]>> {
        const params = activeOnly !== undefined ? { active_only: activeOnly } : {};
        const response = await api.get<ApiResponse<TripCategory[]>>(
            '/admin/trip-categories',
            { params }
        );
        return response.data;
    }

    async createTripCategory(data: TripCategoryFormData): Promise<ApiResponse<TripCategory>> {
        const response = await api.post<ApiResponse<TripCategory>>(
            '/admin/trip-categories',
            data
        );
        return response.data;
    }

    async updateTripCategory(id: string, data: Partial<TripCategoryFormData>): Promise<ApiResponse<TripCategory>> {
        const response = await api.put<ApiResponse<TripCategory>>(
            `/admin/trip-categories/${id}`,
            data
        );
        return response.data;
    }

    async deleteTripCategory(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(
            `/admin/trip-categories/${id}`
        );
        return response.data;
    }

    // ========== TRIP PRICING ==========

    async getTripPricing(): Promise<ApiResponse<TripPricing>> {
        const response = await api.get<ApiResponse<TripPricing>>(
            '/admin/trip-pricing'
        );
        return response.data;
    }

    async updateTripPricing(data: TripPricingFormData): Promise<ApiResponse<TripPricing>> {
        const response = await api.put<ApiResponse<TripPricing>>(
            '/admin/trip-pricing',
            data
        );
        return response.data;
    }
}

export const paymentService = new PaymentService();