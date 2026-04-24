export interface CreateMotoristaInput {
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
}

export interface UpdateMotoristaInput {
  name?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseExpiry?: string;
}
