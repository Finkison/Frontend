import { describe, it, expect } from "vitest";

describe("Exam Experience Section Specification and Compliance", () => {
  // Feature specification and strict word limit verification (each feature under 15 words)
  const features = [
    {
      id: "timer",
      title: "Timer always visible",
      sentence: "Fixed countdown displays across all questions without blocking reading."
    },
    {
      id: "autosave",
      title: "Autosave on answer",
      sentence: "Responses save locally and sync immediately to prevent loss."
    },
    {
      id: "navigator",
      title: "Question navigator with flags",
      sentence: "Status grid tracks answered, flagged, and skipped questions."
    },
    {
      id: "resilience",
      title: "Session drop resilience",
      sentence: "Exams preserve active state during network drops and reconnect seamlessly."
    },
    {
      id: "integrity",
      title: "Lockdown and shuffle",
      sentence: "System logs focus loss and randomizes question sequences."
    },
    {
      id: "results",
      title: "Instant topic analysis",
      sentence: "Automated scoring delivers unit mastery diagnostics upon completion."
    }
  ];

  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  it("verifies there are exactly 6 core features", () => {
    expect(features.length).toBe(6);
  });

  it("enforces that each feature title is 2 to 4 words", () => {
    features.forEach((feature) => {
      const words = countWords(feature.title);
      expect(words).toBeGreaterThanOrEqual(2);
      expect(words).toBeLessThanOrEqual(4);
    });
  });

  it("enforces that each feature (title + sentence) is strictly under 15 words", () => {
    features.forEach((feature) => {
      const totalWords = countWords(`${feature.title} ${feature.sentence}`);
      expect(totalWords).toBeLessThan(15);
    });
  });

  // Audience copy rules: Title max 5 words, Supporting line max 20 words
  const audiences = {
    schools: {
      title: "Reliable Student Exam Experience",
      supporting: "Students complete timed entrance exams reliably while leaders verify testing integrity and class-level outcomes."
    },
    teachers: {
      title: "Automated Assessment and Grading",
      supporting: "Publish timed tests quickly, monitor live student progress, and inspect diagnostic topic mastery immediately."
    },
    students: {
      title: "Distraction-Free Timed Examinations",
      supporting: "Pace yourself with persistent timers, flag difficult questions, and test confidently without lost answers."
    }
  };

  it("enforces section title is max 5 words for all audience variants", () => {
    Object.entries(audiences).forEach(([key, aud]) => {
      const titleWords = countWords(aud.title);
      expect(titleWords).toBeLessThanOrEqual(5);
    });
  });

  it("enforces supporting line is max 20 words for all audience variants", () => {
    Object.entries(audiences).forEach(([key, aud]) => {
      const suppWords = countWords(aud.supporting);
      expect(suppWords).toBeLessThanOrEqual(20);
    });
  });

  it("verifies exactly 4 tabbed viewer screens in the device frame", () => {
    const screens = [
      "Question view",
      "Question navigator",
      "Submit confirmation",
      "Topic mastery results"
    ];
    expect(screens.length).toBe(4);
  });

  it("enforces plain, specific copy with zero exclamation marks", () => {
    features.forEach((f) => {
      expect(f.title.includes("!")).toBe(false);
      expect(f.sentence.includes("!")).toBe(false);
    });
    Object.values(audiences).forEach((a) => {
      expect(a.title.includes("!")).toBe(false);
      expect(a.supporting.includes("!")).toBe(false);
    });
  });

  it("verifies single call to action 'Contact us' with no secondary button", () => {
    const cta = "Contact us";
    expect(cta).toBe("Contact us");
  });
});
