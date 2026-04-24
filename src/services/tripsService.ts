// src/services/tripsService.ts
import api from './api';

export interface TripCoordinates {
    lat: number;
    lng: number;
}

export interface TripEstimatePayload {
    origin: TripCoordinates;
    destination: TripCoordinates;
    trip_category_id: string;
    surge_multiplier?: number;
}

export interface TripCreatePayload extends TripEstimatePayload {
    payment_method_id: string;
    payment_brand_id: string;
}

export interface TripResponse {
    success: boolean;
    message: string;
    data: any;
    trace_id: string;
}

export type TripStatus =
    | 'REQUESTED'
    | 'DRIVER_ASSIGNED'
    | 'DRIVER_ARRIVING'
    | 'DRIVER_ARRIVED'
    | 'IN_PROGRESS'
    | 'WAITING_AT_DESTINATION'
    | 'COMPLETED'
    | 'CANCELED_BY_RIDER'
    | 'CANCELED_BY_DRIVER'
    | 'NO_SHOW'
    | 'EXPIRED'
    | 'CANCELADA_MOTORISTA'
    | 'CANCELADA_PASSAGEIRO';

export interface Trip {
    id: string;
    passengerId: string;
    driverId?: string;
    serviceCategoryId?: string;
    paymentMethodId?: string;
    cardBrandId?: string;
    origin: TripCoordinates;
    destination: TripCoordinates;
    status: TripStatus;
    estimatedPrice?: number;
    finalPrice?: number;
    distanceKm?: number;
    durationMinutes?: number;
    surge?: number;
    requestedAt: string;
    createdAt: string;
    passenger: {
        id: string;
        name: string;
        rating: number;
    };
    driver?: {
        id: string;
        name: string;
        rating: number;
        vehicle: {
            licensePlate: string;
            brand: string;
            model: string;
            color: string;
        };
    };
}

export interface AdminTripsListParams {
    cursor?: string;
    limit?: number;
    sort?: string;
    q?: string;
    status?: TripStatus;
}

export interface AdminTripsResponse {
    items: Trip[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number | null;
}

export interface AdminTripsResponseWrapper {
    success: boolean;
    message?: string;
    data: AdminTripsResponse;
}

/**
 * ✅ Response da API ao cancelar corrida
 * POST /v1/admin/rides/{rideId}/cancel
 *
 * Resposta conforme spec:
 * {
 *   "rideId": "018f1234-5678-9abc-def0-123456789abc",
 *   "status": "CANCELADA_MOTORISTA",
 *   "cancellationReason": "Cancelamento administrativo",
 *   "cancelledBy": "018f1234-5678-9abc-def0-123456789def",
 *   "cancelledAt": "2025-12-01T08:15:00Z",
 *   "cancellationFee": 0,
 *   "penaltyApplied": false,
 *   "message": "Corrida cancelada pelo administrador com sucesso."
 * }
 */
export interface CancelRideResponse {
    rideId: string;
    status: TripStatus;
    cancellationReason: string;
    cancelledBy: string;
    cancelledAt: string;
    cancellationFee: number;
    penaltyApplied: boolean;
    message: string;
}

export interface CancelRideResponseWrapper {
    success: boolean;
    message?: string;
    data: CancelRideResponse;
}

/**
 * ✅ Response da API ao atualizar status
 * PATCH /v1/admin/rides/{rideId}/status
 *
 * Resposta conforme spec com toda a corrida
 */
export interface UpdateRideStatusResponse {
    id: string;
    passengerId: string;
    driverId?: string;
    status: TripStatus;
    estimatedPrice?: number;
    finalPrice?: number;
    distanceKm?: number;
    durationMinutes?: number;
    surge?: number;
    requestedAt: string;
    createdAt: string;
    passenger: {
        id: string;
        name: string;
        rating: number;
    };
    driver?: {
        id: string;
        name: string;
        rating: number;
        vehicle: {
            licensePlate: string;
            brand: string;
            model: string;
            color: string;
        };
    };
}

export interface UpdateRideStatusResponseWrapper {
    success: boolean;
    message?: string;
    data: UpdateRideStatusResponse;
}

export const tripsService = {
    // Calcular estimativa de preço
    estimateTrip: async (payload: TripEstimatePayload): Promise<TripResponse> => {
        const response = await api.post('/trips/estimate', payload);
        return response.data;
    },

    // Criar nova corrida
    createTrip: async (payload: TripCreatePayload): Promise<TripResponse> => {
        const response = await api.post('/trips', payload);
        return response.data;
    },

    // Obter detalhes de uma corrida
    getTripDetails: async (tripId: string): Promise<TripResponse> => {
        const response = await api.get(`/trips/${tripId}`);
        return response.data;
    },

    // Cancelar corrida (passageiro)
    cancelTrip: async (tripId: string, reason: string): Promise<TripResponse> => {
        const response = await api.post(`/trips/${tripId}/cancel`, { reason });
        return response.data;
    },

    // Avaliar motorista após corrida
    rateTrip: async (tripId: string, rating: number, comment?: string): Promise<TripResponse> => {
        const response = await api.post(`/trips/${tripId}/rating`, { rating, comment });
        return response.data;
    },

    // Atualizar status da corrida
    updateTripStatus: async (
        tripId: string,
        status: TripStatus,
        reason?: string
    ): Promise<TripResponse> => {
        const response = await api.post(`/trips/${tripId}/status`, { status, reason });
        return response.data;
    },

    // Listar categorias com estimativa de preço
    getTripCategoriesWithEstimate: async (
        payload: TripEstimatePayload
    ): Promise<TripResponse> => {
        const response = await api. post('/trips/categories/estimate', payload);
        return response.data;
    },

    // Obter corrida ativa do motorista
    getActiveTrip: async (): Promise<TripResponse> => {
        const response = await api.get('/drivers/me/trips/active');
        return response.data;
    },

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * ✅ Listar todas as corridas com paginação cursor, filtros e busca
     * GET /v1/admin/rides
     *
     * Parâmetros:
     * - cursor: string (para paginação cursor)
     * - limit: number (1-100, default: 20)
     * - sort: string (ex: -requestedAt,status)
     * - q: string (busca textual: ID, nome passageiro/motorista, status)
     * - status: TripStatus (filtro por status)
     */
    getAdminTrips: async (params?: AdminTripsListParams): Promise<AdminTripsResponseWrapper> => {
        try {
            const queryParams: Record<string, any> = {};

            if (params?.cursor) queryParams.cursor = params.cursor;
            if (params?.limit) queryParams.limit = params.limit;
            if (params?.sort) queryParams.sort = params. sort;
            if (params?. q) queryParams.q = params.q;
            if (params?.status) queryParams.status = params.status;

            console.log('📋 Buscando corridas com parâmetros:', queryParams);

            const response = await api. get<AdminTripsResponse>('/v1/admin/rides', { params: queryParams });

            console.log('✅ Resposta de corridas:', response.data);

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao listar corridas:', error. response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.error?. message || 'Erro ao listar corridas',
                data: {
                    items: [],
                    nextCursor: null,
                    prevCursor: null,
                    hasMore: false,
                    totalCount: 0,
                },
            };
        }
    },

    // Obter detalhes de uma corrida (admin)
    getAdminTripDetails: async (tripId: string): Promise<TripResponse> => {
        const response = await api.get(`/v1/admin/rides/${tripId}`);
        return response.data;
    },

    /**
     * ✅ Atualizar status de uma corrida (admin)
     * PATCH /v1/admin/rides/{rideId}/status
     *
     * Request:
     * {
     *   "status": "CANCELADA_PASSAGEIRO"
     * }
     *
     * Response: UpdateRideStatusResponse com toda a corrida atualizada
     */
    updateAdminTripStatus: async (
        tripId: string,
        status: TripStatus
    ): Promise<UpdateRideStatusResponseWrapper> => {
        try {
            console.log(`📨 Atualizando status da corrida ${tripId} para ${status}`);

            const response = await api.patch<UpdateRideStatusResponse>(
                `/v1/admin/rides/${tripId}/status`,
                { status }
            );

            console.log('✅ Status atualizado com sucesso:', response.data);

            return {
                success: true,
                message: 'Status atualizado com sucesso',
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao atualizar status:', error.response?.data || error.message);

            const errorMessage = error.response?.data?.error?.message
                || error.response?.data?.message
                || error.message
                || 'Erro ao atualizar status';

            return {
                success: false,
                message: errorMessage,
                data: null as any,
            };
        }
    },

    /**
     * ✅ Cancelar corrida (admin)
     * POST /v1/admin/rides/{rideId}/cancel
     *
     * Request:
     * {
     *   "reason": "Mudança de planos"
     * }
     *
     * Response:
     * {
     *   "rideId": "018f1234-5678-9abc-def0-123456789abc",
     *   "status": "CANCELADA_MOTORISTA",
     *   "cancellationReason": "Cancelamento administrativo",
     *   "cancelledBy": "018f1234-5678-9abc-def0-123456789def",
     *   "cancelledAt": "2025-12-01T08:15:00Z",
     *   "cancellationFee": 0,
     *   "penaltyApplied": false,
     *   "message": "Corrida cancelada pelo administrador com sucesso."
     * }
     */
    cancelAdminTrip: async (tripId: string, reason: string): Promise<CancelRideResponseWrapper> => {
        try {
            console.log(`📨 Cancelando corrida ${tripId} com motivo: "${reason}"`);

            const response = await api.post<CancelRideResponse>(
                `/v1/admin/rides/${tripId}/cancel`,
                { reason }
            );

            console.log('✅ Corrida cancelada com sucesso:', response.data);

            return {
                success: true,
                message: response.data.message || 'Corrida cancelada com sucesso',
                data: response.data,
            };
        } catch (error: any) {
            console.error('❌ Erro ao cancelar corrida:', error);

            const errorMessage = error.response?.data?.error?.message
                || error.response?. data?.message
                || error.message
                || 'Erro ao cancelar corrida';

            return {
                success: false,
                message: errorMessage,
                data: {
                    rideId: tripId,
                    status: 'UNKNOWN' as TripStatus,
                    cancellationReason: '',
                    cancelledBy: '',
                    cancelledAt: '',
                    cancellationFee: 0,
                    penaltyApplied: false,
                    message: errorMessage,
                },
            };
        }
    },
};