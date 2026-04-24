import apiClient from './apiClient';

const tripLifecycleService = {
    updateStatus: async (tripId: string, status: string, reason?: string) => {
        return apiClient.post(`/trips/${tripId}/status`, {
            status,
            reason,
        });
    },
};

export default tripLifecycleService;