import { describe, it, expect } from "vitest";
import {
  ROLE_NAVIGATION_MANIFEST,
  getNavigationForRole,
  isRouteAllowedForRole,
  QUICK_LINKS_BY_ROLE,
} from "../constants/navigationManifest";

describe("Enterprise RBAC & Zero-Leakage Isolation Test Suite", () => {
  it("should contain complete and strict navigation configs for all enterprise roles", () => {
    expect(ROLE_NAVIGATION_MANIFEST.STUDENT).toBeDefined();
    expect(ROLE_NAVIGATION_MANIFEST.TEACHER).toBeDefined();
    expect(ROLE_NAVIGATION_MANIFEST.PRINCIPAL).toBeDefined();
    expect(ROLE_NAVIGATION_MANIFEST.PARENT).toBeDefined();
    expect(ROLE_NAVIGATION_MANIFEST.ADMIN).toBeDefined();
  });

  describe("STUDENT Role Isolation", () => {
    const studentConfig = getNavigationForRole("STUDENT");

    it("should never contain /school/* or /parent/* routes in primary navigation", () => {
      const allRoutes = studentConfig.primaryNav.flatMap((group) =>
        group.items.map((item) => item.to)
      );

      expect(allRoutes.length).toBeGreaterThan(0);
      allRoutes.forEach((route) => {
        expect(route.startsWith("/school")).toBe(false);
        expect(route.startsWith("/parent")).toBe(false);
      });
    });

    it("should reject access to school and parent portals via isRouteAllowedForRole", () => {
      expect(isRouteAllowedForRole("STUDENT", "/school")).toBe(false);
      expect(isRouteAllowedForRole("STUDENT", "/school/students")).toBe(false);
      expect(isRouteAllowedForRole("STUDENT", "/school/proctor")).toBe(false);
      expect(isRouteAllowedForRole("STUDENT", "/parent")).toBe(false);
      expect(isRouteAllowedForRole("STUDENT", "/parent/alerts")).toBe(false);

      // Allowed student routes
      expect(isRouteAllowedForRole("STUDENT", "/student")).toBe(true);
      expect(isRouteAllowedForRole("STUDENT", "/student/exams")).toBe(true);
      expect(isRouteAllowedForRole("STUDENT", "/student/practice")).toBe(true);
      expect(isRouteAllowedForRole("STUDENT", "/academics")).toBe(true);
    });

    it("should not expose school or parent links in search quick links", () => {
      const links = QUICK_LINKS_BY_ROLE.STUDENT;
      links.forEach((link) => {
        expect(link.url.startsWith("/school")).toBe(false);
        expect(link.url.startsWith("/parent")).toBe(false);
      });
    });
  });

  describe("TEACHER Role Isolation", () => {
    const teacherConfig = getNavigationForRole("TEACHER");

    it("should never contain parent portal or private student study tools in primary navigation", () => {
      const allRoutes = teacherConfig.primaryNav.flatMap((group) =>
        group.items.map((item) => item.to)
      );

      expect(allRoutes.length).toBeGreaterThan(0);
      allRoutes.forEach((route) => {
        expect(route.startsWith("/parent")).toBe(false);
        expect(route.startsWith("/student/study-plan")).toBe(false);
        expect(route.startsWith("/student/battle")).toBe(false);
      });
    });

    it("should reject access to parent portal and private student interactive rooms", () => {
      expect(isRouteAllowedForRole("TEACHER", "/parent")).toBe(false);
      expect(isRouteAllowedForRole("TEACHER", "/student/battle")).toBe(false);
      expect(isRouteAllowedForRole("TEACHER", "/student/session")).toBe(false);
      expect(isRouteAllowedForRole("TEACHER", "/student/study-plan")).toBe(false);

      // Permitted teacher routes
      expect(isRouteAllowedForRole("TEACHER", "/school")).toBe(true);
      expect(isRouteAllowedForRole("TEACHER", "/school/students")).toBe(true);
      expect(isRouteAllowedForRole("TEACHER", "/school/class")).toBe(true);
      expect(isRouteAllowedForRole("TEACHER", "/school/proctor")).toBe(true);
      expect(isRouteAllowedForRole("TEACHER", "/academics")).toBe(true);
    });
  });

  describe("PARENT Role Isolation", () => {
    const parentConfig = getNavigationForRole("PARENT");

    it("should never expose school management or student test rooms in primary navigation", () => {
      const allRoutes = parentConfig.primaryNav.flatMap((group) =>
        group.items.map((item) => item.to)
      );

      expect(allRoutes.length).toBeGreaterThan(0);
      allRoutes.forEach((route) => {
        expect(route.startsWith("/school")).toBe(false);
        expect(route.startsWith("/student/session")).toBe(false);
      });
    });

    it("should reject access to school governance and student exam test rooms", () => {
      expect(isRouteAllowedForRole("PARENT", "/school")).toBe(false);
      expect(isRouteAllowedForRole("PARENT", "/school/proctor")).toBe(false);
      expect(isRouteAllowedForRole("PARENT", "/school/students")).toBe(false);
      expect(isRouteAllowedForRole("PARENT", "/student/session")).toBe(false);
      expect(isRouteAllowedForRole("PARENT", "/student/battle")).toBe(false);

      // Permitted parent routes
      expect(isRouteAllowedForRole("PARENT", "/parent")).toBe(true);
      expect(isRouteAllowedForRole("PARENT", "/parent/alerts")).toBe(true);
      expect(isRouteAllowedForRole("PARENT", "/parent/messages")).toBe(true);
      expect(isRouteAllowedForRole("PARENT", "/academics")).toBe(true);
    });
  });

  describe("ADMIN Role Privileges", () => {
    it("should allow admin access across system components", () => {
      expect(isRouteAllowedForRole("ADMIN", "/school")).toBe(true);
      expect(isRouteAllowedForRole("ADMIN", "/school/settings")).toBe(true);
      expect(isRouteAllowedForRole("ADMIN", "/academics")).toBe(true);
    });
  });
});
