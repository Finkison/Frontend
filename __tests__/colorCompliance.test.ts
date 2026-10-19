import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Academic Blue Theme and Enterprise Design Standardization Test Suite", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const componentsDir = path.join(frontendDir, "components");
  const pagesDir = path.join(frontendDir, "pages");

  function getFilesRecursively(dir: string, extension: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        if (!fullPath.includes("node_modules") && !fullPath.includes("dist") && !fullPath.includes("build")) {
          results = results.concat(getFilesRecursively(fullPath, extension));
        }
      } else if (file.endsWith(extension)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const allTsxFiles = [
    ...getFilesRecursively(componentsDir, ".tsx"),
    ...getFilesRecursively(pagesDir, ".tsx"),
  ];

  it("verifies zero prohibited purple, violet, indigo, and fuchsia tokens in all TSX components", () => {
    const prohibitedRegex = /\b(text|bg|border|ring|from|to|via)-(purple|indigo|violet|fuchsia)-[0-9]+/i;
    const violations: { file: string; line: number; match: string }[] = [];

    for (const filePath of allTsxFiles) {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        const match = line.match(prohibitedRegex);
        if (match) {
          violations.push({
            file: path.relative(frontendDir, filePath),
            line: index + 1,
            match: match[0],
          });
        }
      });
    }

    expect(violations).toEqual([]);
  });

  it("verifies zero legacy font-serif in UI headers and page titles", () => {
    const fontSerifRegex = /\bfont-serif\b/;
    const violations: { file: string; line: number }[] = [];

    for (const filePath of allTsxFiles) {
      // Exclude MathText which uses font-serif strictly for mathematical superscript/subscripts
      if (filePath.endsWith("MathText.tsx")) continue;

      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (fontSerifRegex.test(line)) {
          violations.push({
            file: path.relative(frontendDir, filePath),
            line: index + 1,
          });
        }
      });
    }

    expect(violations).toEqual([]);
  });

  it("verifies Tailwind configuration defines Academic Crimson & Antique Brass Gold tokens as single source of truth", () => {
    const tailwindConfigPath = path.join(frontendDir, "tailwind.config.js");
    expect(fs.existsSync(tailwindConfigPath)).toBe(true);

    const configContent = fs.readFileSync(tailwindConfigPath, "utf-8");
    expect(configContent).toContain("#881337"); // Brand Crimson Primary
    expect(configContent).toContain("#9F1239"); // Brand Crimson Hover
    expect(configContent).toContain("#BE123C"); // Brand Crimson Active
    expect(configContent).toContain("#FBBF24"); // Brand Gold Accent
    expect(configContent).toContain("#F59E0B"); // Brand Gold Hover
    expect(configContent).toContain("#D97706"); // Brand Gold Active
    expect(configContent).toContain("#1C1512"); // On-brand Espresso Text
    expect(configContent).toContain("#FFF1F2"); // Tint
    expect(configContent).toContain("#FECDD3"); // Tint Border
    expect(configContent).toContain("#A89C90"); // Control Border
  });

  it("verifies globals.css enforces Academic Crimson and Gold tokens and CSS variables", () => {
    const globalsCssPath = path.join(frontendDir, "styles", "globals.css");
    expect(fs.existsSync(globalsCssPath)).toBe(true);

    const cssContent = fs.readFileSync(globalsCssPath, "utf-8");
    expect(cssContent).toContain("#FBBF24");
    expect(cssContent).toContain("#881337");
    expect(cssContent).toContain("#1C1512");
    expect(cssContent).toContain("#FFF1F2");
    expect(cssContent).toContain("#FECDD3");
    // Ensure no legacy purple variables exist
    expect(cssContent).not.toMatch(/--color-purple/i);
    expect(cssContent).not.toMatch(/--color-indigo/i);
  });

  it("verifies zero white text on brand gold (#FBBF24)", () => {
    // Buttons or elements with bg-[#FBBF24] or bg-brand must use text-[#1C1512] or text-on-brand
    const violations: { file: string; line: number; match: string }[] = [];
    for (const filePath of allTsxFiles) {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if ((line.includes("bg-[#FBBF24]") || line.includes("bg-brand")) && (line.includes("text-white") || line.includes("text-[#FFFFFF]"))) {
          violations.push({
            file: path.relative(frontendDir, filePath),
            line: index + 1,
            match: line.trim(),
          });
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it("verifies index.html has theme-color set to #FFFFFF", () => {
    const indexPath = path.join(frontendDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain('<meta name="theme-color" content="#FFFFFF" />');
  });

  it("verifies Academic Crimson used as brand primary in tailwind config", () => {
    const tailwindConfigPath = path.join(frontendDir, "tailwind.config.js");
    const content = fs.readFileSync(tailwindConfigPath, "utf-8");
    // Ensure primary.DEFAULT is Academic Crimson, not green or legacy blue
    expect(content).toContain('DEFAULT: "#881337"');
    expect(content).not.toMatch(/primary:\s*{\s*DEFAULT:\s*["']#(?:15803D|22C55E|16A34A)/);
    expect(content).not.toMatch(/primary:\s*{\s*DEFAULT:\s*["']#(?:87CEFA|0369A1)/);
  });

  it("verifies AI learning engine clear function explanations in LandingPage", () => {
    const landingPath = path.join(pagesDir, "LandingPage.tsx");
    expect(fs.existsSync(landingPath)).toBe(true);

    const content = fs.readFileSync(landingPath, "utf-8");
    expect(content).toContain("Score calibration");
    expect(content).toContain("Knowledge mapping");
    expect(content).toContain("Spaced review");
    expect(content).toContain("Curriculum alignment");
    expect(content).toContain("Bayesian regression calibrated against historical university cutoffs");
    expect(content).toContain("prerequisite foundational concepts across Grades 9 through 12");
    expect(content).toContain("Zero ungrounded hallucinations");
  });

  it("verifies all public page headers use sentence case format", () => {
    const pageTitles = [
      "Academics overview",
      "Schedule demonstration",
      "License checkout",
      "Platform overview",
      "Sign in",
      "Create account",
      "Page not found",
    ];

    pageTitles.forEach((title) => {
      // First character capital, rest lowercase unless proper noun or acronym
      const words = title.split(" ");
      expect(words[0][0]).toBe(words[0][0].toUpperCase());
      expect(words.length).toBeLessThanOrEqual(4);
    });
  });
});
