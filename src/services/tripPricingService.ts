import apiClient from './apiClient';

export interface TripPricing {
    minimum_fare: number;
    price_per_km: number;
    base_fee: number;
    surge_multiplier: number;
}

const tripPricingService = {
    get: async () => {
        return apiClient.get<TripPricing>('/admin/trip-pricing');
    },

    update: async (data: TripPricing) => {
        return apiClient.put('/admin/trip-pricing', data);
    },
};

export default tripPricingService;