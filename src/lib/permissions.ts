import { Permission } from "@/models/Permission";
import { UserRole } from "@/models/User";

/** Maps each role to its allowed permissions. */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),

  [UserRole.SUPERVISOR]: [
    Permission.RIDE_ADMIN_VIEW,
    Permission.PASSENGER_ADMIN_VIEW,
    Permission.VEHICLE_ADMIN_VIEW,
    Permission.VEHICLE_ADMIN_UPDATE,
    Permission.VEHICLE_REFERENCE_VIEW,
    Permission.SERVICE_CATEGORY_VIEW,
    Permission.BILLING_CONFIG_VIEW,
    Permission.BILLING_DRIVER_VIEW,
    Permission.BILLING_PIX_GENERATE,
    Permission.BILLING_JOBS_VIEW,
  ],

  [UserRole.DISPATCHER]: [
    Permission.RIDE_ADMIN_VIEW,
    Permission.RIDE_ADMIN_UPDATE,
    Permission.RIDE_ADMIN_CANCEL,
    Permission.VEHICLE_ADMIN_VIEW,
  ],

  [UserRole.AGENT]: [
    Permission.RIDE_ADMIN_VIEW,
  ],
};
