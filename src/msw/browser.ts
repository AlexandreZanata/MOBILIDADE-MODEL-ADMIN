import { setupWorker } from "msw/browser";
import { authHandlers } from "@/msw/authHandlers";
import { adminRidesHandlers } from "@/msw/adminRidesHandlers";
import { adminPassengersHandlers } from "@/msw/adminPassengersHandlers";
import { adminVehiclesHandlers } from "@/msw/adminVehiclesHandlers";
import { serviceCategoriesHandlers } from "@/msw/serviceCategoriesHandlers";

export const worker = setupWorker(
  ...authHandlers,
  ...adminRidesHandlers,
  ...adminPassengersHandlers,
  ...adminVehiclesHandlers,
  ...serviceCategoriesHandlers
);
