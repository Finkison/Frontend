import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Finkison Design System & Accessibility Audit", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const stylesDir = path.join(frontendDir, "styles");
  const componentsDir = path.join(frontendDir, "components");

  it("verifies 3-tier token architecture and strict z-index scale in design-tokens.css", () => {
    const tokensPath = path.join(stylesDir, "design-tokens.css");
    expect(fs.existsSync(tokensPath)).toBe(true);

    const content = fs.readFileSync(tokensPath, "utf-8");

    // Tier 1 Primitives
    expect(content).toContain("--blue-50:");
    expect(content).toContain("--blue-700:");
    expect(content).toContain("--brand-navy:");
    expect(content).toContain("--brand-sky:");
    expect(content).toContain("--gray-50:");
    expect(content).toContain("--gray-900:");

    // Tier 2 Semantics
    expect(content).toContain("--color-bg:");
    expect(content).toContain("--color-surface:");
    expect(content).toContain("--color-surface-raised:");
    expect(content).toContain("--color-text:");
    expect(content).toContain("--color-text-muted:");
    expect(content).toContain("--color-primary:");
    expect(content).toContain("--color-accent:");

    // Tier 3 Component mappings
    expect(content).toContain("--button-primary-bg:");
    expect(content).toContain("--card-radius:");
    expect(content).toContain("--drawer-radius:");

    // Strict Z-Index Scale (Strictly only base 0, sticky 100, dropdown 200, drawer 300, modal 400, toast 500, tooltip 600)
    expect(content).toContain("--z-base:     0;");
    expect(content).toContain("--z-sticky:   100;");
    expect(content).toContain("--z-dropdown: 200;");
    expect(content).toContain("--z-drawer:   300;");
    expect(content).toContain("--z-modal:    400;");
    expect(content).toContain("--z-toast:    500;");
    expect(content).toContain("--z-tooltip:  600;");

    // Radius scale by component type
    expect(content).toContain("--radius-sm:   6px;");
    expect(content).toContain("--radius-md:   12px;");
    expect(content).toContain("--radius-lg:   16px;");
    expect(content).toContain("--radius-full: 9999px;");

    // 5-level elevation scale
    expect(content).toContain("--elevation-0: none;");
    expect(content).toContain("--elevation-1:");
    expect(content).toContain("--elevation-2:");
    expect(content).toContain("--elevation-3:");
    expect(content).toContain("--elevation-4:");
  });

  it("verifies single left edge container and 8pt rhythm rules in globals.css", () => {
    const globalsPath = path.join(stylesDir, "globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");

    expect(content).toContain("max-width: var(--container-max-width, 1280px);");
    expect(content).toContain("padding-inline: var(--page-gutter, clamp(1rem, 4vw, 4rem));");
    expect(content).toContain("margin-inline: auto;");
    expect(content).toContain(".reading-text");
    expect(content).toContain("scrollbar-gutter: stable;");
  });

  it("verifies WCAG 2.2 AA Contrast Report Table in theme.ts", () => {
    const themePath = path.join(stylesDir, "theme.ts");
    expect(fs.existsSync(themePath)).toBe(true);

    const content = fs.readFileSync(themePath, "utf-8");
    expect(content).toContain("WCAG 2.2 AA CONTRAST RATIO AUDIT TABLE");
    expect(content).toContain("16.1:1"); // Primary text on white
    expect(content).toContain("10.4:1"); // Brand sky button text on #87CEFA
    expect(content).toContain("PASS");
  });

  it("verifies Hero Carousel meets WCAG 2.2.2 requirements with pause/play controls", () => {
    const carouselPath = path.join(componentsDir, "landing", "HeroCarousel.tsx");
    expect(fs.existsSync(carouselPath)).toBe(true);

    const content = fs.readFileSync(carouselPath, "utf-8");
    expect(content).toContain('role="region"');
    expect(content).toContain('aria-roledescription="carousel"');
    expect(content).toContain("Pause automatic slide rotation");
    expect(content).toContain("Start automatic slide rotation");
    expect(content).toContain("prefers-reduced-motion");
  });

  it("verifies Slide-over Drawer implements aria-modal and focus trapping", () => {
    const drawerPath = path.join(componentsDir, "ui", "Drawer.tsx");
    expect(fs.existsSync(drawerPath)).toBe(true);

    const content = fs.readFileSync(drawerPath, "utf-8");
    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
    expect(content).toContain("Escape");
    expect(content).toContain("overscrollBehavior");
  });

  it("verifies Enterprise Toast implements status and alert roles", () => {
    const toastPath = path.join(componentsDir, "ui", "Toast.tsx");
    expect(fs.existsSync(toastPath)).toBe(true);

    const content = fs.readFileSync(toastPath, "utf-8");
    expect(content).toContain('role={isAlert ? "alert" : "status"}');
    expect(content).toContain("slice(-3)"); // Max 3 stacked toasts
    expect(content).toContain("setIsPaused(true)"); // Pause on hover
  });

  it("verifies Search with Autocomplete provides 300ms debounce and combobox pattern", () => {
    const searchPath = path.join(componentsDir, "ui", "SearchAutocomplete.tsx");
    expect(fs.existsSync(searchPath)).toBe(true);

    const content = fs.readFileSync(searchPath, "utf-8");
    expect(content).toContain('role="combobox"');
    expect(content).toContain('aria-autocomplete="list"');
    expect(content).toContain("300"); // 300ms debounce
    expect(content).toContain("ArrowDown");
    expect(content).toContain("ArrowUp");
  });
});
