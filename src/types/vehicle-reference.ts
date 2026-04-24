/**
 * ✅ VEHICLE REFERENCE TYPES
 * Tipos para Marcas, Modelos e Configurações de Veículos
 */

export interface VehicleBrand {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleModel {
    id: string;
    brandId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleMinYear {
    id: string;
    minYear: number;
    createdAt: string;
    updatedAt: string;
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

export interface ApiErrorResponse {
    error: {
        message: string;
        code: string;
        fields?: Record<string, string>;
    };
}