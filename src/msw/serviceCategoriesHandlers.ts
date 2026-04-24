import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { serviceCategoryFixtures } from "@/test/fixtures/serviceCategories";

export const serviceCategoriesHandlers = [
  http.get(`${resolveApiBase()}/v1/admin/service-categories`, () => {
    return HttpResponse.json({
      items: serviceCategoryFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: serviceCategoryFixtures.length,
    });
  }),

  http.post(`${resolveApiBase()}/v1/admin/service-categories`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      slug: string;
      baseFare: number;
      perKmRate: number;
      minFare: number;
    };
    return HttpResponse.json(
      {
        id: crypto.randomUUID(),
        name: body.name,
        slug: body.slug,
        baseFare: body.baseFare.toFixed(2),
        perKmRate: body.perKmRate.toFixed(2),
        minFare: body.minFare.toFixed(2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.patch(
    `${resolveApiBase()}/v1/admin/service-categories/:id`,
    async ({ params, request }) => {
      const body = (await request.json()) as Partial<{
        name: string;
        slug: string;
        baseFare: number;
        perKmRate: number;
        minFare: number;
      }>;
      const cat = serviceCategoryFixtures.find((c) => c.id === params.id);
      if (!cat) {
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Category not found" } },
          { status: 404 }
        );
      }
      return HttpResponse.json({ ...cat, ...body, updatedAt: new Date().toISOString() });
    }
  ),
];
