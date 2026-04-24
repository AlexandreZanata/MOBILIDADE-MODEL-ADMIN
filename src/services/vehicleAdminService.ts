import apiClient from './apiClient';

const vehicleAdminService = {
    listPending: async () => {
        return apiClient.get('/admin/vehicles/pending');
    },

    approve: async (id: string) => {
        return apiClient.post(`/admin/vehicles/${id}/approve`, {});
    },

    reject: async (id: string, reason: string) => {
        return apiClient.post(`/admin/vehicles/${id}/reject`, { reason });
    },
};

export default vehicleAdminService;