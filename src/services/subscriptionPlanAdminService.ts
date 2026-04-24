import apiClient from './apiClient';

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    amount: number;
    active: boolean;
}

const subscriptionPlanAdminService = {
    list: async () => {
        return apiClient.get<SubscriptionPlan[]>('/admin/subscription-plans');
    },

    create: async (data: any) => {
        return apiClient.post('/admin/subscription-plans', data);
    },

    activate: async (id: string) => {
        return apiClient.post(`/admin/subscription-plans/${id}/activate`, {});
    },

    deactivate: async (id: string) => {
        return apiClient.post(`/admin/subscription-plans/${id}/deactivate`, {});
    },
};

export default subscriptionPlanAdminService;