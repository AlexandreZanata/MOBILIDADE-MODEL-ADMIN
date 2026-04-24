# POST /api/v1/admin/billing/jobs/billing-cycle/run

**Tag:** Billing Admin  
**Summary:** Run billing cycle job manually  
**Description:** Forces immediate execution of the billing cycle generation job. Normally runs on a schedule defined in the billing configuration; this endpoint triggers it on demand.  
**Authentication:** Bearer token required.

---

## Parameters

None.

---

## Request Body

None.

---

## Responses

### 200 — Job executed successfully

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "jobType": "string",
  "periodStart": "2026-04-24T16:12:41.296Z",
  "periodEnd": "2026-04-24T16:12:41.296Z",
  "driversProcessed": 0,
  "cyclesGenerated": 0,
  "cyclesExpired": 0,
  "driversBlocked": 0,
  "status": "string",
  "errorMessage": "string",
  "startedAt": "2026-04-24T16:12:41.296Z",
  "completedAt": "2026-04-24T16:12:41.296Z",
  "durationMs": 0
}
```

See [POST .../expiration-check/run](./POST-api-v1-admin-billing-jobs-expiration-check-run.md) for the full field reference — both job endpoints return the same `JobExecutionResult` shape.

---

### 409 — Job already running

Another instance of this job is currently executing. Retry after it completes.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "jobType": "string",
  "status": "string",
  "startedAt": "2026-04-24T16:12:41.298Z"
}
```

---

## Frontend Integration Notes

- Called by `billingFacade.runBillingCycleJob()` via `useRunBillingCycleJob` mutation
- On `onSuccess`, invalidate `billingKeys.jobHistory()` to refresh the job history list
- On `409`, display a warning toast: the job is already running — do not retry automatically
- Requires `BILLING_JOBS_RUN` permission — gate with `<Can perform={Permission.BILLING_JOBS_RUN}>`
