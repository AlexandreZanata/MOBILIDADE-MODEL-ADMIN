# GET /api/v1/admin/billing/jobs/history

**Tag:** Billing Admin  
**Summary:** Job execution history  
**Description:** Returns the recent execution history of all billing jobs.  
**Authentication:** Bearer token required.

---

## Parameters

None.

---

## Request Body

None.

---

## Responses

### 200 — History returned successfully

Returns an array of job execution records, ordered by most recent first.

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "jobType": "string",
    "periodStart": "2026-04-24T16:12:41.305Z",
    "periodEnd": "2026-04-24T16:12:41.305Z",
    "driversProcessed": 0,
    "cyclesGenerated": 0,
    "cyclesExpired": 0,
    "driversBlocked": 0,
    "status": "string",
    "errorMessage": "string",
    "startedAt": "2026-04-24T16:12:41.305Z",
    "completedAt": "2026-04-24T16:12:41.305Z",
    "durationMs": 0
  }
]
```

See [POST .../expiration-check/run](./POST-api-v1-admin-billing-jobs-expiration-check-run.md) for the full field reference — each item in the array has the same `JobExecutionResult` shape.

---

## Frontend Integration Notes

- Called by `billingFacade.getJobHistory()` via `useJobHistory` query
- Cache with TanStack Query using `billingKeys.jobHistory()`
- Requires `BILLING_JOBS_VIEW` permission — gate with `<Can perform={Permission.BILLING_JOBS_VIEW}>`
- Refresh after any manual job trigger (`useRunBillingCycleJob`, `useRunExpirationCheck`)
