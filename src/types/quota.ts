/**
 * ✅ QUOTA STATISTICS TYPES
 * Tipos para Estatísticas de Uso da API (Google Maps Platform)
 */

export interface QuotaStatistics {
    date: string;
    currentCost: number;
    dailyBudget: number;
    budgetUsedPercent: number;
    totalRequests: number;
    totalCacheHits: number;
    cacheHitRatePercent: number;
    autocompleteRequests: number;
    geocodingRequests: number;
    reverseGeocodingRequests: number;
    placeDetailsRequests: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message:  string;
    data:  T;
    trace_id:  string;
}

export interface ApiErrorResponse {
    error: {
        message: string;
        code: string;
        fields?: Record<string, string>;
    };
}