import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/test/server";
import { resolveApiBase } from "@/lib/apiBase";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("serviceCategoriesHandlers", () => {
  it("GET /v1/admin/service-categories returns paginated list", async () => {
    const res = await fetch(`${resolveApiBase()}/v1/admin/service-categories`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(body.items.length).toBeGreaterThan(0);
  });

  it("POST /v1/admin/service-categories creates a category", async () => {
    const res = await fetch(`${resolveApiBase()}/v1/admin/service-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Premium",
        slug: "premium",
        baseFare: 10,
        perKmRate: 4.5,
        minFare: 20,
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.name).toBe("Premium");
    expect(body.slug).toBe("premium");
  });

  it("PATCH /v1/admin/service-categories/:id updates a category", async () => {
    const res = await fetch(
      `${resolveApiBase()}/v1/admin/service-categories/cat-001`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Econômico Plus" }),
      }
    );
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.name).toBe("Econômico Plus");
  });
});
