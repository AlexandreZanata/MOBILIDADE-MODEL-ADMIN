import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { renderWithProviders } from "@/test/renderWithProviders";
import { PassengersPageClient } from "@/components/organisms/PassengersPageClient";
import { passengerFixtures } from "@/test/fixtures/passengers";
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
      <PassengersPageClient />
    </PermissionsContext.Provider>
  );
}

describe("PassengersPageClient", () => {
  it("shows skeleton while loading", () => {
    renderWithAdmin();
    expect(screen.getByTestId("passengers-skeleton")).toBeInTheDocument();
  });

  it("renders passengers table after load", async () => {
    renderWithAdmin();
    expect(await screen.findByTestId("passengers-table")).toBeInTheDocument();
    expect(screen.getByText(passengerFixtures[0].name)).toBeInTheDocument();
  });

  it("shows error state on failure", async () => {
    server.use(
      http.get(`${resolveApiBase()}/v1/admin/passengers`, () => HttpResponse.error())
    );
    renderWithAdmin();
    expect(await screen.findByTestId("passengers-error")).toBeInTheDocument();
  });

  it("opens delete dialog on delete button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("passengers-table");
    await user.click(
      screen.getByTestId(`btn-delete-${passengerFixtures[0].userId}`)
    );
    expect(screen.getByTestId("delete-passenger-dialog")).toBeInTheDocument();
  });

  it("opens reactivate dialog on reactivate button click", async () => {
    const user = userEvent.setup();
    renderWithAdmin();
    await screen.findByTestId("passengers-table");
    await user.click(
      screen.getByTestId(`btn-reactivate-${passengerFixtures[0].userId}`)
    );
    expect(screen.getByTestId("reactivate-passenger-dialog")).toBeInTheDocument();
  });
});
