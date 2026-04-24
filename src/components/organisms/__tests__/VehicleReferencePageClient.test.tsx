import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { VehicleReferencePageClient } from "@/components/organisms/VehicleReferencePageClient";
import { vehicleBrandFixtures } from "@/test/fixtures/vehicles";
import { resolveApiBase } from "@/lib/apiBase";
import { PermissionsContext } from "@/components/auth/PermissionsProvider";
import { UserRole } from "@/models/User";
import "@/test/i18n-mock";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithAdmin() {
  return renderWithProviders(
    <PermissionsContext.Provider value={{ role: UserRole.ADMIN }}>
      <VehicleReferencePageClient />
    </PermissionsContext.Provider>
  );
}

describe("VehicleReferencePageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithAdmin();
    expect(screen.getByTestId("vehicle-reference-skeleton")).toBeInTheDocument();
  });

  it("renders brands table after load", async () => {
    renderWithAdmin();
    expect(await screen.findByTestId("brands-table")).toBeInTheDocument();
    expect(screen.getByText(vehicleBrandFixtures[0].name)).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    server.use(
      http.get(
        `${resolveApiBase()}/v1/admin/vehicle-reference/brands`,
        () => HttpResponse.error()
      )
    );
    renderWithAdmin();
    expect(
      await screen.findByTestId("vehicle-reference-error")
    ).toBeInTheDocument();
  });

  it("opens create modal on create button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("brands-table");
    await user.click(screen.getByTestId("btn-create-brand"));
    expect(screen.getByTestId("brand-form-modal")).toBeInTheDocument();
  });

  it("opens edit modal on edit button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("brands-table");
    await user.click(
      screen.getByTestId(`btn-edit-brand-${vehicleBrandFixtures[0].id}`)
    );
    expect(screen.getByTestId("brand-form-modal")).toBeInTheDocument();
  });

  it("opens delete dialog on delete button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("brands-table");
    await user.click(
      screen.getByTestId(`btn-delete-brand-${vehicleBrandFixtures[0].id}`)
    );
    expect(screen.getByTestId("delete-brand-dialog")).toBeInTheDocument();
  });
});
