import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { adminRidesFacade } from "@/facades/adminRidesFacade";
import { rideFixtures } from "@/test/fixtures/rides";
import { RideStatus } from "@/models/Ride";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("adminRidesFacade.list", () => {
  it("returns paginated rides on success", async () => {
    const result = await adminRidesFacade.list();
    expect(result.items).toHaveLength(rideFixtures.length);
    expect(result.items[0]).toHaveProperty("id");
    expect(result.hasMore).toBe(false);
  });

  it("throws ApiError on 401", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/rides`, () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
          { status: 401 }
        )
      )
    );
    await expect(adminRidesFacade.list()).rejects.toBeInstanceOf(ApiError);
  });

  it("throws ApiError on network error", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/rides`, () => HttpResponse.error())
    );
    await expect(adminRidesFacade.list()).rejects.toThrow();
  });
});

describe("adminRidesFacade.cancelRide", () => {
  it("returns cancel result on success", async () => {
    const result = await adminRidesFacade.cancelRide("ride-001", {
      reason: "Test cancel",
    });
    expect(result.rideId).toBe("ride-001");
    expect(result.status).toBe(RideStatus.CANCELADA_ADMIN);
    expect(result.penaltyApplied).toBe(false);
  });
});

describe("adminRidesFacade.updateStatus", () => {
  it("returns updated ride on success", async () => {
    const result = await adminRidesFacade.updateStatus("ride-001", {
      status: RideStatus.CONCLUIDA,
    });
    expect(result.status).toBe(RideStatus.CONCLUIDA);
  });

  it("throws ApiError on 404", async () => {
    server.use(
      http.patch(
        `${resolveApiBase()}/v1/admin/rides/:rideId/status`,
        () =>
          HttpResponse.json(
            { error: { code: "NOT_FOUND", message: "Not found" } },
            { status: 404 }
          )
      )
    );
    await expect(
      adminRidesFacade.updateStatus("nonexistent", { status: RideStatus.CONCLUIDA })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
