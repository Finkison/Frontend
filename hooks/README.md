# 🪝 Custom React Hooks Architecture

This directory contains custom React hooks designed to encapsulate cross-cutting concerns, role scoping, and component lifecycle logic.

---

## 1. Hook Catalog

* **`useScope.tsx`**:
  * Provides institutional and candidate scoping across multi-tenant environments.
  * Tracks currently selected active school, active classroom section, and academic calendar term.
  * Synchronizes filter states across table views and analytics charts.

---

## 2. Engineering Conventions

* Custom hooks must start with the `use` prefix.
* Encapsulate complex state machines and query logic to keep view components clean and declarative.
* Handle cleanup effects (`return () => ...`) for all event listeners and interval timers to eliminate memory leaks.
