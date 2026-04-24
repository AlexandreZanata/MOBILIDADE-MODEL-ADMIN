export interface CreateServidorInput {
  name: string;
  cpf: string;
  registrationNumber: string;
  email?: string;
  phone?: string;
  cargoId: string;
  lotacaoId: string;
  departmentId?: string;
}

export interface UpdateServidorInput {
  name?: string;
  email?: string;
  phone?: string;
  cargoId?: string;
  lotacaoId?: string;
  departmentId?: string;
  active?: boolean;
}
