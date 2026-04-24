/** Admin ride summary — from GET /v1/admin/rides */
export interface AdminRide {
  id: string;
  passengerId: string;
  driverId: string | null;
  serviceCategoryId: string;
  paymentMethodId: string;
  cardBrandId: string | null;
  status: RideStatus;
  estimatedPrice: number;
  finalPrice: number | null;
  distanceKm: number;
  durationMinutes: number;
  surge: number;
  requestedAt: string;
  createdAt: string;
  passenger: RidePassengerSummary | null;
  driver: RideDriverSummary | null;
}

export interface RidePassengerSummary {
  id: string;
  name: string;
  rating: number;
}

export interface RideDriverSummary {
  id: string;
  name: string;
  rating: number;
  vehicle: RideVehicleSummary | null;
}

export interface RideVehicleSummary {
  licensePlate: string;
  brand: string;
  model: string;
  color: string;
}

/** Cancel ride response */
export interface CancelRideResult {
  rideId: string;
  status: string;
  cancellationReason: string | null;
  cancelledBy: string;
  cancelledAt: string;
  cancellationFee: number;
  penaltyApplied: boolean;
  message: string;
}

export enum RideStatus {
  AGUARDANDO_MOTORISTA = "AGUARDANDO_MOTORISTA",
  MOTORISTA_ACEITOU = "MOTORISTA_ACEITOU",
  MOTORISTA_A_CAMINHO = "MOTORISTA_A_CAMINHO",
  MOTORISTA_CHEGOU = "MOTORISTA_CHEGOU",
  EM_ANDAMENTO = "EM_ANDAMENTO",
  CONCLUIDA = "CONCLUIDA",
  CANCELADA_PASSAGEIRO = "CANCELADA_PASSAGEIRO",
  CANCELADA_MOTORISTA = "CANCELADA_MOTORISTA",
  CANCELADA_ADMIN = "CANCELADA_ADMIN",
  EXPIRADA = "EXPIRADA",
}
