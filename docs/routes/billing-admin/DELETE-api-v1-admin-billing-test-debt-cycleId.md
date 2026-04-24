# DELETE /api/v1/admin/billing/test/debt/{cycleId}

**Tag:** Billing Admin  
**Summary:** Delete test debt  
**Description:** Deletes a billing cycle and all associated payments. Useful for cleaning up test data.

> ⚠️ **Development / Staging only.** This endpoint must never be called in production. Gate it behind an environment check in the facade layer.

**Authentication:** Bearer token required (`Authorization: Bearer <accessToken>`).

---

## Parameters

| Name      | Location | Type   | Required | Description                 |
|-----------|----------|--------|----------|-----------------------------|
| `cycleId` | path     | string | Yes      | UUID of the cycle to delete |

**Example URL:**

```
DELETE /api/v1/admin/billing/test/debt/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

---

## Request Body

None.

---

## Responses

### 204 — Debt deleted successfully

No response body.

---

### 400 — Bad Request

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

| Field           | Type   | Description                                     |
|-----------------|--------|-------------------------------------------------|
| `error.message` | string | Human-readable error description                |
| `error.code`    | string | Machine-readable error code                     |
| `error.fields`  | object | Map of field names to validation error messages |

---

### 401 — Unauthorized

Missing or invalid Bearer token.

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

---

### 403 — Forbidden

Authenticated user does not have the required role or permission.

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

---

### 404 — Cycle not found

No billing cycle exists with the provided `cycleId`.

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

---

### 422 — Validation Error

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

---

### 500 — Internal Server Error

**Content-Type:** `application/json`

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "fields": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  }
}
```

---

## Error Envelope Reference

All error responses share the same envelope shape:

| Field           | Type   | Description                                     |
|-----------------|--------|-------------------------------------------------|
| `error.message` | string | Human-readable error description                |
| `error.code`    | string | Machine-readable error code                     |
| `error.fields`  | object | Map of field names to validation error messages |

---

## Frontend Integration Notes

- Only render the UI for this endpoint when `process.env.NEXT_PUBLIC_MOCK_MODE === "true"` or in a staging environment
- Called by `billingFacade.deleteTestDebt(cycleId)` via `useDeleteTestDebt` mutation
- On `onSuccess`, invalidate `billingKeys.driverCycles(driverId)` and `billingKeys.driverStatus(driverId)`
- Requires `BILLING_TEST_DELETE` permission — gate with `<Can perform={Permission.BILLING_TEST_DELETE}>`
- Always show a `ConfirmDialog` before calling this mutation
- On `401`, the facade layer triggers the token refresh flow automatically
