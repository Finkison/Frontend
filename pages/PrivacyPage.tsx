import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, EyeOff, Server, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";

export default function PrivacyPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Privacy policy — Finkison";
  }, []);

  const POLICIES = [
    {
      icon: <EyeOff className="w-6 h-6 text-[#881337]" />,
      badge: "Commercial neutrality",
      title: "Zero student data monetization",
      subtitle: "Prohibition against commercializing candidate and school records.",
      body: "Finkison never sells, leases, or monetizes student or educator records. Assessment responses and diagnostic scores are processed strictly for exam calibration and are never used to train commercial AI models.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-[#881337]" />,
      badge: "Telemetry scope",
      title: "Academic telemetry scope",
      subtitle: "Explicit boundaries on data processed during test sessions.",
      body: "We process assessment timing, question responses, and spaced repetition intervals solely to forecast entrance readiness. Personal records remain restricted to authorized school leadership, assigned teachers, and registered guardians.",
    },
    {
      icon: <Server className="w-6 h-6 text-[#881337]" />,
      badge: "Data sovereignty",
      title: "Domestic data sovereignty",
      subtitle: "Full compliance with Ethiopian Proclamation No. 1321/2024.",
      body: "All student databases and evaluation artifacts are hosted in certified Tier-3 datacenter facilities in Addis Ababa. Records are protected with AES-256 encryption at rest and TLS 1.3 in transit, with zero international data transfer.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#881337]" />,
      badge: "Governance and rights",
      title: "Institutional governance and parental rights",
      subtitle: "Data portability, audit logs, and complete record erasure.",
      body: "School administrators and verified guardians retain complete rights to audit records, export data in standard formats, or request permanent deletion of historical attempts upon student graduation.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#261E1A] font-sans selection:bg-[#FFF1F2] selection:text-[#881337]">
      {/* =========================================================================
          1. HERO HEADER (Academic Shield #4C0519)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#4C0519] text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            Privacy policy
          </h1>
          <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl mx-auto">
            Operational standards governing candidate data sovereignty, cryptographic security, and institutional confidentiality under Ethiopian law.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-100/80">
            <span>Proclamation No. 1321/2024 compliant</span>
            <span>•</span>
            <span>Addis Ababa Tier-3 domestic hosting</span>
            <span>•</span>
            <span>Zero third-party model training</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORE PRIVACY COMMITMENTS
          Background: Warm Parchment (#FAF8F5)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4 text-left max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1512] tracking-tight leading-tight">
              Institutional privacy and student rights charter
            </h2>
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed">
              Every data point collected on Finkison is strictly governed by four foundational legal and technical guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {POLICIES.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all duration-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1C1512] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-[#881337] mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className="text-base text-[#57534E] leading-relaxed pt-2 border-t border-stone-100">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact and Audit Banner */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#881337]">
                Compliance inquiries
              </span>
              <h3 className="text-xl font-bold text-[#1C1512]">
                Request compliance documentation for school boards
              </h3>
              <p className="text-base text-[#57534E] leading-relaxed">
                If your regional education bureau or school leadership requires technical certifications, security dossiers, or formal data processing addendums, our legal team provides complete packages.
              </p>
            </div>
            <Link
              to="/contact"
              className="min-h-[44px] px-8 py-3 rounded-[8px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-sm font-semibold transition-colors inline-flex items-center gap-2 shrink-0 shadow-sm"
            >
              <span>Contact us</span>
              <ArrowRight className="w-4 h-4 text-[#1C1512]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
