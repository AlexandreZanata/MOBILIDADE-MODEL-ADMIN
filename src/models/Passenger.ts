/** Admin passenger record — from GET /v1/admin/passengers */
export interface AdminPassenger {
  userId: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  photoUrl: string | null;
}
