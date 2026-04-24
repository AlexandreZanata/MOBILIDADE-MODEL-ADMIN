import { Car, Users, Layers, Tag } from "lucide-react";
import { Permission } from "@/models/Permission";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  key: string;
  href: string;
  labelKey: string;
  icon: LucideIcon;
  permission: Permission;
}

export const NAV_ITEMS: NavItem[] = [
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
];
