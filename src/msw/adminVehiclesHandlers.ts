import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { vehicleFixtures, vehicleBrandFixtures, vehicleModelFixtures } from "@/test/fixtures/vehicles";

export const adminVehiclesHandlers = [
  http.get(`${resolveApiBase()}/v1/admin/vehicles`, () => {
    return HttpResponse.json({
      items: vehicleFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleFixtures.length,
    });
  }),

  http.get(`${resolveApiBase()}/v1/admin/vehicle-reference/brands`, () => {
    return HttpResponse.json({
      items: vehicleBrandFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleBrandFixtures.length,
    });
  }),

  http.post(`${resolveApiBase()}/v1/admin/vehicle-reference/brands`, async ({ request }) => {
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
  }),

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

  http.get(`${resolveApiBase()}/v1/admin/vehicle-reference/models`, () => {
    return HttpResponse.json({
      items: vehicleModelFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: vehicleModelFixtures.length,
    });
  }),
];
