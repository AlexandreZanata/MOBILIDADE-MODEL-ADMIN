import { setupServer } from "msw/node";
import { authHandlers } from "@/msw/authHandlers";
import { adminRidesHandlers } from "@/msw/adminRidesHandlers";
import { adminPassengersHandlers } from "@/msw/adminPassengersHandlers";
import { adminVehiclesHandlers } from "@/msw/adminVehiclesHandlers";
import { serviceCategoriesHandlers } from "@/msw/serviceCategoriesHandlers";
import { billingHandlers } from "@/msw/billingHandlers";

export const server = setupServer(
  ...authHandlers,
  ...adminRidesHandlers,
  ...adminPassengersHandlers,
  ...adminVehiclesHandlers,
  ...serviceCategoriesHandlers,
  ...billingHandlers
);
