import type { ServiceCategory } from "@/models/ServiceCategory";

export const serviceCategoryFixtures: ServiceCategory[] = [
  {
    id: "cat-001",
    name: "Econômico",
    slug: "economico",
    baseFare: 5.0,
    perKmRate: 2.5,
    minFare: 10.0,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "cat-002",
    name: "Conforto",
    slug: "conforto",
    baseFare: 8.0,
    perKmRate: 3.5,
    minFare: 15.0,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];
