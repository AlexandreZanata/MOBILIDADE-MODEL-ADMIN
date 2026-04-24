import type { Cargo } from "@/models/Cargo";
import type { Lotacao } from "@/models/Lotacao";
import type { Department } from "@/models/Department";

/** Government staff member */
export interface Servidor {
  id: string;
  name: string;
  cpf: string;
  registrationNumber: string;
  email?: string;
  phone?: string;
  cargoId: string;
  cargo?: Cargo;
  lotacaoId: string;
  lotacao?: Lotacao;
  departmentId?: string;
  department?: Department;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
