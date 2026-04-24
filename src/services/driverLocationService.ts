import apiClient from './apiClient';

export interface DriverLocation {
    id: string;
    driver_id: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    is_available: boolean;
    updated_at: string;
}

export interface UpdateLocationRequest {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    is_available: boolean;
}

const driverLocationService = {
    getLocation: async () => {
        return apiClient.get<DriverLocation>('/drivers/location');
    },

    updateLocation: async (data: UpdateLocationRequest) => {
        return apiClient.put<DriverLocation>('/drivers/location', data);
    },

    updateAvailability: async (isAvailable: boolean) => {
        return apiClient.post('/drivers/location/availability', {
            is_available: isAvailable,
        });
    },
};

export default driverLocationService;