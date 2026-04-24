export interface DriverUser {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string;
    type: string;
    [key: string]: any;
}

export interface DriverApplication {
    id: string;
    user_id: string;
    user?: DriverUser;
    status: 'pending' | 'approved' | 'rejected';
    cpf: string;
    cnh_number: string;
    cnh_category?: string;
    cnh_expires_at?: string;
    cnh_photo_path?: string;
    face_photo_path?: string;
    created_at: string;
    updated_at?: string;
    approved_at?: string;
    rejected_at?: string;
    rejection_reason?: string;
    [key: string]: any;
}

export interface Driver {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone?: string;
    cpf: string;
    cnh_number: string;
    cnh_category?: string;
    cnh_expires_at?: string;
    status: 'pending' | 'approved' | 'rejected' | 'active';
    created_at: string;
    updated_at?: string;
}

export interface Vehicle {
    id: string;
    driver_id?: string;
    brand?: { id: string; name: string };
    model?: { id: string; name: string };
    plate: string;
    chassis: string;
    color: string;
    year: number;
    status?: 'pending' | 'approved' | 'rejected';
    created_at?: string;
    [key: string]: any;
}

export interface VehicleBrand {
    id: string;
    name: string;
    active: boolean;
}

export interface VehicleModel {
    id: string;
    brand_id: string;
    name: string;
    type: string;
    active: boolean;
}

export interface VehicleSettings {
    minimum_year: number;
    [key: string]: any;
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