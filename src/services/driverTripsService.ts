import apiClient from './apiClient';

export interface Trip {
    id: string;
    [key: string]: any;
}

const driverTripsService = {
    getActiveTrip: async () => {
        return apiClient.get<Trip>('/drivers/me/trips/active');
    },

    acceptTrip: async (tripId: string) => {
        return apiClient.post(`/drivers/me/trips/${tripId}/accept`, {});
    },
};

export default driverTripsService;