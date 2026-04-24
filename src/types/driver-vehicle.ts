/**
 * ✅ DRIVER VEHICLE TYPES
 * Tipos para Veículos de Motoristas (aprovação/rejeição)
 */

export interface DriverVehicle {
    id: string;
    driverProfileId: string;
    serviceCategoryId?: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    // ✅ CORRIGIDO:  Adicionado status PENDING_DOCS
    status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'PENDING_DOCS';
    createdAt: string;
    updatedAt: string;
    rejectionReason?:  string;
    // Campos adicionais que podem vir na resposta detalhada
    chassis?:  string;
    driverId?:  string;
    driverName?:  string;
    driverEmail?:  string;
    driverPhone?:  string;
}

export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number | null;
}

export interface PaginationParams {
    cursor?: string | null;
    limit?: number;
    sort?: string;
    q?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DOCS';
}

export interface ApiErrorResponse {
    error: {
        message: string;
        code: string;
        fields?: Record<string, string>;
    };
}