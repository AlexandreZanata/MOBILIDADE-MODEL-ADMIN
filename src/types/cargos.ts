export interface CreateCargoInput {
  name: string;
  description?: string;
}

export interface UpdateCargoInput {
  name?: string;
  description?: string;
  active?: boolean;
}
