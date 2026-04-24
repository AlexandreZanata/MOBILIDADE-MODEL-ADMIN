import type { AdminPassenger } from "@/models/Passenger";

export const passengerFixtures: AdminPassenger[] = [
  {
    userId: "passenger-001",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    cpf: "123.456.789-01",
    phone: "(11) 98765-4321",
    birthDate: "1990-05-15",
    emailVerified: true,
    emailVerifiedAt: "2025-12-01T08:00:00Z",
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2025-12-01T09:00:00Z",
    photoUrl: null,
  },
  {
    userId: "passenger-002",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@example.com",
    cpf: "987.654.321-00",
    phone: "(21) 91234-5678",
    birthDate: "1985-11-20",
    emailVerified: false,
    emailVerifiedAt: null,
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2025-11-15T10:00:00Z",
    photoUrl: null,
  },
];
