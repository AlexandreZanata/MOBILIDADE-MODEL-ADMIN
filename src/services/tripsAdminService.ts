import api from './api';

export interface TripCoordinates {
    lat: number;
    lng: number;
}

export interface Trip {
    id: string;
    passenger_id: string;
    driver_id?: string;
    origin: TripCoordinates;
    destination: TripCoordinates;
    status: string;
    estimated_fare?: number;
    final_fare?: number;
    distance?: number;
    duration?: number;
    created_at: string;
    started_at?: string;
    completed_at?: string;
}

export interface TripResponse {
    success: boolean;
    message: string;
    data: any;
    trace_id: string;
}

export interface PaginationData {
    next_cursor?: string;
    previous_cursor?: string;
    per_page: number;
    has_more: boolean;
}

export interface TripsListResponse {
    success: boolean;
    message: string;
    data: {
        data: Trip[];
        pagination: PaginationData;
    };
    trace_id: string;
}

export const tripsAdminService = {
    // Listar todas as corridas com paginação
    listTrips: async (cursor?: string, perPage: number = 15): Promise<TripsListResponse> => {
        const params: any = { per_page: perPage };
        if (cursor) {
            params.cursor = cursor;
        }
        const response = await api.get('/trips', { params });
        return response.data;
    },

    // Obter detalhes de uma corrida específica
    getTripDetails: async (tripId: string): Promise<TripResponse> => {
        const response = await api. get(`/trips/${tripId}`);
        return response.data;
    },

    // Atualizar status da corrida
    updateTripStatus: async (
        tripId: string,
        status: string,
        reason?: string
    ): Promise<TripResponse> => {
        const payload: any = { status };
        if (reason) {
            payload.reason = reason;
        }
        const response = await api.post(`/trips/${tripId}/status`, payload);
        return response. data;
    },

    // Cancelar corrida
    cancelTrip: async (tripId: string, reason?: string): Promise<TripResponse> => {
        const payload: any = {};
        if (reason) {
            payload.reason = reason;
        }
        const response = await api.post(`/trips/${tripId}/cancel`, payload);
        return response.data;
    },
};

export default tripsAdminService;