# 📐 Frontend Code Standards & Review Guidelines

This document outlines team conventions, TypeScript practices, and PR checklist rules for all frontend engineers.

---

## 1. TypeScript Rules
* **No `any`**: Use explicit interfaces or generics. If an unknown structure comes from an external API, use `unknown` with a type guard.
* **Component Props**: Explicitly declare interfaces:
  ```typescript
  interface StudentCardProps {
    student: StudentProfile;
    onSelect?: (id: string) => void;
  }
  ```
* **Store Subscriptions**: Subscribe to atomic slices using `useAuthStore((state) => state.token)` rather than full object destructuring.

---

## 2. Styling & Design Token Standards
* **Color Palette**: Stick strictly to predefined Tailwind tokens:
  * Imperial Navy: `bg-slate-900`, `text-slate-900`
  * Solomonic Gold: `bg-amber-500`, `text-amber-500`, `text-amber-400`
  * Success: `emerald-600`, Alert: `rose-600`, Info: `blue-600`
* **Responsive Layouts**: Design mobile-first. Use `sm:`, `md:`, `lg:` prefixes.
* **Accessibility**: Every interactive element (`button`, `a`, `input`) must have accessible focus rings and descriptive labels.

---

## 3. Pull Request (PR) Checklist
Before requesting review on GitHub:
- [ ] `npm run typecheck` passes with 0 errors.
- [ ] `npm test` passes 100% of unit tests.
- [ ] `npm run build` generates `dist/` cleanly without warnings.
- [ ] No `console.log()` statements left in production code.
- [ ] New features are documented in their respective folder's `README.md`.
