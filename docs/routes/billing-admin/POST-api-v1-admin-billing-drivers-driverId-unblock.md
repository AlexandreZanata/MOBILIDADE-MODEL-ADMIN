# POST /api/v1/admin/billing/drivers/{driverId}/unblock

**Tag:** Billing Admin  
**Summary:** Manually unblock a driver  
**Description:** Removes the billing block from a driver manually. Use with caution — this allows drivers with outstanding debt to resume working.  
**Authentication:** Bearer token required.

---

## Parameters

| Name       | Location | Type   | Required | Description          |
|------------|----------|--------|----------|----------------------|
| `driverId` | path     | string | Yes      | UUID of the driver   |

**Example URL:**

```
POST /api/v1/admin/billing/drivers/3fa85f64-5717-4562-b3fc-2c963f66afa6/unblock
```

---

## Request Body

None.

---

## Responses

### 200 — Driver unblocked successfully

No response body.

---

### 404 — Driver not found or not blocked

No driver exists with the provided `driverId`, or the driver is not currently blocked.

---

## Frontend Integration Notes

- Called by `billingFacade.unblockDriver(driverId)` via `useUnblockDriver` mutation
- On `onSuccess`, invalidate `billingKeys.driverStatus(driverId)` to refresh the driver status
- Requires `BILLING_DRIVER_UNBLOCK` permission — gate with `<Can perform={Permission.BILLING_DRIVER_UNBLOCK}>`
- Always show a `ConfirmDialog` before calling this mutation — the action has financial consequences
