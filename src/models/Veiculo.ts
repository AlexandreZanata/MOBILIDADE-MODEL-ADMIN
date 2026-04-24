/** Fleet vehicle */
export interface Veiculo {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  type: VeiculoType;
  capacity: number;
  status: VeiculoStatus;
  active: boolean;
  createdAt: string;
}

export enum VeiculoType {
  SEDAN = "SEDAN",
  SUV = "SUV",
  VAN = "VAN",
  BUS = "BUS",
}

export enum VeiculoStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
}
