export interface CreateLotacaoInput {
  name: string;
  description?: string;
}

export interface UpdateLotacaoInput {
  name?: string;
  description?: string;
  active?: boolean;
}
