import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { billingFacade } from "@/facades/billingFacade";
import {
  billingConfigFixture,
  billingCycleFixtures,
  driverBillingStatusFixture,
  jobHistoryFixtures,
} from "@/test/fixtures/billing";
import { resetBillingStore } from "@/msw/billingHandlers";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";

const BASE = `${resolveApiBase()}/api/v1/admin/billing`;

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetBillingStore();
});
afterAll(() => server.close());

// ─── Config ──────────────────────────────────────────────────────────────────
describe("billingFacade.getConfig", () => {
  it("returns the billing configuration", async () => {
    const result = await billingFacade.getConfig();
    expect(result.id).toBe(billingConfigFixture.id);
    expect(result.cycleUnit).toBe(billingConfigFixture.cycleUnit);
    expect(typeof result.pricePerRide).toBe("number");
  });

  it("throws ApiError on 500", async () => {
    server.use(
      http.get(`${BASE}/config`, () =>
        HttpResponse.json(
          { error: { code: "INTERNAL_ERROR", message: "Server error" } },
          { status: 500 }
        )
      )
    );
    await expect(billingFacade.getConfig()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("billingFacade.updateConfig", () => {
  it("returns the updated configuration", async () => {
    const result = await billingFacade.updateConfig({ pricePerRide: 3.5 });
    expect(result.pricePerRide).toBe(3.5);
  });

  it("throws ApiError on 422", async () => {
    server.use(
      http.put(`${BASE}/config`, () =>
        HttpResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "Invalid value" } },
          { status: 422 }
        )
      )
    );
    await expect(billingFacade.updateConfig({ cycleInterval: -1 })).rejects.toBeInstanceOf(ApiError);
  });
});

// ─── Cycles ──────────────────────────────────────────────────────────────────
describe("billingFacade.getCycleDetail", () => {
  it("returns cycle details for a known cycle", async () => {
    const cycleId = billingCycleFixtures[0].id;
    const result = await billingFacade.getCycleDetail(cycleId);
    expect(result.id).toBe(cycleId);
    expect(result).toHaveProperty("rideCount");
  });

  it("throws ApiError with 404 for unknown cycle", async () => {
    const err = await billingFacade.getCycleDetail("nonexistent").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
  });
});

describe("billingFacade.generatePix", () => {
  it("returns PIX payment details", async () => {
    const cycleId = billingCycleFixtures[0].id;
    const result = await billingFacade.generatePix(cycleId);
    expect(result.billingCycleId).toBe(cycleId);
    expect(result).toHaveProperty("copyPaste");
    expect(result).toHaveProperty("qrCodeBase64");
  });
});

// ─── Drivers ─────────────────────────────────────────────────────────────────
describe("billingFacade.getDriverStatus", () => {
  it("returns driver billing status", async () => {
    const driverId = driverBillingStatusFixture.driverId;
    const result = await billingFacade.getDriverStatus(driverId);
    expect(result.driverId).toBe(driverId);
    expect(typeof result.isBlocked).toBe("boolean");
    expect(Array.isArray(result.pendingCycles)).toBe(true);
  });

  it("throws ApiError with 404 for unknown driver", async () => {
    const err = await billingFacade.getDriverStatus("nonexistent").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(404);
  });
});

describe("billingFacade.getDriverCycles", () => {
  it("returns an array of cycles for the driver", async () => {
    const driverId = driverBillingStatusFixture.driverId;
    const result = await billingFacade.getDriverCycles(driverId);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("status");
  });
});

describe("billingFacade.unblockDriver", () => {
  it("resolves without error", async () => {
    await expect(
      billingFacade.unblockDriver(driverBillingStatusFixture.driverId)
    ).resolves.toBeUndefined();
  });

  it("throws ApiError on 404", async () => {
    server.use(
      http.post(`${BASE}/drivers/:driverId/unblock`, () =>
        HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Driver not found" } },
          { status: 404 }
        )
      )
    );
    await expect(billingFacade.unblockDriver("nonexistent")).rejects.toBeInstanceOf(ApiError);
  });
});

// ─── Jobs ─────────────────────────────────────────────────────────────────────
describe("billingFacade.getJobHistory", () => {
  it("returns an array of job execution records", async () => {
    const result = await billingFacade.getJobHistory();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(jobHistoryFixtures.length);
    expect(result[0]).toHaveProperty("jobType");
    expect(result[0]).toHaveProperty("durationMs");
  });
});

describe("billingFacade.runBillingCycleJob", () => {
  it("returns a job execution result", async () => {
    const result = await billingFacade.runBillingCycleJob();
    expect(result).toHaveProperty("cyclesGenerated");
    expect(result.status).toBe("COMPLETED");
  });
});

describe("billingFacade.runExpirationCheck", () => {
  it("returns a job execution result with expiration data", async () => {
    const result = await billingFacade.runExpirationCheck();
    expect(result).toHaveProperty("cyclesExpired");
    expect(result).toHaveProperty("driversBlocked");
  });
});

// ─── Test helpers ─────────────────────────────────────────────────────────────
describe("billingFacade.createTestDebt", () => {
  it("returns a test debt result with cycle info", async () => {
    const result = await billingFacade.createTestDebt({
      driverId: "driver-001",
      rideCount: 5,
      pricePerRide: 2,
    });
    expect(result.driverId).toBe("driver-001");
    expect(result.rideCount).toBe(5);
    expect(result.totalAmount).toBe(10);
    expect(result).toHaveProperty("cycleId");
  });
});

describe("billingFacade.deleteTestDebt", () => {
  it("resolves without error for a valid cycle", async () => {
    await expect(
      billingFacade.deleteTestDebt("cycle-001")
    ).resolves.toBeUndefined();
  });

  it("throws ApiError on 404", async () => {
    server.use(
      http.delete(`${BASE}/test/debt/:cycleId`, () =>
        HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Cycle not found" } },
          { status: 404 }
        )
      )
    );
    await expect(billingFacade.deleteTestDebt("nonexistent")).rejects.toBeInstanceOf(ApiError);
  });
});
