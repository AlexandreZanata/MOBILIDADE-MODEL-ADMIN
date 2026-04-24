import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";

export const authHandlers = [
  http.post(`${resolveApiBase()}/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === "admin@mobiliade.local" && body.password === "Admin123!") {
      return HttpResponse.json({
        id: "mock-user-id-001",
        email: body.email,
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        roles: ["admin"],
        emailVerified: true,
        createdAt: new Date().toISOString(),
      });
    }

    return HttpResponse.json(
      { error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
      { status: 401 }
    );
  }),

  http.post(`${resolveApiBase()}/v1/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${resolveApiBase()}/v1/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: "mock-access-token-refreshed",
      refreshToken: "mock-refresh-token-rotated",
    });
  }),
];
