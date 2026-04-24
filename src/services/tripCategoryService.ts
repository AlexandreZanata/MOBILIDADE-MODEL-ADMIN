import apiClient from './apiClient';

export interface TripCategory {
    id: string;
    name: string;
    description: string;
    price_multiplier: number;
    active: boolean;
}

const tripCategoryService = {
    list: async (activeOnly?: boolean) => {
        return apiClient.get<TripCategory[]>('/admin/trip-categories', {
            active_only: activeOnly,
        });
    },

    create: async (data: Omit<TripCategory, 'id'>) => {
        return apiClient.post('/admin/trip-categories', data);
    },

    update: async (id: string, data: Partial<TripCategory>) => {
        return apiClient.put(`/admin/trip-categories/${id}`, data);
    },

    delete: async (id: string) => {
        return apiClient.delete(`/admin/trip-categories/${id}`);
    },
};

export default tripCategoryService;