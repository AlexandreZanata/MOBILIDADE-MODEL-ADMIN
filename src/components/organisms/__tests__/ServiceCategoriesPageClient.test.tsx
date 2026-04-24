import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { ServiceCategoriesPageClient } from "@/components/organisms/ServiceCategoriesPageClient";
import { serviceCategoryFixtures } from "@/test/fixtures/serviceCategories";
import { resolveApiBase } from "@/lib/apiBase";
import { PermissionsContext } from "@/components/auth/PermissionsProvider";
import { UserRole } from "@/models/User";
import "../../../test/i18n-mock";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithAdmin() {
  return renderWithProviders(
    <PermissionsContext.Provider value={{ role: UserRole.ADMIN }}>
      <ServiceCategoriesPageClient />
    </PermissionsContext.Provider>
  );
}

describe("ServiceCategoriesPageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithAdmin();
    expect(screen.getByTestId("service-categories-skeleton")).toBeInTheDocument();
  });

  it("renders categories table after load", async () => {
    renderWithAdmin();
    expect(
      await screen.findByTestId("service-categories-table")
    ).toBeInTheDocument();
    expect(screen.getByText(serviceCategoryFixtures[0].name)).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    server.use(
      http.get(
        `${resolveApiBase()}/v1/admin/service-categories`,
        () => HttpResponse.error()
      )
    );
    renderWithAdmin();
    expect(
      await screen.findByTestId("service-categories-error")
    ).toBeInTheDocument();
  });

  it("opens create modal on create button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("service-categories-table");
    await user.click(screen.getByTestId("btn-create-category"));
    expect(screen.getByTestId("category-form-modal")).toBeInTheDocument();
  });

  it("opens edit modal on edit button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("service-categories-table");
    await user.click(
      screen.getByTestId(`btn-edit-category-${serviceCategoryFixtures[0].id}`)
    );
    expect(screen.getByTestId("category-form-modal")).toBeInTheDocument();
  });
});
