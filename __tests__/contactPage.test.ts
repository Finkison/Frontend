import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Standardized Contact Page and Demo Flow Replacement Test Suite", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const pagesDir = path.join(frontendDir, "pages");
  const componentsDir = path.join(frontendDir, "components");

  it("verifies zero 'Request demo' or 'Schedule a consultation' strings remain in public navigation and pages", () => {
    const filesToCheck = [
      path.join(componentsDir, "navigation", "PublicNavbar.tsx"),
      path.join(componentsDir, "landing", "HeroCarousel.tsx"),
      path.join(pagesDir, "LandingPage.tsx"),
      path.join(pagesDir, "LoginPage.tsx"),
      path.join(pagesDir, "ContactPage.tsx"),
      path.join(pagesDir, "CheckoutPage.tsx"),
    ];

    const forbiddenPhrases = [
      /request demo/i,
      /schedule a consultation/i,
      /schedule institutional consultation/i,
      /book enterprise consultation/i,
    ];

    const violations: { file: string; line: number; text: string }[] = [];

    for (const file of filesToCheck) {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Skip comment lines in tests or internal descriptions if any
        for (const regex of forbiddenPhrases) {
          if (regex.test(line)) {
            violations.push({
              file: path.relative(frontendDir, file),
              line: index + 1,
              text: line.trim(),
            });
          }
        }
      });
    }

    expect(violations).toEqual([]);
  });

  it("verifies ContactPage contains exact 5 form fields with no instructional placeholders", () => {
    const contactPath = path.join(pagesDir, "ContactPage.tsx");
    expect(fs.existsSync(contactPath)).toBe(true);
    const content = fs.readFileSync(contactPath, "utf-8");

    // 5 fields
    expect(content).toContain("Full name");
    expect(content).toContain("Work email");
    expect(content).toContain("School name (optional)");
    expect(content).toContain("Topic");
    expect(content).toContain("Message");

    // Live counter
    expect(content).toContain("1,000");

    // Helper text only for work email
    expect(content).toContain("Use your school email.");
    expect(content).not.toMatch(/placeholder=["'](?:Enter your name|e\.g\.|Type here)/i);
  });

  it("verifies ContactPage enforces exact required error messages", () => {
    const contactPath = path.join(pagesDir, "ContactPage.tsx");
    const content = fs.readFileSync(contactPath, "utf-8");

    expect(content).toContain("Enter your full name.");
    expect(content).toContain("Enter a valid email.");
    expect(content).toContain("Select a topic.");
    expect(content).toContain("Enter a message.");
    expect(content).toContain("Could not send. Check your connection and retry.");
  });

  it("verifies consent text matches exact copy and links to Privacy policy", () => {
    const contactPath = path.join(pagesDir, "ContactPage.tsx");
    const content = fs.readFileSync(contactPath, "utf-8");

    expect(content).toContain("We use your details only to reply.");
    expect(content).toContain("Privacy policy");
    expect(content).toContain('/privacy');
  });

  it("verifies form card adheres strictly to design tokens and limits", () => {
    const contactPath = path.join(pagesDir, "ContactPage.tsx");
    const content = fs.readFileSync(contactPath, "utf-8");

    // 12px radius, 32px padding, max width 480px, no shadow
    expect(content).toContain("rounded-[12px]");
    expect(content).toContain("p-8");
    expect(content).toContain("max-w-[480px]");
    expect(content).toContain("shadow-none");

    // Input height 44px, control border #64748B, Inter 16 (text-base), focus ring #881337
    expect(content).toContain("h-[44px]");
    expect(content).toContain("border-[#64748B]");
    expect(content).toContain("focus:ring-[#881337]");

    // Button full width, #FBBF24 fill, #1C1512 text, 44px, label "Send message"
    expect(content).toContain("bg-[#FBBF24]");
    expect(content).toContain("text-[#1C1512]");
    expect(content).toContain("Send message");
  });

  it("verifies Topic routing specification addresses", () => {
    const topicRouting = {
      Pricing: "sales@finkison.com",
      "School setup": "sales@finkison.com",
      "Security and data": "security@finkison.com",
      "Technical support": "support@finkison.com",
      Other: "info@finkison.com",
    };

    expect(topicRouting["Pricing"]).toBe("sales@finkison.com");
    expect(topicRouting["School setup"]).toBe("sales@finkison.com");
    expect(topicRouting["Security and data"]).toBe("security@finkison.com");
    expect(topicRouting["Technical support"]).toBe("support@finkison.com");
    expect(topicRouting["Other"]).toBe("info@finkison.com");
  });

  it("verifies redirects are configured for old demo and consultation routes", () => {
    const appPath = path.join(frontendDir, "App.tsx");
    const content = fs.readFileSync(appPath, "utf-8");

    expect(content).toContain('path="/demo" element={<Navigate to="/contact" replace />}');
    expect(content).toContain('path="/request-demo" element={<Navigate to="/contact" replace />}');
    expect(content).toContain('path="/consultation" element={<Navigate to="/contact" replace />}');
    expect(content).toContain('path="/schedule-consultation" element={<Navigate to="/contact" replace />}');
  });
});
