import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Dedicated Academics and AI Features Architecture Test Suite", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const pagesDir = path.join(frontendDir, "pages");
  const componentsDir = path.join(frontendDir, "components");

  it("verifies /ai-features and /academics are distinct pages with dedicated routes in App.tsx", () => {
    const appPath = path.join(frontendDir, "App.tsx");
    const content = fs.readFileSync(appPath, "utf-8");

    expect(content).toContain('path="/ai-features"');
    expect(content).toContain('path="/academics"');
    expect(content).toContain('path="/subjects"');
    expect(content).toContain("AiFeaturesPage");
    expect(content).toContain("AcademicsPage");
  });

  it("verifies PublicNavbar links AI features to /ai-features and Academics to /academics", () => {
    const navbarPath = path.join(componentsDir, "navigation", "PublicNavbar.tsx");
    const content = fs.readFileSync(navbarPath, "utf-8");

    expect(content).toContain('to="/ai-features"');
    expect(content).toContain('to="/academics"');
    // Verifies neither links to generic fragment anchors on the same page
    expect(content).not.toContain('to="/academics#ai-features"');
    expect(content).not.toContain('to="/academics#subjects"');
  });

  it("verifies the home page hero contains zero raw sign-in forms", () => {
    const heroPath = path.join(componentsDir, "landing", "HeroCarousel.tsx");
    const content = fs.readFileSync(heroPath, "utf-8");

    // Zero login forms in the hero
    expect(content).not.toContain("Sign in to portal");
    expect(content).not.toContain('type="password"');
    expect(content).not.toContain("Institutional email");
    expect(content).not.toContain("Remember this device");

    // Has live telemetry preview and clean CTAs
    expect(content).toContain("Contact us");
    expect(content).toContain("Explore academics");
    expect(content).toContain("Tier-3 Addis Ababa");
    expect(content).toContain("Score Forecast");
  });

  it("verifies AcademicsPage structures Grades 9-12 with challenges, how we support, and what they get", () => {
    const academicsPath = path.join(pagesDir, "AcademicsPage.tsx");
    const content = fs.readFileSync(academicsPath, "utf-8");

    // Covers Grades 9, 10, 11, and 12
    expect(content).toContain("Grade 9");
    expect(content).toContain("Grade 10");
    expect(content).toContain("Grade 11");
    expect(content).toContain("Grade 12");

    // Key pedagogical sections
    expect(content).toContain("How Finkison supports Grade");
    expect(content).toContain("What students and schools receive");
    expect(content).toContain("What Grade");
    expect(content).toContain("What School Leadership");
    expect(content).toContain("Interactive visual science simulations");
    expect(content).toContain("Grades 9–12 comparative academic progression");
  });

  it("verifies AiFeaturesPage provides detailed specifications for all 6 models with zero hallucinations guarantee", () => {
    const aiPath = path.join(pagesDir, "AiFeaturesPage.tsx");
    const content = fs.readFileSync(aiPath, "utf-8");

    expect(content).toContain("Score calibration");
    expect(content).toContain("Knowledge mapping");
    expect(content).toContain("Spaced review engine");
    expect(content).toContain("Curriculum alignment");
    expect(content).toContain("Exam generation");
    expect(content).toContain("Proctoring telemetry");
    expect(content).toContain("Zero Ungrounded Hallucinations");
    expect(content).toContain("Domestic Addis Ababa Tier-3 Hosting");
  });
});
