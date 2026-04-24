import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { resolveApiBase } from "@/lib/apiBase";
import { RideStatus } from "@/models/Ride";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("adminRidesHandlers", () => {
  it("GET /v1/admin/rides returns paginated list", async () => {
    const res = await fetch(`${resolveApiBase()}/v1/admin/rides`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
  });

  it("POST /v1/admin/rides/:id/cancel returns cancel result", async () => {
    const res = await fetch(`${resolveApiBase()}/v1/admin/rides/ride-001/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Test" }),
    });
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.status).toBe(RideStatus.CANCELADA_ADMIN);
    expect(body.penaltyApplied).toBe(false);
  });

  it("PATCH /v1/admin/rides/:id/status returns updated ride", async () => {
    const res = await fetch(
      `${resolveApiBase()}/v1/admin/rides/ride-001/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: RideStatus.CONCLUIDA }),
      }
    );
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.status).toBe(RideStatus.CONCLUIDA);
  });
});
