import api from './api';
import { ServiceCategory, ServiceCategoryFormData } from '@/types/payment';

interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

export const serviceCategoryService = {
    list: async (params?: { cursor?: string; limit?: number; sort?: string; q?: string }) => {
        const response = await api.get<PaginatedResponse<ServiceCategory>>('/v1/admin/service-categories', {
            params: {
                limit: params?.limit ?? 20,
                sort: params?.sort ?? '-createdAt,name',
                cursor: params?.cursor,
                q: params?.q,
            },
        });
        return response.data;
    },

    get: async (id: string) => {
        const response = await api.get<ServiceCategory>(`/v1/admin/service-categories/${id}`);
        return response.data;
    },

    create: async (data: ServiceCategoryFormData) => {
        const response = await api.post<ServiceCategory>('/v1/admin/service-categories', data);
        return response.data;
    },

    update: async (id: string, data: Partial<ServiceCategoryFormData>) => {
        const response = await api.patch<ServiceCategory>(`/v1/admin/service-categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/v1/admin/service-categories/${id}`);
        return response.data;
    },
};

export default serviceCategoryService;
