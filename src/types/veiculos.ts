import type { VeiculoType } from "@/models/Veiculo";

export interface CreateVeiculoInput {
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  type: VeiculoType;
  capacity: number;
}

export interface UpdateVeiculoInput {
  model?: string;
  brand?: string;
  year?: number;
  color?: string;
  type?: VeiculoType;
  capacity?: number;
}
