import apiClient from './apiClient';

export interface DriverApplication {
    id: string;
    status: string;
    [key: string]: any;
}

export interface PaginationParams {
    cursor?: string;
    per_page?: number;
}

const driverApplicationService = {
    list: async (params?: PaginationParams) => {
        return apiClient.get('/drivers/applications', params);
    },

    approve: async (id: string) => {
        return apiClient.post(`/drivers/applications/${id}/approve`, {});
    },

    reject: async (id: string, reason: string) => {
        return apiClient.post(`/drivers/applications/${id}/reject`, { reason });
    },
};

export default driverApplicationService;