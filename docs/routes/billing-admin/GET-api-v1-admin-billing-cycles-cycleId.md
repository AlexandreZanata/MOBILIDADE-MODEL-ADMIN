# GET /api/v1/admin/billing/cycles/{cycleId}

**Tag:** Billing Admin  
**Summary:** Billing cycle details  
**Description:** Returns the details of a specific billing cycle.  
**Authentication:** Bearer token required.

---

## Parameters

| Name      | Location | Type   | Required | Description               |
|-----------|----------|--------|----------|---------------------------|
| `cycleId` | path     | string | Yes      | UUID of the billing cycle |

**Example URL:**

```
GET /api/v1/admin/billing/cycles/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

---

## Request Body

None.

---

## Responses

### 200 — Cycle returned successfully

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "driverName": "string",
  "periodStart": "2026-04-24T16:12:41.313Z",
  "periodEnd": "2026-04-24T16:12:41.313Z",
  "rideCount": 0,
  "pricePerRide": 0,
  "totalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "status": "PENDING",
  "pixGeneratedAt": "2026-04-24T16:12:41.313Z",
  "pixExpiresAt": "2026-04-24T16:12:41.313Z",
  "gracePeriodEndsAt": "2026-04-24T16:12:41.313Z",
  "paidAt": "2026-04-24T16:12:41.313Z",
  "blockedAt": "2026-04-24T16:12:41.313Z",
  "createdAt": "2026-04-24T16:12:41.313Z"
}
```

See [GET .../drivers/{driverId}/cycles](./GET-api-v1-admin-billing-drivers-driverId-cycles.md) for the full field reference — the object shape is identical.

---

### 404 — Cycle not found

No billing cycle exists with the provided `cycleId`.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "PENDING"
}
```

---

## Frontend Integration Notes

- Called by `billingFacade.getCycleDetail(cycleId)` via `useCycleDetail` query
- Cache with TanStack Query using `billingKeys.cycleDetail(cycleId)`
- Requires `BILLING_DRIVER_VIEW` permission — gate with `<Can perform={Permission.BILLING_DRIVER_VIEW}>`
- Invalidate after `useGeneratePix` for this specific cycle
