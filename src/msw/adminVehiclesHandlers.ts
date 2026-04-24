import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import {
  vehicleFixtures,
  vehicleBrandFixtures,
  vehicleModelFixtures,
  vehicleCategoryRequirementFixtures,
} from "@/test/fixtures/vehicles";
import type { VehicleCategoryRequirement } from "@/models/Vehicle";

let requirementStore: VehicleCategoryRequirement[] = [
  ...vehicleCategoryRequirementFixtures,
];

export function resetRequirementStore() {
  requirementStore = [...vehicleCategoryRequirementFixtures];
}

export const adminVehiclesHandlers = [
  http.get(`${resolveApiBase()}/v1/admin/vehicles`, () =>
    HttpResponse.json({
      items: vehicleFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleFixtures.length,
    })
  ),
  http.get(`${resolveApiBase()}/v1/admin/vehicle-reference/brands`, () =>
    HttpResponse.json({
      items: vehicleBrandFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleBrandFixtures.length,
    })
  ),
  http.post(
    `${resolveApiBase()}/v1/admin/vehicle-reference/brands`,
    async ({ request }) => {
      const body = (await request.json()) as { name: string; slug: string };
      return HttpResponse.json(
        {
          id: crypto.randomUUID(),
          name: body.name,
          slug: body.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { status: 201 }
      );
    }
  ),
  http.patch(
    `${resolveApiBase()}/v1/admin/vehicle-reference/brands/:id`,
    async ({ params, request }) => {
      const body = (await request.json()) as { name?: string; slug?: string };
      const brand = vehicleBrandFixtures.find((b) => b.id === params.id);
      if (!brand) {
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Brand not found" } },
          { status: 404 }
        );
      }
      return HttpResponse.json({ ...brand, ...body, updatedAt: new Date().toISOString() });
    }
  ),
  http.delete(
    `${resolveApiBase()}/v1/admin/vehicle-reference/brands/:id`,
    () => new HttpResponse(null, { status: 204 })
  ),
  http.get(`${resolveApiBase()}/v1/admin/vehicle-reference/models`, () =>
    HttpResponse.json({
      items: vehicleModelFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleModelFixtures.length,
    })
  ),
  http.get(
    `${resolveApiBase()}/v1/admin/vehicle-category-requirements`,
    () => HttpResponse.json(requirementStore)
  ),
  http.get(
    `${resolveApiBase()}/v1/admin/vehicle-category-requirements/category/:categoryId`,
    ({ params }) => {
      const req = requirementStore.find(
        (r) => r.serviceCategoryId === params.categoryId
      );
      if (!req) {
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "No requirement for this category" } },
          { status: 404 }
        );
      }
      return HttpResponse.json(req);
    }
  ),
  http.post(
    `${resolveApiBase()}/v1/admin/vehicle-category-requirements`,
    async ({ request }) => {
      const body = (await request.json()) as {
        serviceCategoryId: string;
        minYear: number;
      };
      const existing = requirementStore.find(
        (r) => r.serviceCategoryId === body.serviceCategoryId
      );
      if (existing) {
        const updated: VehicleCategoryRequirement = {
          ...existing,
          minYear: body.minYear,
          updatedAt: new Date().toISOString(),
        };
        requirementStore = requirementStore.map((r) =>
          r.serviceCategoryId === body.serviceCategoryId ? updated : r
        );
        return HttpResponse.json(updated, { status: 201 });
      }
      const created: VehicleCategoryRequirement = {
        id: crypto.randomUUID(),
        serviceCategoryId: body.serviceCategoryId,
        minYear: body.minYear,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      requirementStore = [...requirementStore, created];
      return HttpResponse.json(created, { status: 201 });
    }
  ),
  http.delete(
    `${resolveApiBase()}/v1/admin/vehicle-category-requirements/category/:categoryId`,
    ({ params }) => {
      const exists = requirementStore.some(
        (r) => r.serviceCategoryId === params.categoryId
      );
      if (!exists) {
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "No requirement for this category" } },
          { status: 404 }
        );
      }
      requirementStore = requirementStore.filter(
        (r) => r.serviceCategoryId !== params.categoryId
      );
      return HttpResponse.json({ deleted: true });
    }
  ),
];
