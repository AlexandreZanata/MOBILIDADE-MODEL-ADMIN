import apiClient from './apiClient';

export interface User {
    id: string;
    name: string;
    email: string;
    type: string;
    active: boolean;
    created_at: string;
}

export interface ListUsersParams {
    cursor?: string;
    per_page?: number;
    search?: string;
    active?: boolean;
    type?: string;
    include_deleted?: boolean;
}

const userService = {
    list: async (params?: ListUsersParams) => {
        return apiClient.get('/users', params);
    },

    getById: async (id: string) => {
        return apiClient.get<User>(`/users/${id}`);
    },

    create: async (data: any) => {
        return apiClient.post('/users', data);
    },

    update: async (id: string, data: any) => {
        return apiClient.put(`/users/${id}`, data);
    },

    delete: async (id: string) => {
        return apiClient.delete(`/users/${id}`);
    },
};

export default userService;