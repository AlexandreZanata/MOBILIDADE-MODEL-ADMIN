import { resolveApiBase } from "@/lib/apiBase";
import { throwApiError } from "@/lib/http";
import { authFacade } from "@/facades/authFacade";
import type {
  BillingConfig,
  BillingCycle,
  DriverBillingStatus,
  JobExecutionResult,
  TestDebtResult,
} from "@/models/Billing";
import type { UpdateBillingConfigInput, CreateTestDebtInput } from "@/types/billing";

const BASE = () => `${resolveApiBase()}/api/v1/admin/billing`;

export const billingFacade = {
  // ─── Config ────────────────────────────────────────────────────────────────

  /** GET /api/v1/admin/billing/config */
  async getConfig(): Promise<BillingConfig> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/config`);
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<BillingConfig>;
  },

  /** PUT /api/v1/admin/billing/config */
  async updateConfig(input: UpdateBillingConfigInput): Promise<BillingConfig> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<BillingConfig>;
  },

  // ─── Cycles ────────────────────────────────────────────────────────────────

  /** GET /api/v1/admin/billing/cycles/{cycleId} */
  async getCycleDetail(cycleId: string): Promise<BillingCycle> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/cycles/${cycleId}`);
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<BillingCycle>;
  },

  /**
   * POST /api/v1/admin/billing/cycles/{cycleId}/pix
   * Sends an Idempotency-Key header to prevent duplicate PIX generation on retry.
   */
  async generatePix(cycleId: string): Promise<import("@/models/Billing").PixPayment> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/cycles/${cycleId}/pix`, {
      method: "POST",
      headers: { "Idempotency-Key": crypto.randomUUID() },
    });
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<import("@/models/Billing").PixPayment>;
  },

  // ─── Drivers ───────────────────────────────────────────────────────────────

  /** GET /api/v1/admin/billing/drivers/{driverId}/status */
  async getDriverStatus(driverId: string): Promise<DriverBillingStatus> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/drivers/${driverId}/status`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<DriverBillingStatus>;
  },

  /** GET /api/v1/admin/billing/drivers/{driverId}/cycles */
  async getDriverCycles(driverId: string): Promise<BillingCycle[]> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/drivers/${driverId}/cycles`
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<BillingCycle[]>;
  },

  /** POST /api/v1/admin/billing/drivers/{driverId}/unblock */
  async unblockDriver(driverId: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/drivers/${driverId}/unblock`,
      { method: "POST" }
    );
    if (!res.ok) return throwApiError(res);
  },

  // ─── Jobs ──────────────────────────────────────────────────────────────────

  /** GET /api/v1/admin/billing/jobs/history */
  async getJobHistory(): Promise<JobExecutionResult[]> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/jobs/history`);
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<JobExecutionResult[]>;
  },

  /** POST /api/v1/admin/billing/jobs/billing-cycle/run */
  async runBillingCycleJob(): Promise<JobExecutionResult> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/jobs/billing-cycle/run`,
      { method: "POST" }
    );
    // 409 = job already running — still a valid response shape
    if (!res.ok && res.status !== 409) return throwApiError(res);
    return res.json() as Promise<JobExecutionResult>;
  },

  /** POST /api/v1/admin/billing/jobs/expiration-check/run */
  async runExpirationCheck(): Promise<JobExecutionResult> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/jobs/expiration-check/run`,
      { method: "POST" }
    );
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<JobExecutionResult>;
  },

  // ─── Test helpers (dev/staging only) ──────────────────────────────────────

  /**
   * POST /api/v1/admin/billing/test/create-debt
   * Only available when NEXT_PUBLIC_MOCK_MODE=true or in staging.
   * Never call in production.
   */
  async createTestDebt(input: CreateTestDebtInput): Promise<TestDebtResult> {
    const res = await authFacade.fetchWithAuth(`${BASE()}/test/create-debt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return throwApiError(res);
    return res.json() as Promise<TestDebtResult>;
  },

  /**
   * DELETE /api/v1/admin/billing/test/debt/{cycleId}
   * Only available when NEXT_PUBLIC_MOCK_MODE=true or in staging.
   * Never call in production.
   */
  async deleteTestDebt(cycleId: string): Promise<void> {
    const res = await authFacade.fetchWithAuth(
      `${BASE()}/test/debt/${cycleId}`,
      { method: "DELETE" }
    );
    if (!res.ok) return throwApiError(res);
  },
};
