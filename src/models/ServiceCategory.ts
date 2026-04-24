/** Service category — from GET /v1/admin/service-categories */
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  baseFare: number;
  perKmRate: number;
  minFare: number;
  createdAt: string;
  updatedAt: string;
}
