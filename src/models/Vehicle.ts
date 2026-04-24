/** Admin vehicle record — from GET /v1/admin/vehicles */
export interface AdminVehicle {
  id: string;
  driverProfileId: string;
  serviceCategoryId: string | null;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export enum VehicleStatus {
  PENDING_DOCS = "PENDING_DOCS",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/** Vehicle brand — from GET /v1/admin/vehicle-reference/brands */
export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

/** Vehicle model — from GET /v1/admin/vehicle-reference/models */
export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
