import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { RideStatus } from "@/models/Ride";
import { VehicleStatus } from "@/models/Vehicle";
import { Permission } from "@/models/Permission";
import { UserRole } from "@/models/User";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

describe("RideStatus enum", () => {
  it("contains all expected statuses", () => {
    expect(Object.values(RideStatus)).toContain("CONCLUIDA");
    expect(Object.values(RideStatus)).toContain("CANCELADA_ADMIN");
    expect(Object.values(RideStatus)).toContain("AGUARDANDO_MOTORISTA");
  });
});

describe("VehicleStatus enum", () => {
  it("contains all expected statuses", () => {
    expect(Object.values(VehicleStatus)).toContain("APPROVED");
    expect(Object.values(VehicleStatus)).toContain("REJECTED");
    expect(Object.values(VehicleStatus)).toContain("PENDING_REVIEW");
  });
});

describe("Permission enum", () => {
  it("has no duplicate values", () => {
    const values = Object.values(Permission);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});

describe("ROLE_PERMISSIONS", () => {
  it("ADMIN has all permissions", () => {
    const adminPerms = ROLE_PERMISSIONS[UserRole.ADMIN];
    const allPerms = Object.values(Permission);
    expect(adminPerms).toHaveLength(allPerms.length);
  });

  it("AGENT has fewer permissions than DISPATCHER", () => {
    expect(ROLE_PERMISSIONS[UserRole.AGENT].length).toBeLessThan(
      ROLE_PERMISSIONS[UserRole.DISPATCHER].length
    );
  });

  it("every role has at least one permission", () => {
    Object.values(UserRole).forEach((role) => {
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
    });
  });

  it("property: no role has a permission not in the Permission enum", () => {
    const allPerms = new Set(Object.values(Permission));
    Object.values(UserRole).forEach((role) => {
      ROLE_PERMISSIONS[role].forEach((p) => {
        expect(allPerms.has(p)).toBe(true);
      });
    });
  });
});

describe("property-based: Permission values are non-empty strings", () => {
  it("all permission values are non-empty strings", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.values(Permission)),
        (perm) => typeof perm === "string" && perm.length > 0
      )
    );
  });
});
