import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { serviceCategoriesFacade } from "@/facades/serviceCategoriesFacade";
import { serviceCategoryFixtures } from "@/test/fixtures/serviceCategories";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("serviceCategoriesFacade.list", () => {
  it("returns paginated categories on success", async () => {
    const result = await serviceCategoriesFacade.list();
    expect(result.items).toHaveLength(serviceCategoryFixtures.length);
    expect(result.items[0]).toHaveProperty("baseFare");
  });

  it("throws ApiError on 401", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/service-categories`, () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
          { status: 401 }
        )
      )
    );
    await expect(serviceCategoriesFacade.list()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("serviceCategoriesFacade.create", () => {
  it("normalizes decimal string fares from 201 response", async () => {
    const result = await serviceCategoriesFacade.create({
      name: "Premium",
      slug: "premium",
      baseFare: 10,
      perKmRate: 4.5,
      minFare: 20,
    });
    expect(typeof result.baseFare).toBe("number");
    expect(typeof result.perKmRate).toBe("number");
    expect(typeof result.minFare).toBe("number");
  });
});

describe("serviceCategoriesFacade.update", () => {
  it("returns updated category", async () => {
    const result = await serviceCategoriesFacade.update("cat-001", {
      name: "Econômico Plus",
    });
    expect(result.name).toBe("Econômico Plus");
  });

  it("throws ApiError on 404", async () => {
    server.use(
      http.patch(`${resolveApiBase()}/v1/admin/service-categories/:id`, () =>
        HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Not found" } },
          { status: 404 }
        )
      )
    );
    await expect(
      serviceCategoriesFacade.update("nonexistent", { name: "X" })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
