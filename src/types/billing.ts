import type { BillingCycleUnit } from "@/models/Billing";

/** PUT /api/v1/admin/billing/config — partial update payload */
export interface UpdateBillingConfigInput {
  cycleUnit?: BillingCycleUnit;
  cycleInterval?: number;
  executionTime?: string;
  executionTimezone?: string;
  pricePerRide?: number;
  minimumCharge?: number;
  pixExpirationDays?: number;
  gracePeriodHours?: number;
  autoBlockEnabled?: boolean;
  blockAfterCycles?: number;
  isActive?: boolean;
}

/** POST /api/v1/admin/billing/test/create-debt — request body */
export interface CreateTestDebtInput {
  driverId: string;
  rideCount: number;
  pricePerRide: number;
  generatePixImmediately?: boolean;
}
