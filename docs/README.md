# 📚 Finkison Frontend Enterprise Documentation

Welcome to the central documentation index for the Finkison Progressive Web App (PWA) client. This directory contains architectural specifications, team onboarding guides, and operational runbooks.

---

## 📂 Documentation Directory Map

```text
Frontend/docs/
├── README.md                          # Master documentation index (this file)
├── architecture/
│   ├── enterprise_frontend_architecture.md # Master frontend architectural blueprint
│   ├── frontend_architecture.md       # Client offline sync & state model
│   └── system_overview.md             # C4 system topology & interaction model
├── team/
│   ├── onboarding.md                  # Quickstart guide for new frontend engineers
│   └── code_standards.md              # TypeScript, Tailwind, and PR review checklist
└── runbooks/
    ├── pwa_deployment.md              # PWA deployment, CDN caching, and Nginx setup
    └── disaster_recovery.md           # Client fallback & cache-invalidation runbook
```

---

## 📌 Document Quick Links

1. **System & Architecture**:
   * [Master Frontend Architecture Blueprint](architecture/enterprise_frontend_architecture.md)
   * [System C4 Topology & Overview](architecture/system_overview.md)
   * [Client State & Offline Sync Architecture](architecture/frontend_architecture.md)
2. **Team & Engineering**:
   * [Team Onboarding & Local Setup](team/onboarding.md)
   * [Code Standards & PR Checklist](team/code_standards.md)
3. **Operations & Deployment**:
   * [PWA Deployment & Caching](runbooks/pwa_deployment.md)
   * [Client Disaster Recovery Runbook](runbooks/disaster_recovery.md)

---

## 🧩 Component & Service Folder Docs
For folder-specific documentation, see:
* [Components Architecture](../components/README.md)
* [School B2B Governance Suite](../components/school/README.md)
* [Student Examination Engine](../components/student/README.md)
* [Parent Oversight Portal](../components/parent/README.md)
* [Services API Contracts](../services/README.md)
* [State Management Stores](../store/README.md)
* [Routing & Pages](../pages/README.md)
* [TypeScript Type System](../types/README.md)
* [Custom Hooks](../hooks/README.md)
* [Storage & Date Utilities](../utils/README.md)
