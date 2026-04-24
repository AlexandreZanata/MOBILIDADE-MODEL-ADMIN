import apiClient from './apiClient';

export interface Subscription {
    id: string;
    [key: string]: any;
}

const subscriptionAdminService = {
    list: async () => {
        return apiClient.get<Subscription[]>('/admin/subscriptions');
    },

    getById: async (id: string) => {
        return apiClient.get<Subscription>(`/admin/subscriptions/${id}`);
    },

    update: async (id: string, data: any) => {
        return apiClient.put(`/admin/subscriptions/${id}`, data);
    },

    cancel: async (id: string) => {
        return apiClient.post(`/admin/subscriptions/${id}/cancel`, {});
    },

    suspend: async (id: string) => {
        return apiClient.post(`/admin/subscriptions/${id}/suspend`, {});
    },

    reactivate: async (id: string) => {
        return apiClient.post(`/admin/subscriptions/${id}/reactivate`, {});
    },

    configureTrial: async (id: string) => {
        return apiClient.post(`/admin/subscriptions/${id}/configure-trial`, {});
    },

    configureGracePeriod: async (id: string) => {
        return apiClient.post(`/admin/subscriptions/${id}/configure-grace-period`, {});
    },
};

export default subscriptionAdminService;