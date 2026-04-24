import type { Motorista } from "@/models/Motorista";
import type { Veiculo } from "@/models/Veiculo";
import type { Servidor } from "@/models/Servidor";

/** Government transport run */
export interface Run {
  id: string;
  number: string;
  requesterId: string;
  requester?: Servidor;
  driverId?: string;
  driver?: Motorista;
  vehicleId?: string;
  vehicle?: Veiculo;
  origin: string;
  destination: string;
  status: RunStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum RunStatus {
  REQUESTED = "REQUESTED",
  AWAITING_ACCEPTANCE = "AWAITING_ACCEPTANCE",
  ACCEPTED = "ACCEPTED",
  EN_ROUTE = "EN_ROUTE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}
