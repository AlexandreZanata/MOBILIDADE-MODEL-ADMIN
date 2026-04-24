import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import {
  billingConfigFixture,
  billingCycleFixtures,
  driverBillingStatusFixture,
  jobHistoryFixtures,
} from "@/test/fixtures/billing";
import type { BillingConfig } from "@/models/Billing";

const BASE = `${resolveApiBase()}/api/v1/admin/billing`;

// Mutable config store for update tests
let configStore: BillingConfig = { ...billingConfigFixture };

export function resetBillingStore() {
  configStore = { ...billingConfigFixture };
}

export const billingHandlers = [
  // ─── Config ────────────────────────────────────────────────────────────────
  http.get(`${BASE}/config`, () => HttpResponse.json(configStore)),

  http.put(`${BASE}/config`, async ({ request }) => {
    const body = (await request.json()) as Partial<BillingConfig>;
    configStore = { ...configStore, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(configStore);
  }),

  // ─── Cycles ────────────────────────────────────────────────────────────────
  http.get(`${BASE}/cycles/:cycleId`, ({ params }) => {
    const cycle = billingCycleFixtures.find((c) => c.id === params.cycleId);
    if (!cycle) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Cycle not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json(cycle);
  }),

  http.post(`${BASE}/cycles/:cycleId/pix`, ({ params }) => {
    const cycle = billingCycleFixtures.find((c) => c.id === params.cycleId);
    if (!cycle) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Cycle not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      billingCycleId: cycle.id,
      paymentId: crypto.randomUUID(),
      amount: cycle.remainingAmount,
      qrCode: "mock-qr-code",
      qrCodeBase64: "bW9jay1xcg==",
      copyPaste: "00020126mock-copy-paste",
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      externalReference: "mock-ext-ref",
      generatedAt: new Date().toISOString(),
    });
  }),

  // ─── Drivers ───────────────────────────────────────────────────────────────
  http.get(`${BASE}/drivers/:driverId/status`, ({ params }) => {
    if (params.driverId !== driverBillingStatusFixture.driverId) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Driver not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json(driverBillingStatusFixture);
  }),

  http.get(`${BASE}/drivers/:driverId/cycles`, ({ params }) => {
    const cycles = billingCycleFixtures.filter(
      (c) => c.driverId === params.driverId
    );
    return HttpResponse.json(cycles);
  }),

  http.post(`${BASE}/drivers/:driverId/unblock`, () =>
    new HttpResponse(null, { status: 200 })
  ),

  // ─── Jobs ──────────────────────────────────────────────────────────────────
  http.get(`${BASE}/jobs/history`, () => HttpResponse.json(jobHistoryFixtures)),

  http.post(`${BASE}/jobs/billing-cycle/run`, () =>
    HttpResponse.json({
      id: crypto.randomUUID(),
      jobType: "BILLING_CYCLE",
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
      driversProcessed: 3,
      cyclesGenerated: 3,
      cyclesExpired: 0,
      driversBlocked: 0,
      status: "COMPLETED",
      errorMessage: null,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 1500,
    })
  ),

  http.post(`${BASE}/jobs/expiration-check/run`, () =>
    HttpResponse.json({
      id: crypto.randomUUID(),
      jobType: "EXPIRATION_CHECK",
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
      driversProcessed: 2,
      cyclesGenerated: 0,
      cyclesExpired: 1,
      driversBlocked: 1,
      status: "COMPLETED",
      errorMessage: null,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: 800,
    })
  ),

  // ─── Test helpers ──────────────────────────────────────────────────────────
  http.post(`${BASE}/test/create-debt`, async ({ request }) => {
    const body = (await request.json()) as {
      driverId: string;
      rideCount: number;
      pricePerRide: number;
    };
    return HttpResponse.json({
      cycleId: crypto.randomUUID(),
      driverId: body.driverId,
      rideCount: body.rideCount,
      pricePerRide: body.pricePerRide,
      totalAmount: body.rideCount * body.pricePerRide,
      status: "PENDING",
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      pix: null,
      message: "Test debt created successfully.",
    });
  }),

  http.delete(`${BASE}/test/debt/:cycleId`, () =>
    new HttpResponse(null, { status: 204 })
  ),
];
