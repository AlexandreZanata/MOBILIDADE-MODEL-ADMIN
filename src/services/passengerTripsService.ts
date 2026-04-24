import apiClient from './apiClient';

export interface TripEstimate {
    distance: number;
    duration: number;
    fare: number;
    currency: string;
}

export interface Trip {
    id: string;
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    status: string;
    fare: number;
}

const passengerTripsService = {
    estimate: async (data: {
        origin: { lat: number; lng: number };
        destination: { lat: number; lng: number };
        trip_category_id: string;
        surge_multiplier?: number;
    }) => {
        return apiClient.post<TripEstimate>('/trips/estimate', data);
    },

    request: async (data: {
        origin: { lat: number; lng: number };
        destination: { lat: number; lng: number };
        trip_category_id: string;
        payment_method_id: string;
        payment_brand_id?: string;
        surge_multiplier?: number;
    }) => {
        return apiClient.post<Trip>('/trips', data);
    },

    getById: async (tripId: string) => {
        return apiClient.get<Trip>(`/trips/${tripId}`);
    },

    cancel: async (tripId: string, reason: string) => {
        return apiClient.post(`/trips/${tripId}/cancel`, { reason });
    },

    rate: async (tripId: string, rating: number, comment?: string) => {
        return apiClient.post(`/trips/${tripId}/rating`, {
            rating,
            comment,
        });
    },
};

export default passengerTripsService;