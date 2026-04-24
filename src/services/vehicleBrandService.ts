import apiClient from './apiClient';

export interface VehicleBrand {
    id: string;
    name: string;
    active: boolean;
}

const vehicleBrandService = {
    list: async (activeOnly?: boolean) =>
        apiClient.get<VehicleBrand[]>('/admin/vehicle-brands', {
            active_only: activeOnly,
        }),

    getPublic: async () => apiClient.get<VehicleBrand[]>('/vehicles/brands'),

    create: async (data: { name: string; active: boolean }) =>
        apiClient.post<VehicleBrand>('/admin/vehicle-brands', data),

    update: async (id: string, data: { name: string; active: boolean }) =>
        apiClient.put<VehicleBrand>(`/admin/vehicle-brands/${id}`, data),

    delete: async (id: string) =>
        apiClient.delete<void>(`/admin/vehicle-brands/${id}`),
};

export default vehicleBrandService;