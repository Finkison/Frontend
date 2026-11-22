import {
  ROLE_NAVIGATION_MAP,
  type RoleNavigationConfig as PortalNavigationConfig,
} from "../components/navigation/navigationConfig";
import { canAccessPortal, type PortalArea } from "./routes";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: string;
  description?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface RoleNavigationConfig {
  portalTitle: string;
  homeRoute: string;
  primaryNav: NavGroup[];
  quickActions: NavItem[];
}

function adaptItems(items: PortalNavigationConfig["primaryNav"]): NavItem[] {
  return items.map((item) => ({
    id: item.id,
    label: item.labelKey,
    to: item.to,
    icon: item.id,
  }));
}

function adaptNavigation(config: PortalNavigationConfig): RoleNavigationConfig {
  const primaryItems = adaptItems(config.primaryNav);
  const secondaryItems = adaptItems(config.secondaryNav.items);

  return {
    portalTitle: config.roleNameKey,
    homeRoute: primaryItems[0]?.to ?? "/",
    primaryNav: [
      { id: "primary", title: "primary", items: primaryItems },
      ...(secondaryItems.length
        ? [{ id: "secondary", title: config.secondaryNav.groupTitleKey ?? "secondary", items: secondaryItems }]
        : []),
    ],
    quickActions: adaptItems(config.bottomItems),
  };
}

const schoolNavigation = adaptNavigation(ROLE_NAVIGATION_MAP.SCHOOL_ADMIN);

/** Compatibility view generated from the navigation used by the application shell. */
export const ROLE_NAVIGATION_MANIFEST: Record<string, RoleNavigationConfig> = {
  STUDENT: adaptNavigation(ROLE_NAVIGATION_MAP.STUDENT),
  TEACHER: adaptNavigation(ROLE_NAVIGATION_MAP.TEACHER),
  PRINCIPAL: schoolNavigation,
  SCHOOL_ADMIN: schoolNavigation,
  SUPER_ADMIN: schoolNavigation,
  PARENT: adaptNavigation(ROLE_NAVIGATION_MAP.PARENT),
  ADMIN: schoolNavigation,
};

export function getNavigationForRole(role?: string): RoleNavigationConfig {
  return ROLE_NAVIGATION_MANIFEST[(role || "STUDENT").toUpperCase()] ?? ROLE_NAVIGATION_MANIFEST.STUDENT;
}

export const QUICK_LINKS_BY_ROLE: Record<string, Array<{ label: string; url: string; icon: string }>> =
  Object.fromEntries(
    Object.entries(ROLE_NAVIGATION_MANIFEST).map(([role, config]) => {
      const items = [...config.primaryNav.flatMap((group) => group.items), ...config.quickActions];
      return [role, items.map((item) => ({ label: item.label, url: item.to, icon: item.icon }))];
    })
  );

export function isRouteAllowedForRole(role: string = "STUDENT", path: string): boolean {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return false;

  const portal = pathname.split("/")[1]?.toLowerCase();
  if (portal && ["student", "parent", "school", "teacher"].includes(portal)) {
    return canAccessPortal(role, portal as PortalArea);
  }

  return true;
}
