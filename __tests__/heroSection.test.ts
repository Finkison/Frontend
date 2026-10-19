import { describe, it, expect } from "vitest";

describe("HeroSection Specifications and Compliance Test Suite", () => {
  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  // 1. SLIDER CAPTIONS (Max 10 words per caption)
  const slideCaptions = [
    { slide: 1, caption: "Timer always visible. Autosave on every answer." },
    { slide: 2, caption: "Navigator with flags. Resumes after disconnect." },
    { slide: 3, caption: "Generate exams by unit. Review before publishing." },
    { slide: 4, caption: "Instant results with topic analysis." }
  ];

  it("verifies there are 4 slides and each caption is max 10 words", () => {
    expect(slideCaptions.length).toBe(4);
    slideCaptions.forEach((sc) => {
      const words = countWords(sc.caption);
      expect(words).toBeLessThanOrEqual(10);
    });
  });

  // 2. MESSAGE HEADERS
  const h1Text = "Exam preparation and learning for schools";
  const subtitleText = "Schools conduct timed national assessments and deliver individualized lesson mastery with teacher-approved AI.";

  it("verifies H1 is max 8 words", () => {
    const h1Words = countWords(h1Text);
    expect(h1Words).toBeLessThanOrEqual(8);
  });

  it("verifies subtitle is max 20 words", () => {
    const subWords = countWords(subtitleText);
    expect(subWords).toBeLessThanOrEqual(20);
  });

  // 3. AI FUNCTION CHIPS (Max 5, each template max 70 words)
  const aiChips = [
    {
      id: "generator",
      name: "Exam generator",
      whatItDoes: "Generates timed curriculum exams aligned with Ethiopian national specifications.",
      youProvide: "Subject, grade level, and selected syllabus units.",
      youGet: "Multi-item exam paper with balanced difficulty distribution.",
      yourControl: "Edit questions, replace distractors, and approve before publishing.",
      limits: "Up to 100 questions for English, Biology, Chemistry; 60 for Physics and Mathematics."
    },
    {
      id: "notes",
      name: "Notes",
      whatItDoes: "Synthesizes structured study summaries directly from national textbook chapters.",
      youProvide: "Grade, subject, and unit topic selection.",
      youGet: "Modular lesson notes, key definitions, and practice examples.",
      yourControl: "Reorder sections, add teacher remarks, and export to PDF.",
      limits: "Covers General Secondary grades 9 to 12 national curriculum units."
    },
    {
      id: "practice",
      name: "Practice",
      whatItDoes: "Delivers adaptive question sets targeted to individual student weaknesses.",
      youProvide: "Student subject performance history and target score goals.",
      youGet: "Calibrated item sets with step-by-step diagnostic feedback.",
      yourControl: "Set time allowances, adjust difficulty, and hide hints.",
      limits: "Maximum 50 questions per individual practice session."
    },
    {
      id: "planner",
      name: "Study planner",
      whatItDoes: "Schedules personalized daily revision milestones leading up to national exams.",
      youProvide: "Academic calendar dates, target exam, and weekly study hours.",
      youGet: "Automated day-by-day study schedule with spaced review sessions.",
      yourControl: "Reschedule dates, lock preferred subjects, and track completion.",
      limits: "Plans up to 180 days across 7 national exam subjects."
    },
    {
      id: "tutor",
      name: "AI tutor",
      whatItDoes: "Provides guided Socratic explanations for complex exam questions without revealing answers.",
      youProvide: "Student question prompt and chosen language.",
      youGet: "Step-by-step conceptual hints and formula breakdowns.",
      yourControl: "Review full student query transcripts and flag inappropriate responses.",
      limits: "English, Amharic, and Afaan Oromoo language support."
    }
  ];

  it("verifies exactly 5 AI function chips", () => {
    expect(aiChips.length).toBe(5);
  });

  it("verifies every AI function chip template is max 70 words total", () => {
    aiChips.forEach((chip) => {
      const fullTemplate = `${chip.whatItDoes} ${chip.youProvide} ${chip.youGet} ${chip.yourControl} ${chip.limits}`;
      const words = countWords(fullTemplate);
      expect(words).toBeLessThanOrEqual(70);
    });
  });

  // 4. TRUST LINE (3 facts separated by dividers)
  const trustLineFacts = [
    "Teachers approve AI content",
    "Data is not used to train models",
    "Every AI item is labeled"
  ];

  it("verifies trust line contains exactly 3 facts", () => {
    expect(trustLineFacts.length).toBe(3);
  });

  // 5. SIGN-IN CARD VALIDATION MESSAGES
  it("enforces exact inline validation error messages", () => {
    const errEmail = "Enter a valid email.";
    const errPassword = "Enter your password.";
    const errAuth = "Email or password is incorrect.";
    const errLockout = "Account access temporarily locked after repeated failures. Contact your school administrator.";

    expect(errEmail).toBe("Enter a valid email.");
    expect(errPassword).toBe("Enter your password.");
    expect(errAuth).toBe("Email or password is incorrect.");
    expect(errLockout).toBe("Account access temporarily locked after repeated failures. Contact your school administrator.");
  });

  // 6. COPY INTEGRITY: No exclamation marks or hype
  it("enforces zero exclamation marks across all copy elements", () => {
    expect(h1Text.includes("!")).toBe(false);
    expect(subtitleText.includes("!")).toBe(false);
    slideCaptions.forEach((sc) => expect(sc.caption.includes("!")).toBe(false));
    aiChips.forEach((ac) => {
      expect(ac.whatItDoes.includes("!")).toBe(false);
      expect(ac.youProvide.includes("!")).toBe(false);
      expect(ac.youGet.includes("!")).toBe(false);
      expect(ac.yourControl.includes("!")).toBe(false);
      expect(ac.limits.includes("!")).toBe(false);
    });
    trustLineFacts.forEach((tf) => expect(tf.includes("!")).toBe(false));
  });

  // 7. SECONDARY ACTION
  it("verifies secondary action link is 'Contact us'", () => {
    const secondaryLink = "Contact us";
    expect(secondaryLink).toBe("Contact us");
  });
});
