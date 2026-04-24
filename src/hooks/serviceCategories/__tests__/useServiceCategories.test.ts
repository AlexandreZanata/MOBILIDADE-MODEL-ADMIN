import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { server } from "@/test/server";
import { createWrapper } from "@/test/renderWithProviders";
import { useServiceCategories } from "@/hooks/serviceCategories/useServiceCategories";
import { serviceCategoryFixtures } from "@/test/fixtures/serviceCategories";
import { http, HttpResponse } from "msw";
import { resolveApiBase } from "@/lib/apiBase";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useServiceCategories", () => {
  it("returns loading state initially", () => {
    const { result } = renderHook(() => useServiceCategories(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("returns data on success", async () => {
    const { result } = renderHook(() => useServiceCategories(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(
      serviceCategoryFixtures.length
    );
  });

  it("returns error state on failure", async () => {
    server.use(
      http.get(
        `${resolveApiBase()}/v1/admin/service-categories`,
        () => HttpResponse.error()
      )
    );
    const { result } = renderHook(() => useServiceCategories(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
