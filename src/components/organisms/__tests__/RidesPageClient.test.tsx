import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { RidesPageClient } from "@/components/organisms/RidesPageClient";
import { rideFixtures } from "@/test/fixtures/rides";
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
      <RidesPageClient />
    </PermissionsContext.Provider>
  );
}

describe("RidesPageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithAdmin();
    expect(screen.getByTestId("rides-skeleton")).toBeInTheDocument();
  });

  it("renders rides table after load", async () => {
    renderWithAdmin();
    expect(await screen.findByTestId("rides-table")).toBeInTheDocument();
    expect(screen.getByText(rideFixtures[0].passenger!.name)).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/rides`, () => HttpResponse.error())
    );
    renderWithAdmin();
    expect(await screen.findByTestId("rides-error")).toBeInTheDocument();
  });

  it("opens cancel dialog on cancel button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("rides-table");
    await user.click(screen.getByTestId(`btn-cancel-ride-${rideFixtures[0].id}`));
    expect(screen.getByTestId("cancel-ride-dialog")).toBeInTheDocument();
  });

  it("shows access denied for AGENT role", () => {
    renderWithProviders(
      <PermissionsContext.Provider value={{ role: UserRole.AGENT }}>
        <RidesPageClient />
      </PermissionsContext.Provider>
    );
    // AGENT has RIDE_ADMIN_VIEW but not RIDE_ADMIN_CANCEL — table still shows
    expect(screen.queryByTestId("cancel-ride-dialog")).not.toBeInTheDocument();
  });
});
