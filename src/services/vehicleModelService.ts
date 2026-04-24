import apiClient from './apiClient';

export interface VehicleModel {
    id: string;
    brand_id: string;
    name: string;
    type: string;
    active: boolean;
}

const vehicleModelService = {
    list: async (brandId: string, activeOnly?: boolean) => {
        return apiClient.get<VehicleModel[]>('/admin/vehicle-models', {
            brand_id: brandId,
            active_only: activeOnly,
        });
    },

    getPublic: async (brandId: string) => {
        return apiClient.get<VehicleModel[]>('/vehicles/models', {
            brand_id: brandId,
        });
    },

    create: async (data: { brand_id: string; name: string; type: string; active: boolean }) => {
        return apiClient.post('/admin/vehicle-models', data);
    },

    update: async (id: string, data: { name: string; type: string; active: boolean }) => {
        return apiClient.put(`/admin/vehicle-models/${id}`, data);
    },

    delete: async (id: string) => {
        return apiClient.delete(`/admin/vehicle-models/${id}`);
    },
};

export default vehicleModelService;