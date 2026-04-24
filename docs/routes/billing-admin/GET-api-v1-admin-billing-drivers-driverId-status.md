# GET /api/v1/admin/billing/drivers/{driverId}/status

**Tag:** Billing Admin  
**Summary:** Driver billing status  
**Description:** Returns the complete billing status for a specific driver, including block state, total debt, pending cycles, and the current active PIX payment.  
**Authentication:** Bearer token required.

---

## Parameters

| Name       | Location | Type   | Required | Description        |
|------------|----------|--------|----------|--------------------|
| `driverId` | path     | string | Yes      | UUID of the driver |

**Example URL:**

```
GET /api/v1/admin/billing/drivers/3fa85f64-5717-4562-b3fc-2c963f66afa6/status
```

---

## Request Body

None.

---

## Responses

### 200 — Status returned successfully

```json
{
  "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "isBlocked": true,
  "blockedAt": "2026-04-24T16:12:41.307Z",
  "blockReason": "string",
  "totalDebt": 0,
  "totalPendingRides": 0,
  "pendingCyclesCount": 0,
  "nextDueDate": "2026-04-24T16:12:41.307Z",
  "pendingCycles": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "driverName": "string",
      "periodStart": "2026-04-24T16:12:41.307Z",
      "periodEnd": "2026-04-24T16:12:41.307Z",
      "rideCount": 0,
      "pricePerRide": 0,
      "totalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "status": "PENDING",
      "pixGeneratedAt": "2026-04-24T16:12:41.307Z",
      "pixExpiresAt": "2026-04-24T16:12:41.307Z",
      "gracePeriodEndsAt": "2026-04-24T16:12:41.307Z",
      "paidAt": "2026-04-24T16:12:41.307Z",
      "blockedAt": "2026-04-24T16:12:41.307Z",
      "createdAt": "2026-04-24T16:12:41.307Z"
    }
  ],
  "currentPix": {
    "billingCycleId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "paymentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "amount": 0,
    "qrCode": "string",
    "qrCodeBase64": "string",
    "copyPaste": "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000...",
    "expiresAt": "2026-04-24T16:12:41.307Z",
    "externalReference": "string",
    "generatedAt": "2026-04-24T16:12:41.307Z"
  },
  "updatedAt": "2026-04-24T16:12:41.307Z"
}
```

| Field               | Type    | Description                                              |
|---------------------|---------|----------------------------------------------------------|
| `driverId`          | string  | UUID of the driver                                       |
| `isBlocked`         | boolean | Whether the driver is currently blocked                  |
| `blockedAt`         | string  | ISO 8601 timestamp when the driver was blocked (nullable)|
| `blockReason`       | string  | Human-readable reason for the block (nullable)           |
| `totalDebt`         | number  | Total outstanding debt in BRL                            |
| `totalPendingRides` | number  | Total rides across all pending cycles                    |
| `pendingCyclesCount`| number  | Number of unpaid billing cycles                          |
| `nextDueDate`       | string  | ISO 8601 date of the next payment due (nullable)         |
| `pendingCycles`     | array   | List of pending billing cycle objects                    |
| `currentPix`        | object  | Active PIX payment details (nullable)                    |
| `updatedAt`         | string  | ISO 8601 timestamp of the last status update             |

---

### 404 — Driver not found

No driver exists with the provided `driverId`.

---

## Frontend Integration Notes

- Called by `billingFacade.getDriverStatus(driverId)` via `useDriverBillingStatus` query
- Cache with TanStack Query using `billingKeys.driverStatus(driverId)`
- Requires `BILLING_DRIVER_VIEW` permission — gate with `<Can perform={Permission.BILLING_DRIVER_VIEW}>`
- Invalidate after `useUnblockDriver`, `useGeneratePix`, or any mutation that affects driver state
