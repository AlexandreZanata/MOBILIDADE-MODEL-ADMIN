/** Billing cycle unit options */
export type BillingCycleUnit = "MINUTES" | "HOURS" | "DAYS";

/** Billing cycle status */
export type BillingCycleStatus = "PENDING" | "PAID" | "EXPIRED" | "BLOCKED";

/** Global billing system configuration — from GET /api/v1/admin/billing/config */
export interface BillingConfig {
  id: string;
  driverId: string | null;
  cycleUnit: BillingCycleUnit;
  cycleInterval: number;
  executionTime: string;
  executionTimezone: string;
  pricePerRide: number;
  minimumCharge: number;
  pixExpirationDays: number;
  gracePeriodHours: number;
  autoBlockEnabled: boolean;
  blockAfterCycles: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  intervalDescription: string;
}

/** A single billing cycle for a driver */
export interface BillingCycle {
  id: string;
  driverId: string;
  driverName: string;
  periodStart: string;
  periodEnd: string;
  rideCount: number;
  pricePerRide: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: BillingCycleStatus;
  pixGeneratedAt: string | null;
  pixExpiresAt: string | null;
  gracePeriodEndsAt: string | null;
  paidAt: string | null;
  blockedAt: string | null;
  createdAt: string;
}

/** PIX payment details returned by generate-pix and driver status */
export interface PixPayment {
  billingCycleId: string;
  paymentId: string;
  amount: number;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  expiresAt: string;
  externalReference: string;
  generatedAt: string;
}

/** Driver billing status — from GET /api/v1/admin/billing/drivers/{driverId}/status */
export interface DriverBillingStatus {
  driverId: string;
  isBlocked: boolean;
  blockedAt: string | null;
  blockReason: string | null;
  totalDebt: number;
  totalPendingRides: number;
  pendingCyclesCount: number;
  nextDueDate: string | null;
  pendingCycles: BillingCycle[];
  currentPix: PixPayment | null;
  updatedAt: string;
}

/** Job execution result — from POST /api/v1/admin/billing/jobs/{type}/run */
export interface JobExecutionResult {
  id: string;
  jobType: string;
  periodStart: string;
  periodEnd: string;
  driversProcessed: number;
  cyclesGenerated: number;
  cyclesExpired: number;
  driversBlocked: number;
  status: string;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

/** Test debt creation result — from POST /api/v1/admin/billing/test/create-debt */
export interface TestDebtResult {
  cycleId: string;
  driverId: string;
  rideCount: number;
  pricePerRide: number;
  totalAmount: number;
  status: BillingCycleStatus;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  pix: PixPayment | null;
  message: string;
}
