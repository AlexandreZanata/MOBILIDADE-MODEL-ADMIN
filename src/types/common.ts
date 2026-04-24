/**
 * Tipos comuns usados em todo o sistema
 */

export interface KPIs {
    totalRides: number;
    activeDeliveries: number;
    todayRevenue: number;
    acceptanceRate: number;
    ridesChange: number;
    deliveriesChange: number;
    revenueChange: number;
    acceptanceChange: number;
}

export interface SystemEvent {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    relatedId?: string;
}

export interface OrderCustomer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface OrderDriver {
    id: string;
    name: string;
    phone: string;
    photo?: string;
    rating?: number;
}

export interface OrderAddress {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customer: OrderCustomer;
    driver?: OrderDriver;
    status: 'pending' | 'ready' | 'in_transit' | 'delivered' | 'canceled';
    origin: OrderAddress;
    destination: OrderAddress;
    items: OrderItem[];
    totalAmount: number;
    deliveryFee: number;
    estimatedTime: number;
    createdAt: string;
    updatedAt: string;
}

export interface FinancialReport {
    period: string;
    totalRevenue: number;
    totalExpenses: number;
    netRevenue: number;
    ridesCount: number;
    deliveriesCount: number;
    averageTicket: number;
}

// Tipo para mocks de Ride (compatível com estrutura de mock)
export interface MockRide {
    id: string;
    rideNumber?: string;
    customer?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    driver?: any;
    status: string;
    origin: {
        street?: string;
        number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        latitude: number;
        longitude: number;
    };
    destination: {
        street?: string;
        number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        latitude: number;
        longitude: number;
    };
    distance?: number;
    duration?: number;
    fare?: number;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
}

