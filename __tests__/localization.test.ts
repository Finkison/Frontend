import { describe, it, expect } from "vitest";
import { formatCurrency, getDualDate } from "../utils/localization";

describe("Internationalization & Localization Test Suite", () => {
  describe("Multi-Currency Formatter", () => {
    it("should format Ethiopian Birr (ETB) with standard domestic notation", () => {
      const formatted = formatCurrency(450, "ETB");
      expect(formatted).toBe("ETB 450.00");
    });

    it("should format US Dollars (USD) with standard international notation", () => {
      const formatted = formatCurrency(24.99, "USD");
      expect(formatted).toContain("24.99");
      expect(formatted).toContain("$");
    });

    it("should format Euros (EUR) properly", () => {
      const formatted = formatCurrency(19.99, "EUR");
      expect(formatted).toMatch(/19[,.]99/);
      expect(formatted).toContain("€");
    });

    it("should default to ETB when currency is unspecified", () => {
      const formatted = formatCurrency(150);
      expect(formatted).toBe("ETB 150.00");
    });
  });

  describe("Dual-Calendar Engine (Gregorian & Ethiopian)", () => {
    it("should produce both Gregorian and Ethiopian calendar dates", () => {
      const testDate = new Date(2026, 9, 2); // Oct 2, 2026
      const dual = getDualDate(testDate);

      expect(dual.gregorian).toContain("2026");
      expect(dual.ethiopian).toContain("E.C.");
      expect(dual.combined).toContain("2026");
      expect(dual.combined).toContain("E.C.");
    });
  });
});
