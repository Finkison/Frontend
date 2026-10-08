
export type SupportedCurrency = "ETB" | "USD" | "EUR" | "GBP";

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency | string = "ETB"
): string {
  const curr = (currency || "ETB").toUpperCase();
  switch (curr) {
    case "USD":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    case "EUR":
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    case "GBP":
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount);
    case "ETB":
    default:
      return `ETB ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
  }
}

export interface DualDate {
  gregorian: string;
  ethiopian: string;
  combined: string;
}

export function getDualDate(date: Date = new Date()): DualDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth(); // 0-indexed
  const gDay = date.getDate();

  const gFormatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let eYear = gYear - 8;
  if (gMonth > 8 || (gMonth === 8 && gDay >= 11)) {
    eYear = gYear - 7;
  }

  const eMonths = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yakatit",
    "Magabit",
    "Miyazya",
    "Ginbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
  ];

  let monthIdx = (gMonth + 4) % 12;
  const eFormatted = `${eMonths[monthIdx]} ${gDay}, ${eYear} E.C.`;

  return {
    gregorian: gFormatted,
    ethiopian: eFormatted,
    combined: `${gFormatted} (${eFormatted})`,
  };
}
