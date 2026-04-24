# PUT /api/v1/admin/billing/config

**Tag:** Billing Admin  
**Summary:** Update billing configuration  
**Description:** Updates the global billing system configuration. Only provided fields will be updated (partial update).  
**Authentication:** Bearer token required.

---

## Parameters

None.

---

## Request Body

**Content-Type:** `application/json`

Only include the fields you want to update. All fields are optional.

```json
{
  "cycleUnit": "DAYS",
  "cycleInterval": 7,
  "executionTime": "06:00",
  "executionTimezone": "America/Sao_Paulo",
  "pricePerRide": 2,
  "minimumCharge": 0,
  "pixExpirationDays": 3,
  "gracePeriodHours": 24,
  "autoBlockEnabled": true,
  "blockAfterCycles": 1,
  "isActive": true
}
```

| Field               | Type    | Required | Description                                                  |
|---------------------|---------|----------|--------------------------------------------------------------|
| `cycleUnit`         | string  | No       | Billing cycle unit — `MINUTES`, `HOURS`, or `DAYS`          |
| `cycleInterval`     | number  | No       | Number of cycle units between billing runs                   |
| `executionTime`     | string  | No       | Scheduled execution time in `HH:mm` format                   |
| `executionTimezone` | string  | No       | IANA timezone for execution time                             |
| `pricePerRide`      | number  | No       | Amount charged per completed ride (BRL)                      |
| `minimumCharge`     | number  | No       | Minimum charge per billing cycle (BRL)                       |
| `pixExpirationDays` | number  | No       | Days before a generated PIX QR code expires                  |
| `gracePeriodHours`  | number  | No       | Hours after due date before auto-block triggers              |
| `autoBlockEnabled`  | boolean | No       | Whether automatic driver blocking is enabled                 |
| `blockAfterCycles`  | number  | No       | Unpaid cycles before a driver is blocked                     |
| `isActive`          | boolean | No       | Whether the billing configuration is active                  |

---

## Responses

### 200 — Configuration updated successfully

Returns the full updated configuration object.

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "driverId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "cycleUnit": "MINUTES",
  "cycleInterval": 7,
  "executionTime": "06:00",
  "executionTimezone": "America/Sao_Paulo",
  "pricePerRide": 2,
  "minimumCharge": 0,
  "pixExpirationDays": 3,
  "gracePeriodHours": 24,
  "autoBlockEnabled": true,
  "blockAfterCycles": 1,
  "isActive": true,
  "createdAt": "2026-04-24T16:12:41.289Z",
  "updatedAt": "2026-04-24T16:12:41.289Z",
  "intervalDescription": "string"
}
```

See [GET /api/v1/admin/billing/config](./GET-api-v1-admin-billing-config.md) for the full field reference.

---

## Frontend Integration Notes

- Called by `billingFacade.updateConfig()` via `useUpdateBillingConfig` mutation
- On `onSuccess`, invalidate `billingKeys.config()` to refresh the cached configuration
- Requires `BILLING_CONFIG_UPDATE` permission — gate with `<Can perform={Permission.BILLING_CONFIG_UPDATE}>`
