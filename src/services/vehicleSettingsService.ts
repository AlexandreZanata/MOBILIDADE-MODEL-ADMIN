import apiClient from './apiClient';

export interface VehicleSettings {
    minimum_year: number;
}

const vehicleSettingsService = {
    list: async () => {
        return apiClient.get<VehicleSettings>('/admin/vehicle-settings');
    },

    updateMinimumYear: async (year: number) => {
        return apiClient.put('/admin/vehicle-settings/minimum-year', { year });
    },
};

export default vehicleSettingsService;