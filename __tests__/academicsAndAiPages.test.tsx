import React from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { describe, it, expect, afterEach } from "vitest";
import en from "../i18n/en.json";
import { MarketingPageHero } from "../components/landing/MarketingPageHero";
import { MarketingSteps } from "../components/landing/MarketingSections";

describe("Public learning experience", () => {
  const roots: Array<{ root: Root; container: HTMLDivElement }> = [];

  afterEach(() => {
    roots.forEach(({ root, container }) => {
      flushSync(() => root.unmount());
      container.remove();
    });
    roots.length = 0;
  });

  function render(element: React.ReactElement): HTMLDivElement {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    roots.push({ root, container });
    flushSync(() => root.render(element));
    return container;
  }

  it("positions Finkison as ongoing learning, not only exam preparation", () => {
    expect(en.public.hero.title).toContain("Learn");
    expect(en.public.hero.description).toContain("beyond exam prep");
    expect(en.public.marketing.home.journeyDescription).toContain("all year");
    expect(en.public.home.scienceDescription).toContain("interactive activities");
  });

  it("states the vision as an aspiration without promising an outcome", () => {
    const vision = en.public.marketing.about.visionBody.toLowerCase();
    expect(vision).toContain("every student");
    expect(vision).toContain("highest results");
    expect(vision).toContain("capable of");
    expect(vision).not.toContain("guarantee");
  });

  it("renders a shared page hero with one H1 and a labelled value panel", () => {
    const container = render(
      <MarketingPageHero
        eyebrow="For students"
        title="Study with purpose"
        description="Learn, practise, and review."
        panelTitle="Your learning flow"
        panelItems={["Explore topics", "Review solutions"]}
      />
    );

    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("h1")?.textContent).toBe("Study with purpose");
    expect(container.querySelector('aside[aria-label="Your learning flow"]')).not.toBeNull();
    expect(container.textContent).toContain("Explore topics");
    expect(container.textContent).toContain("Review solutions");
  });

  it("connects each step card to its section heading and keeps content compact", () => {
    const container = render(
      <MarketingSteps
        id="journey-title"
        title="A learning journey"
        description="A sequence of clear next steps."
        items={[
          { title: "Learn", description: "Study the topic." },
          { title: "Practise", description: "Check your understanding." },
        ]}
      />
    );

    const section = container.querySelector('section[aria-labelledby="journey-title"]');
    expect(section).not.toBeNull();
    expect(section?.querySelectorAll("article")).toHaveLength(2);
    expect(section?.querySelector("#journey-title h2")?.textContent).toContain("A learning journey");
    expect(section?.textContent).toContain("Practise");
  });
});
