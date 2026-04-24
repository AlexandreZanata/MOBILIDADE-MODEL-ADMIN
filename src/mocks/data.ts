/**
 * Dados mockados para visualização
 * Em produção, substituir por chamadas reais à API
 */

import { KPIs, SystemEvent, FinancialReport, Order as OrderType, OrderDriver } from '@/types';
import { MockRide } from '@/types/common';
import dayjs from 'dayjs';

// Tipo específico para mocks de Driver (com campos adicionais para visualização)
interface MockDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  rating?: number;
  totalRides?: number;
  status: 'online' | 'busy' | 'offline' | 'unavailable' | 'pending' | 'approved' | 'rejected' | 'active';
  vehicle?: {
    id: string;
    type: string;
    brand: string;
    model: string;
    year: number;
    plate: string;
    color: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  createdAt: string;
  lastActiveAt?: string;
  [key: string]: any;
}

// Tipo específico para mocks de Order (com status adicionais)
interface MockOrder extends Omit<OrderType, 'status' | 'driver'> {
  status: 'pending' | 'ready' | 'in_transit' | 'delivered' | 'canceled' | 'accepted' | 'picked_up' | 'preparing' | 'cancelled';
  driver?: OrderDriver | {
    id: string;
    name: string;
    phone: string;
    photo?: string;
    rating?: number;
  };
}

// KPIs mockados
export const mockKPIs: KPIs = {
  totalRides: 1250,
  activeDeliveries: 45,
  todayRevenue: 12500.50,
  acceptanceRate: 87.5,
  ridesChange: 12.5,
  deliveriesChange: -5.2,
  revenueChange: 8.3,
  acceptanceChange: 2.1,
};

// Motoristas mockados
export const mockDrivers: MockDriver[] = [
  {
    id: 'driver-1',
    name: 'Maria Santos',
    email: 'maria.santos@vamu.com',
    phone: '11987654321',
    photo: 'https://i.pravatar.cc/150?img=1',
    rating: 4.8,
    totalRides: 342,
    status: 'online',
    vehicle: {
      id: 'vehicle-1',
      type: 'car',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      plate: 'ABC-1234',
      color: 'Branco',
    },
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2023-01-15T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'driver-2',
    name: 'João Silva',
    email: 'joao.silva@vamu.com',
    phone: '11976543210',
    photo: 'https://i.pravatar.cc/150?img=2',
    rating: 4.9,
    totalRides: 521,
    status: 'busy',
    vehicle: {
      id: 'vehicle-2',
      type: 'motorcycle',
      brand: 'Honda',
      model: 'CG 160',
      year: 2023,
      plate: 'XYZ-5678',
      color: 'Vermelho',
    },
    location: {
      latitude: -23.5515,
      longitude: -46.6343,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2022-11-20T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'driver-3',
    name: 'Ana Costa',
    email: 'ana.costa@vamu.com',
    phone: '11965432109',
    photo: 'https://i.pravatar.cc/150?img=3',
    rating: 4.7,
    totalRides: 289,
    status: 'online',
    vehicle: {
      id: 'vehicle-3',
      type: 'bicycle',
      brand: 'Caloi',
      model: 'Elite',
      year: 2023,
      plate: 'BIKE-001',
      color: 'Azul',
    },
    location: {
      latitude: -23.5525,
      longitude: -46.6353,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2023-03-10T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'driver-4',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@vamu.com',
    phone: '11954321098',
    photo: 'https://i.pravatar.cc/150?img=4',
    rating: 4.6,
    totalRides: 198,
    status: 'offline',
    vehicle: {
      id: 'vehicle-4',
      type: 'car',
      brand: 'Fiat',
      model: 'Uno',
      year: 2021,
      plate: 'DEF-9012',
      color: 'Prata',
    },
    createdAt: '2023-05-20T10:00:00Z',
    lastActiveAt: dayjs().subtract(2, 'hours').toISOString(),
  },
  {
    id: 'driver-5',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@vamu.com',
    phone: '11943210987',
    photo: 'https://i.pravatar.cc/150?img=5',
    rating: 4.9,
    totalRides: 456,
    status: 'online',
    vehicle: {
      id: 'vehicle-5',
      type: 'motorcycle',
      brand: 'Yamaha',
      model: 'Fazer 250',
      year: 2022,
      plate: 'GHI-3456',
      color: 'Preto',
    },
    location: {
      latitude: -23.5535,
      longitude: -46.6363,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2022-09-15T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'driver-6',
    name: 'Roberto Alves',
    email: 'roberto.alves@vamu.com',
    phone: '11932109876',
    photo: 'https://i.pravatar.cc/150?img=6',
    rating: 4.5,
    totalRides: 167,
    status: 'unavailable',
    vehicle: {
      id: 'vehicle-6',
      type: 'car',
      brand: 'Volkswagen',
      model: 'Gol',
      year: 2020,
      plate: 'JKL-7890',
      color: 'Branco',
    },
    createdAt: '2023-07-01T10:00:00Z',
    lastActiveAt: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'driver-7',
    name: 'Juliana Ferreira',
    email: 'juliana.ferreira@vamu.com',
    phone: '11921098765',
    photo: 'https://i.pravatar.cc/150?img=7',
    rating: 4.8,
    totalRides: 398,
    status: 'busy',
    vehicle: {
      id: 'vehicle-7',
      type: 'motorcycle',
      brand: 'Honda',
      model: 'PCX 160',
      year: 2023,
      plate: 'MNO-2345',
      color: 'Branco',
    },
    location: {
      latitude: -23.5545,
      longitude: -46.6373,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2022-12-05T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: 'driver-8',
    name: 'Pedro Martins',
    email: 'pedro.martins@vamu.com',
    phone: '11910987654',
    photo: 'https://i.pravatar.cc/150?img=8',
    rating: 4.7,
    totalRides: 312,
    status: 'online',
    vehicle: {
      id: 'vehicle-8',
      type: 'bicycle',
      brand: 'Oggi',
      model: 'Vibe',
      year: 2023,
      plate: 'BIKE-002',
      color: 'Verde',
    },
    location: {
      latitude: -23.5555,
      longitude: -46.6383,
      timestamp: new Date().toISOString(),
    },
    createdAt: '2023-02-18T10:00:00Z',
    lastActiveAt: new Date().toISOString(),
  },
];

// Pedidos/Entregas mockados
export const mockOrders: MockOrder[] = [
  {
    id: 'order-1',
    orderNumber: 'PED-001234',
    customer: {
      id: 'cust-1',
      name: 'Paulo Souza',
      email: 'paulo@email.com',
      phone: '11999887766',
    },
    driver: mockDrivers[0],
    status: 'in_transit',
    origin: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310100',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    destination: {
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 45',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310100',
      latitude: -23.5615,
      longitude: -46.6563,
    },
    items: [
      { id: 'item-1', name: 'Pizza Margherita', quantity: 2, price: 45.00 },
      { id: 'item-2', name: 'Coca-Cola 2L', quantity: 1, price: 8.50 },
    ],
    totalAmount: 98.50,
    deliveryFee: 5.00,
    estimatedTime: 25,
    createdAt: dayjs().subtract(30, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(5, 'minutes').toISOString(),
  },
  {
    id: 'order-2',
    orderNumber: 'PED-001235',
    customer: {
      id: 'cust-2',
      name: 'Mariana Costa',
      email: 'mariana@email.com',
      phone: '11988776655',
    },
    driver: mockDrivers[1],
    status: 'ready',
    origin: {
      street: 'Rua Augusta',
      number: '500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305000',
      latitude: -23.5515,
      longitude: -46.6343,
    },
    destination: {
      street: 'Rua Haddock Lobo',
      number: '200',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01414000',
      latitude: -23.5625,
      longitude: -46.6573,
    },
    items: [
      { id: 'item-3', name: 'Hambúrguer Artesanal', quantity: 1, price: 32.00 },
      { id: 'item-4', name: 'Batata Frita', quantity: 1, price: 15.00 },
    ],
    totalAmount: 47.00,
    deliveryFee: 4.50,
    estimatedTime: 20,
    createdAt: dayjs().subtract(15, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(2, 'minutes').toISOString(),
  },
  {
    id: 'order-3',
    orderNumber: 'PED-001236',
    customer: {
      id: 'cust-3',
      name: 'Ricardo Almeida',
      email: 'ricardo@email.com',
      phone: '11977665544',
    },
    status: 'pending',
    origin: {
      street: 'Rua Oscar Freire',
      number: '800',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426000',
      latitude: -23.5525,
      longitude: -46.6353,
    },
    destination: {
      street: 'Alameda Santos',
      number: '1500',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01418000',
      latitude: -23.5635,
      longitude: -46.6583,
    },
    items: [
      { id: 'item-5', name: 'Sushi Combo', quantity: 1, price: 85.00 },
    ],
    totalAmount: 85.00,
    deliveryFee: 6.00,
    estimatedTime: 30,
    createdAt: dayjs().subtract(5, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(5, 'minutes').toISOString(),
  },
  {
    id: 'order-4',
    orderNumber: 'PED-001237',
    customer: {
      id: 'cust-4',
      name: 'Luciana Santos',
      email: 'luciana@email.com',
      phone: '11966554433',
    },
    driver: mockDrivers[2],
    status: 'delivered',
    origin: {
      street: 'Rua Bela Cintra',
      number: '300',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01315000',
      latitude: -23.5535,
      longitude: -46.6363,
    },
    destination: {
      street: 'Rua da Consolação',
      number: '2500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01302000',
      latitude: -23.5645,
      longitude: -46.6593,
    },
    items: [
      { id: 'item-6', name: 'Açaí 500ml', quantity: 2, price: 18.00 },
    ],
    totalAmount: 36.00,
    deliveryFee: 3.50,
    estimatedTime: 15,
    createdAt: dayjs().subtract(45, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(20, 'minutes').toISOString(),
  },
  {
    id: 'order-5',
    orderNumber: 'PED-001238',
    customer: {
      id: 'cust-5',
      name: 'Felipe Rodrigues',
      email: 'felipe@email.com',
      phone: '11955443322',
    },
    status: 'accepted',
    origin: {
      street: 'Avenida Rebouças',
      number: '1000',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05402000',
      latitude: -23.5545,
      longitude: -46.6373,
    },
    destination: {
      street: 'Rua dos Pinheiros',
      number: '500',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05422000',
      latitude: -23.5655,
      longitude: -46.6603,
    },
    items: [
      { id: 'item-7', name: 'Pad Thai', quantity: 1, price: 42.00 },
      { id: 'item-8', name: 'Água 500ml', quantity: 2, price: 4.00 },
    ],
    totalAmount: 50.00,
    deliveryFee: 5.00,
    estimatedTime: 22,
    createdAt: dayjs().subtract(10, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(8, 'minutes').toISOString(),
  },
  {
    id: 'order-6',
    orderNumber: 'PED-001239',
    customer: {
      id: 'cust-6',
      name: 'Camila Oliveira',
      email: 'camila@email.com',
      phone: '11944332211',
    },
    driver: mockDrivers[4],
    status: 'picked_up',
    origin: {
      street: 'Rua dos Três Irmãos',
      number: '200',
      neighborhood: 'Vila Progredior',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05615000',
      latitude: -23.5555,
      longitude: -46.6383,
    },
    destination: {
      street: 'Rua Butantã',
      number: '800',
      neighborhood: 'Butantã',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05503000',
      latitude: -23.5665,
      longitude: -46.6613,
    },
    items: [
      { id: 'item-9', name: 'Comida Japonesa', quantity: 1, price: 95.00 },
    ],
    totalAmount: 95.00,
    deliveryFee: 7.00,
    estimatedTime: 28,
    createdAt: dayjs().subtract(20, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(3, 'minutes').toISOString(),
  },
  {
    id: 'order-7',
    orderNumber: 'PED-001240',
    customer: {
      id: 'cust-7',
      name: 'André Lima',
      email: 'andre@email.com',
      phone: '11933221100',
    },
    status: 'preparing',
    origin: {
      street: 'Rua Fradique Coutinho',
      number: '400',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05416000',
      latitude: -23.5565,
      longitude: -46.6393,
    },
    destination: {
      street: 'Rua Harmonia',
      number: '600',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05435000',
      latitude: -23.5675,
      longitude: -46.6623,
    },
    items: [
      { id: 'item-10', name: 'Pizza Calabresa', quantity: 1, price: 48.00 },
      { id: 'item-11', name: 'Refrigerante', quantity: 2, price: 6.00 },
    ],
    totalAmount: 60.00,
    deliveryFee: 5.50,
    estimatedTime: 25,
    createdAt: dayjs().subtract(12, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(10, 'minutes').toISOString(),
  },
  {
    id: 'order-8',
    orderNumber: 'PED-001241',
    customer: {
      id: 'cust-8',
      name: 'Patricia Ferreira',
      email: 'patricia@email.com',
      phone: '11922110099',
    },
    driver: mockDrivers[6],
    status: 'canceled',
    origin: {
      street: 'Rua Teodoro Sampaio',
      number: '1000',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05406000',
      latitude: -23.5575,
      longitude: -46.6403,
    },
    destination: {
      street: 'Rua Cardeal Arcoverde',
      number: '500',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05407000',
      latitude: -23.5685,
      longitude: -46.6633,
    },
    items: [
      { id: 'item-12', name: 'Lanche Vegano', quantity: 1, price: 35.00 },
    ],
    totalAmount: 35.00,
    deliveryFee: 4.00,
    estimatedTime: 18,
    createdAt: dayjs().subtract(60, 'minutes').toISOString(),
    updatedAt: dayjs().subtract(55, 'minutes').toISOString(),
  },
];

// Corridas mockadas
export const mockRides: MockRide[] = [
  {
    id: 'ride-1',
    rideNumber: 'RIDE-001234',
    customer: {
      id: 'cust-1',
      name: 'Paulo Souza',
      email: 'paulo@email.com',
      phone: '11999887766',
    },
    driver: mockDrivers[0],
    status: 'in_progress',
    origin: {
      street: 'Avenida Brigadeiro Faria Lima',
      number: '2000',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01452000',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    destination: {
      street: 'Avenida Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310100',
      latitude: -23.5615,
      longitude: -46.6563,
    },
    distance: 5.2,
    duration: 15,
    fare: 25.50,
    createdAt: dayjs().subtract(20, 'minutes').toISOString(),
    startedAt: dayjs().subtract(15, 'minutes').toISOString(),
  },
  {
    id: 'ride-2',
    rideNumber: 'RIDE-001235',
    customer: {
      id: 'cust-2',
      name: 'Mariana Costa',
      email: 'mariana@email.com',
      phone: '11988776655',
    },
    driver: mockDrivers[1],
    status: 'completed',
    origin: {
      street: 'Rua Augusta',
      number: '500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305000',
      latitude: -23.5515,
      longitude: -46.6343,
    },
    destination: {
      street: 'Rua Haddock Lobo',
      number: '200',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01414000',
      latitude: -23.5625,
      longitude: -46.6573,
    },
    distance: 3.8,
    duration: 12,
    fare: 18.00,
    createdAt: dayjs().subtract(45, 'minutes').toISOString(),
    startedAt: dayjs().subtract(40, 'minutes').toISOString(),
    completedAt: dayjs().subtract(30, 'minutes').toISOString(),
  },
  {
    id: 'ride-3',
    rideNumber: 'RIDE-001236',
    customer: {
      id: 'cust-3',
      name: 'Ricardo Almeida',
      email: 'ricardo@email.com',
      phone: '11977665544',
    },
    driver: mockDrivers[2],
    status: 'requested',
    origin: {
      street: 'Rua Oscar Freire',
      number: '800',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01426000',
      latitude: -23.5525,
      longitude: -46.6353,
    },
    destination: {
      street: 'Alameda Santos',
      number: '1500',
      neighborhood: 'Jardim Paulista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01418000',
      latitude: -23.5635,
      longitude: -46.6583,
    },
    distance: 2.5,
    duration: 8,
    fare: 15.00,
    createdAt: dayjs().subtract(5, 'minutes').toISOString(),
  },
];

// Eventos do sistema mockados
export const mockEvents: SystemEvent[] = [
  {
    id: 'event-1',
    type: 'ride_started',
    title: 'Corrida Iniciada',
    description: 'Corrida RIDE-001234 foi iniciada por Maria Santos',
    timestamp: dayjs().subtract(15, 'minutes').toISOString(),
    severity: 'info',
    relatedId: 'ride-1',
  },
  {
    id: 'event-2',
    type: 'delivery_completed',
    title: 'Entrega Concluída',
    description: 'Pedido PED-001237 foi entregue com sucesso',
    timestamp: dayjs().subtract(20, 'minutes').toISOString(),
    severity: 'success',
    relatedId: 'order-4',
  },
  {
    id: 'event-3',
    type: 'alert',
    title: 'Alerta de Tempo',
    description: 'Pedido PED-001234 está próximo do tempo limite de entrega',
    timestamp: dayjs().subtract(25, 'minutes').toISOString(),
    severity: 'warning',
    relatedId: 'order-1',
  },
  {
    id: 'event-4',
    type: 'ride_completed',
    title: 'Corrida Finalizada',
    description: 'Corrida RIDE-001235 foi finalizada',
    timestamp: dayjs().subtract(30, 'minutes').toISOString(),
    severity: 'success',
    relatedId: 'ride-2',
  },
  {
    id: 'event-5',
    type: 'delivery_started',
    title: 'Entrega Iniciada',
    description: 'João Silva iniciou a entrega do pedido PED-001235',
    timestamp: dayjs().subtract(2, 'minutes').toISOString(),
    severity: 'info',
    relatedId: 'order-2',
  },
];

// Relatórios financeiros mockados
export const mockFinancialReports: FinancialReport[] = [
  {
    period: '2024-01',
    totalRevenue: 125000.50,
    totalExpenses: 45000.00,
    netRevenue: 80000.50,
    ridesCount: 1250,
    deliveriesCount: 890,
    averageTicket: 58.50,
  },
  {
    period: '2024-02',
    totalRevenue: 138000.75,
    totalExpenses: 48000.00,
    netRevenue: 90000.75,
    ridesCount: 1380,
    deliveriesCount: 950,
    averageTicket: 61.20,
  },
];

