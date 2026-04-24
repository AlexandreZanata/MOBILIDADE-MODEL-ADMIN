import { LayoutDashboard, Car, Users, Layers, Tag, ShieldCheck } from "lucide-react";
import { Permission } from "@/models/Permission";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  /** Permission required to see this nav item. null = always visible. */
  permission: Permission | null;
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    labelKey: "nav:dashboard",
    icon: LayoutDashboard,
    permission: null, // visible to all authenticated users
  },
  {
    key: "rides",
    href: "/rides",
    labelKey: "nav:rides",
    icon: Car,
    permission: Permission.RIDE_ADMIN_VIEW,
  },
  {
    key: "passengers",
    href: "/passengers",
    labelKey: "nav:passengers",
    icon: Users,
    permission: Permission.PASSENGER_ADMIN_VIEW,
  },
  {
    key: "vehicles",
    href: "/vehicles",
    labelKey: "nav:vehicles",
    icon: Car,
    permission: Permission.VEHICLE_ADMIN_VIEW,
  },
  {
    key: "vehicleReference",
    href: "/vehicle-reference",
    labelKey: "nav:vehicleReference",
    icon: Layers,
    permission: Permission.VEHICLE_REFERENCE_VIEW,
  },
  {
    key: "serviceCategories",
    href: "/service-categories",
    labelKey: "nav:serviceCategories",
    icon: Tag,
    permission: Permission.SERVICE_CATEGORY_VIEW,
  },
  {
    key: "vehicleCategoryRequirements",
    href: "/vehicle-category-requirements",
    labelKey: "nav:vehicleCategoryRequirements",
    icon: ShieldCheck,
    permission: Permission.VEHICLE_ADMIN_VIEW,
  },
];
