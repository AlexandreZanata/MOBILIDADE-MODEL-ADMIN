/** Fleet driver */
export interface Motorista {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  status: MotoristaStatus;
  active: boolean;
  createdAt: string;
}

export enum MotoristaStatus {
  AVAILABLE = "AVAILABLE",
  ON_DUTY = "ON_DUTY",
  UNAVAILABLE = "UNAVAILABLE",
  SUSPENDED = "SUSPENDED",
}
