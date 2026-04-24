import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { server } from "@/test/server";
import { createWrapper } from "@/test/renderWithProviders";
import { useAdminPassengers } from "@/hooks/passengers/useAdminPassengers";
import { passengerFixtures } from "@/test/fixtures/passengers";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useAdminPassengers", () => {
  it("returns loading state initially", () => {
    const { result } = renderHook(() => useAdminPassengers(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useAdminPassengers(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(passengerFixtures.length);
  });

  it("returns error state on failure", async () => {
    server.use(
      http.get(
        `${resolveApiBase()}/v1/admin/passengers`,
        () => HttpResponse.error()
      )
    );
    const { result } = renderHook(() => useAdminPassengers(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
