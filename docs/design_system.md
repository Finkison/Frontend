# 🎨 Design System & Accessibility Specification

This document defines the visual hierarchy, token architecture, and accessibility standards for the Finkison web client.

---

## 1. Core Visual Identity: Academic Authority

Finkison's color system is specifically curated for scholarly focus and high-stakes examination clarity:

| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| **Academic Crimson** | `#881337` | Scholarly authority, institution headers, primary interactive buttons. |
| **Deep Bordeaux** | `#4C0519` | Hero backgrounds, footer headers, and brand anchors. |
| **Antique Brass Gold** | `#FBBF24` | Achievements, badges, high-intent highlights (paired with `#1C1512` for WCAG AAA). |
| **Warm Stone Ivory** | `#FAF8F5` | Neutral reading canvas, exam backgrounds, eliminating harsh glare. |
| **Espresso Dark** | `#1C1512` | High-contrast body typography and dark surface backgrounds. |
| **Academic Emerald** | `#059669` | Passing grades, verified curriculum badges, positive proctoring status. |

---

## 2. Layout Rule: The Single Left Edge

> **Everything hangs from ONE left edge.**  
> Logo, navigation links, section eyebrows, H1/H2 headlines, descriptions, card grids, and footer columns align to the exact same container boundary. No subcomponent may invent custom horizontal offsets.

```css
.container {
  width: 100%;
  max-width: var(--container-max-width, 1280px);
  margin-inline: auto;
  padding-inline: var(--page-gutter, clamp(1rem, 4vw, 4rem));
}
```

---

## 3. Typography & Micro-Animations

- **Font Sans**: Inter / modern sans-serif in strict sentence case across all headings, labels, and buttons.
- **Font Mono**: For candidate roll numbers, exam item numbers, and IRT psychometric formulas.
- **Micro-Animations**:
  - `prefers-reduced-motion` is strictly respected across all sliders and transitions.
  - Hover durations capped between `150ms` and `250ms` to maintain snappy responsiveness.

---

## 4. Accessibility (WCAG 2.2 Level AA)

1. **Touch Targets**: All interactive elements (buttons, tabs, inputs) maintain a minimum clickable area of 44×44px.
2. **Color Contrast**: 
   - Normal text: $\ge 4.5:1$ contrast ratio.
   - Large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$): $\ge 3:1$ contrast ratio.
   - High-contrast gold pills use `#1C1512` text over `#FBBF24` background ($\gt 10:1$ ratio).
3. **Keyboard Navigation**:
   - Explicit `focus-visible` rings (`ring-2 ring-[#881337] ring-offset-2`).
   - Accessible skip-to-content anchor on all pages (`#main-content`).
