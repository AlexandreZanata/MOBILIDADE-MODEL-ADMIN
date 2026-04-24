/**
 * ✅ DRIVER DOCUMENT TYPES
 * Tipos para Documentos de Motoristas (CNH, CRLV)
 */

export interface DriverDocument {
    id: string;
    driverId: string;
    vehicleId?: string;
    documentType: 'CNH' | 'CRLV';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt?: string;
    rejectionReason?: string;
    downloadUrl?: string;
    driverName?: string;
    driverEmail?: string;
    driverCpf?: string;
    driverPhone?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    totalCount: number;
}

export interface PaginationParams {
    cursor?: string | null;
    limit?: number;
    sort?: string;
    q?: string;
}