import type { ListParams } from "@/types/pagination";
import type { RideStatus } from "@/models/Ride";

export interface AdminRidesListParams extends ListParams {
  status?: RideStatus;
}

export interface UpdateRideStatusInput {
  status: RideStatus;
}

export interface CancelRideInput {
  reason?: string;
}
