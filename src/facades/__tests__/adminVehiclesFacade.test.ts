import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { adminVehiclesFacade } from "@/facades/adminVehiclesFacade";
import { vehicleFixtures, vehicleCategoryRequirementFixtures } from "@/test/fixtures/vehicles";
import { resetRequirementStore } from "@/msw/adminVehiclesHandlers";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetRequirementStore();
});
afterAll(() => server.close());

// ─── Vehicles ────────────────────────────────────────────────────────────────
describe("adminVehiclesFacade.list", () => {
  it("returns paginated vehicles on success", async () => {
    const result = await adminVehiclesFacade.list();
    expect(result.items).toHaveLength(vehicleFixtures.length);
    expect(result.items[0]).toHaveProperty("licensePlate");
  });

  it("throws ApiError on 401", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/vehicles`, () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
          { status: 401 }
        )
      )
    );
    await expect(adminVehiclesFacade.list()).rejects.toBeInstanceOf(ApiError);
  });

  it("throws ApiError on network error", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/vehicles`, () => HttpResponse.error())
    );
    await expect(adminVehiclesFacade.list()).rejects.toThrow();
  });
});

// ─── Category Requirements ────────────────────────────────────────────────────
describe("adminVehiclesFacade.listCategoryRequirements", () => {
  it("returns all requirements as a flat array", async () => {
    const result = await adminVehiclesFacade.listCategoryRequirements();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(vehicleCategoryRequirementFixtures.length);
    expect(result[0]).toHaveProperty("minYear");
    expect(result[0]).toHaveProperty("serviceCategoryId");
  });

  it("throws ApiError on 500", async () => {
    server.use(
      http.get(
        `${resolveApiBase()}/v1/admin/vehicle-category-requirements`,
        () =>
          HttpResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Server error" } },
            { status: 500 }
          )
      )
    );
    await expect(
      adminVehiclesFacade.listCategoryRequirements()
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("adminVehiclesFacade.getCategoryRequirement", () => {
  it("returns the requirement for a known category", async () => {
    const categoryId = vehicleCategoryRequirementFixtures[0].serviceCategoryId;
    const result = await adminVehiclesFacade.getCategoryRequirement(categoryId);
    expect(result.serviceCategoryId).toBe(categoryId);
    expect(typeof result.minYear).toBe("number");
  });

  it("throws ApiError with 404 for unknown category", async () => {
    const err = await adminVehiclesFacade
      .getCategoryRequirement("nonexistent-id")
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
  });
});

describe("adminVehiclesFacade.upsertCategoryRequirement", () => {
  it("creates a new requirement and returns it", async () => {
    const result = await adminVehiclesFacade.upsertCategoryRequirement({
      serviceCategoryId: "cat-new-001",
      minYear: 2019,
    });
    expect(result.serviceCategoryId).toBe("cat-new-001");
    expect(result.minYear).toBe(2019);
    expect(result).toHaveProperty("id");
  });

  it("updates an existing requirement (upsert)", async () => {
    const categoryId = vehicleCategoryRequirementFixtures[0].serviceCategoryId;
    const result = await adminVehiclesFacade.upsertCategoryRequirement({
      serviceCategoryId: categoryId,
      minYear: 2022,
    });
    expect(result.serviceCategoryId).toBe(categoryId);
    expect(result.minYear).toBe(2022);
  });

  it("throws ApiError on 422", async () => {
    server.use(
      http.post(
        `${resolveApiBase()}/v1/admin/vehicle-category-requirements`,
        () =>
          HttpResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "Invalid minYear" } },
            { status: 422 }
          )
      )
    );
    await expect(
      adminVehiclesFacade.upsertCategoryRequirement({
        serviceCategoryId: "cat-001",
        minYear: 1800,
      })
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("adminVehiclesFacade.deleteCategoryRequirement", () => {
  it("resolves without error for an existing category", async () => {
    const categoryId = vehicleCategoryRequirementFixtures[0].serviceCategoryId;
    await expect(
      adminVehiclesFacade.deleteCategoryRequirement(categoryId)
    ).resolves.toBeUndefined();
  });

  it("throws ApiError with 404 for unknown category", async () => {
    const err = await adminVehiclesFacade
      .deleteCategoryRequirement("nonexistent-id")
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
  });
});
