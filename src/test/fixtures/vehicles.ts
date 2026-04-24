import type { AdminVehicle, VehicleBrand, VehicleModel } from "@/models/Vehicle";
import { VehicleStatus } from "@/models/Vehicle";

export const vehicleFixtures: AdminVehicle[] = [
  {
    id: "vehicle-001",
    driverProfileId: "driver-001",
    serviceCategoryId: "cat-001",
    licensePlate: "ABC-1234",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "Branco",
    status: VehicleStatus.APPROVED,
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2025-12-01T08:00:00Z",
  },
  {
    id: "vehicle-002",
    driverProfileId: "driver-002",
    serviceCategoryId: null,
    licensePlate: "XYZ-5678",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    color: "Preto",
    status: VehicleStatus.PENDING_REVIEW,
    createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2025-11-20T10:00:00Z",
  },
];

export const vehicleBrandFixtures: VehicleBrand[] = [
  {
    id: "brand-001",
    name: "Toyota",
    slug: "toyota",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "brand-002",
    name: "Honda",
    slug: "honda",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

export const vehicleModelFixtures: VehicleModel[] = [
  {
    id: "model-001",
    brandId: "brand-001",
    name: "Corolla",
    slug: "corolla",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "model-002",
    brandId: "brand-002",
    name: "Civic",
    slug: "civic",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];
