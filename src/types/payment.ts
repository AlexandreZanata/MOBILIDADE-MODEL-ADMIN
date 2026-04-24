// Tipos para o módulo de pagamentos

export interface PaymentMethod {
    id: string;
    name: string;
    slug: string;
    description?: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentBrand {
    id: string;
    name: string;
    slug: string;
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TripCategory {
    id: string;
    name: string;
    description?: string;
    price_multiplier: number;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface TripPricing {
    id: string;
    minimum_fare: number;
    price_per_km: number;
    base_fee: number;
    surge_multiplier: number;
    created_at?: string;
    updated_at?: string;
}

export interface PaymentMethodFormData {
    name: string;
    slug: string;
    type: 'credit_card' | 'debit_card' | 'cash' | 'pix' | 'wallet';
    description?: string;
    requires_card_brand: boolean;
    active: boolean;
}

export interface PaymentBrandFormData {
    payment_method_id: string;
    name: string;
    slug: string;
    active: boolean;
}

export interface TripCategoryFormData {
    name: string;
    description?: string;
    price_multiplier: number;
    active: boolean;
}

export interface TripPricingFormData {
    minimum_fare: number;
    price_per_km: number;
    base_fee: number;
    surge_multiplier: number;
}

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    baseFare: number;
    perKmRate: number;
    minFare: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceCategoryFormData {
    name: string;
    slug: string;
    baseFare: number;
    perKmRate: number;
    minFare: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        next_cursor?: string;
        previous_cursor?: string;
        per_page: number;
        has_more: boolean;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    trace_id: string;
}