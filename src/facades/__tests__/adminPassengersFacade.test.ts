import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { adminPassengersFacade } from "@/facades/adminPassengersFacade";
import { passengerFixtures } from "@/test/fixtures/passengers";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";
import { ApiError } from "@/types/api";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("adminPassengersFacade.list", () => {
  it("returns paginated passengers on success", async () => {
    const result = await adminPassengersFacade.list();
    expect(result.items).toHaveLength(passengerFixtures.length);
    expect(result.items[0]).toHaveProperty("userId");
  });

  it("throws ApiError on 500", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/passengers`, () =>
        HttpResponse.json(
          { error: { code: "INTERNAL_ERROR", message: "Server error" } },
          { status: 500 }
        )
      )
    );
    await expect(adminPassengersFacade.list()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("adminPassengersFacade.delete", () => {
  it("returns success message", async () => {
    const result = await adminPassengersFacade.delete("passenger-001");
    expect(result).toHaveProperty("message");
  });
});

describe("adminPassengersFacade.reactivate", () => {
  it("returns success message", async () => {
    const result = await adminPassengersFacade.reactivate("passenger-001");
    expect(result).toHaveProperty("message");
  });
});
