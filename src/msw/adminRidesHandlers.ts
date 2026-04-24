import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { rideFixtures } from "@/test/fixtures/rides";
import { RideStatus } from "@/models/Ride";

export const adminRidesHandlers = [
  http.get(`${resolveApiBase()}/v1/admin/rides`, () => {
    return HttpResponse.json({
      items: rideFixtures,
      nextCursor: null,
      prevCursor: null,
      hasMore: false,
      totalCount: rideFixtures.length,
    });
  }),

  http.patch(
    `${resolveApiBase()}/v1/admin/rides/:rideId/status`,
    async ({ params, request }) => {
      const body = (await request.json()) as { status: RideStatus };
      const ride = rideFixtures.find((r) => r.id === params.rideId);
      if (!ride) {
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Ride not found" } },
          { status: 404 }
        );
      }
      return HttpResponse.json({ ...ride, status: body.status });
    }
  ),

  http.post(
    `${resolveApiBase()}/v1/admin/rides/:rideId/cancel`,
    async ({ params, request }) => {
      const body = (await request.json()) as { reason?: string };
      return HttpResponse.json({
        rideId: params.rideId,
        status: RideStatus.CANCELADA_ADMIN,
        cancellationReason: body.reason ?? null,
        cancelledBy: "mock-admin-id",
        cancelledAt: new Date().toISOString(),
        cancellationFee: 0,
        penaltyApplied: false,
        message: "Ride cancelled by admin.",
      });
    }
  ),
];
