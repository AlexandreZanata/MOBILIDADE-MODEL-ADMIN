/**
 * ✅ RIDE TYPES
 * Tipos para Corridas (Admin e Passageiro)
 */

export type RideStatus =
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
    | 'EXPIRED';

export interface RideCoordinates {
    lat: number;
    lng: number;
}

export interface RidePassenger {
    id: string;
    name: string;
    rating: number;
}

export interface RideVehicle {
    licensePlate: string;
    brand: string;
    model: string;
    color: string;
}

export interface RideDriver {
    id: string;
    name: string;
    rating: number;
    vehicle: RideVehicle;
}

export interface Ride {
    id: string;
    passengerId: string;
    driverId?: string;
    serviceCategoryId?: string;
    paymentMethodId?: string;
    cardBrandId?: string;
    status: RideStatus;
    estimatedPrice?: number;
    finalPrice?: number;
    distanceKm?: number;
    durationMinutes?: number;
    surge?: number;
    requestedAt: string;
    createdAt: string;
    passenger: RidePassenger;
    driver?: RideDriver;
    origin: RideCoordinates;
    destination: RideCoordinates;
}

export interface PaginatedRideResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number | null;
}

export interface RidePaginationParams {
    cursor?: string | null;
    limit?: number;
    sort?: string;
    q?: string;
    status?: RideStatus;
}