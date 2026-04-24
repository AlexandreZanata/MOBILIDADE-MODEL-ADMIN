// src/services/adminService.ts
import api from './api';

export interface ServiceResponse {
    success: boolean;
    message: string;
    data: any;
    trace_id: string;
}

// Payment Methods
export const paymentMethodsService = {
    listMethods: async (type?: string): Promise<ServiceResponse> => {
        const response = await api.get('/admin/payment-methods', { params: { type } });
        return response.data;
    },

    createMethod: async (payload: any): Promise<ServiceResponse> => {
        const response = await api.post('/admin/payment-methods', payload);
        return response.data;
    },

    updateMethod: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/payment-methods/${id}`, payload);
        return response.data;
    },

    deleteMethod: async (id: string): Promise<ServiceResponse> => {
        const response = await api.delete(`/admin/payment-methods/${id}`);
        return response.data;
    },
};

// Payment Brands
export const paymentBrandsService = {
    listBrands: async (paymentMethodId: string, activeOnly?: boolean): Promise<ServiceResponse> => {
        const response = await api.get('/admin/payment-brands', {
            params: { payment_method_id: paymentMethodId, active_only: activeOnly },
        });
        return response. data;
    },

    createBrand: async (payload: any): Promise<ServiceResponse> => {
        const response = await api. post('/admin/payment-brands', payload);
        return response.data;
    },

    updateBrand: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/payment-brands/${id}`, payload);
        return response.data;
    },

    deleteBrand: async (id: string): Promise<ServiceResponse> => {
        const response = await api.delete(`/admin/payment-brands/${id}`);
        return response.data;
    },
};

// Trip Categories
export const tripCategoriesService = {
    listCategories: async (activeOnly?: boolean): Promise<ServiceResponse> => {
        const response = await api.get('/admin/trip-categories', {
            params: { active_only: activeOnly },
        });
        return response. data;
    },

    createCategory: async (payload: any): Promise<ServiceResponse> => {
        const response = await api.post('/admin/trip-categories', payload);
        return response.data;
    },

    updateCategory: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/trip-categories/${id}`, payload);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<ServiceResponse> => {
        const response = await api.delete(`/admin/trip-categories/${id}`);
        return response.data;
    },
};

// Trip Pricing
export const tripPricingService = {
    getPricing: async (): Promise<ServiceResponse> => {
        const response = await api. get('/admin/trip-pricing');
        return response.data;
    },

    updatePricing: async (payload: any): Promise<ServiceResponse> => {
        const response = await api.put('/admin/trip-pricing', payload);
        return response.data;
    },
};

// Vehicle Brands
export const vehicleBrandsService = {
    listBrands: async (activeOnly?: boolean): Promise<ServiceResponse> => {
        const response = await api.get('/admin/vehicle-brands', {
            params: { active_only: activeOnly },
        });
        return response. data;
    },

    createBrand: async (payload: any): Promise<ServiceResponse> => {
        const response = await api. post('/admin/vehicle-brands', payload);
        return response.data;
    },

    updateBrand: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/vehicle-brands/${id}`, payload);
        return response.data;
    },

    deleteBrand: async (id: string): Promise<ServiceResponse> => {
        const response = await api.delete(`/admin/vehicle-brands/${id}`);
        return response.data;
    },
};

// Vehicle Models
export const vehicleModelsService = {
    listModels: async (brandId: string, activeOnly?: boolean): Promise<ServiceResponse> => {
        const response = await api.get('/admin/vehicle-models', {
            params: { brand_id: brandId, active_only: activeOnly },
        });
        return response.data;
    },

    createModel: async (payload: any): Promise<ServiceResponse> => {
        const response = await api.post('/admin/vehicle-models', payload);
        return response. data;
    },

    updateModel: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/vehicle-models/${id}`, payload);
        return response.data;
    },

    deleteModel: async (id: string): Promise<ServiceResponse> => {
        const response = await api.delete(`/admin/vehicle-models/${id}`);
        return response.data;
    },
};

// Vehicle Settings
export const vehicleSettingsService = {
    getSettings: async (): Promise<ServiceResponse> => {
        const response = await api. get('/admin/vehicle-settings');
        return response.data;
    },

    updateMinimumYear: async (year: number): Promise<ServiceResponse> => {
        const response = await api.put('/admin/vehicle-settings/minimum-year', { year });
        return response.data;
    },
};

// Vehicles Management (Admin)
export const vehiclesAdminService = {
    listPendingVehicles: async (): Promise<ServiceResponse> => {
        const response = await api. get('/admin/vehicles/pending');
        return response.data;
    },

    approveVehicle: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/vehicles/${id}/approve`);
        return response.data;
    },

    rejectVehicle: async (id: string, reason: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/vehicles/${id}/reject`, { reason });
        return response.data;
    },
};

// Users
export const usersService = {
    listUsers: async (
        cursor?: string,
        perPage?: number,
        search?: string,
        active?: boolean,
        type?: string,
        includeDeleted?: boolean
    ): Promise<ServiceResponse> => {
        const response = await api.get('/users', {
            params: {
                cursor,
                per_page: perPage,
                search,
                active,
                type,
                include_deleted: includeDeleted,
            },
        });
        return response.data;
    },
};

// Public Vehicle Endpoints
export const vehiclesPublicService = {
    listBrands: async (): Promise<ServiceResponse> => {
        const response = await api. get('/vehicles/brands');
        return response.data;
    },

    listModels: async (brandId: string): Promise<ServiceResponse> => {
        const response = await api.get('/vehicles/models', {
            params: { brand_id: brandId },
        });
        return response.data;
    },
};

// Subscriptions
export const subscriptionsService = {
    getMySubscription: async (): Promise<ServiceResponse> => {
        const response = await api.get('/subscriptions/me');
        return response.data;
    },

    getSubscriptionStatus: async (): Promise<ServiceResponse> => {
        const response = await api. get('/subscriptions/status');
        return response.data;
    },

    getPaymentLink: async (): Promise<ServiceResponse> => {
        const response = await api. get('/subscriptions/payment-link');
        return response.data;
    },

    listPlans: async (): Promise<ServiceResponse> => {
        const response = await api.get('/subscriptions/plans');
        return response. data;
    },

    createSubscription: async (planId: string): Promise<ServiceResponse> => {
        const response = await api.post('/subscriptions', { plan_id: planId });
        return response.data;
    },
};

// Subscriptions Admin
export const subscriptionsAdminService = {
    listSubscriptions: async (): Promise<ServiceResponse> => {
        const response = await api. get('/admin/subscriptions');
        return response.data;
    },

    getSubscription: async (id: string): Promise<ServiceResponse> => {
        const response = await api.get(`/admin/subscriptions/${id}`);
        return response.data;
    },

    updateSubscription: async (id: string, payload: any): Promise<ServiceResponse> => {
        const response = await api.put(`/admin/subscriptions/${id}`, payload);
        return response.data;
    },

    cancelSubscription: async (id: string): Promise<ServiceResponse> => {
        const response = await api. post(`/admin/subscriptions/${id}/cancel`);
        return response.data;
    },

    suspendSubscription: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscriptions/${id}/suspend`);
        return response.data;
    },

    reactivateSubscription: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscriptions/${id}/reactivate`);
        return response.data;
    },

    configureTrial: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscriptions/${id}/configure-trial`);
        return response.data;
    },

    configureGracePeriod: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscriptions/${id}/configure-grace-period`);
        return response.data;
    },
};

// Subscription Plans Admin
export const subscriptionPlansService = {
    listPlans: async (): Promise<ServiceResponse> => {
        const response = await api.get('/admin/subscription-plans');
        return response.data;
    },

    createPlan: async (payload: any): Promise<ServiceResponse> => {
        const response = await api.post('/admin/subscription-plans', payload);
        return response.data;
    },

    activatePlan: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscription-plans/${id}/activate`);
        return response.data;
    },

    deactivatePlan: async (id: string): Promise<ServiceResponse> => {
        const response = await api.post(`/admin/subscription-plans/${id}/deactivate`);
        return response.data;
    },
};