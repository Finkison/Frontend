import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  Users, 
  Clock, 
  ArrowRight 
} from "lucide-react";

export default function TermsPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Terms of service — Finkison";
  }, []);

  const TERMS = [
    {
      icon: <Scale className="w-6 h-6 text-[#881337]" />,
      badge: "Institutional scope",
      title: "Service scope and curriculum alignment",
      subtitle: "Educational technology provisions aligned with national standards.",
      body: "Finkison provisions digital assessment banks, diagnostic review tools, and school administrative consoles strictly aligned with the Ethiopian General Education Curriculum Framework (EGECF).",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#881337]" />,
      badge: "SLA and availability",
      title: "Examination uptime commitment",
      subtitle: "99.9% uptime SLA during national examination seasons.",
      body: "We maintain a 99.9% uptime commitment for all examination infrastructure. High-concurrency domestic datacenter clusters in Addis Ababa ensure seamless autosave and session recovery during peak testing terms.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#881337]" />,
      badge: "Seat allocation",
      title: "Annual candidate seat licensing",
      subtitle: "Transparent licensing with administrative seat management.",
      body: "School licenses are provisioned on an annual candidate seat basis for Grades 9 through 12. School directors retain full authority to assign, manage, and reallocate student seats across homeroom sections.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#881337]" />,
      badge: "Academic integrity",
      title: "Supervisory telemetry and integrity",
      subtitle: "Non-invasive heuristics supporting teacher invigilation.",
      body: "Automated examination alerts (such as focus loss and tab switching) serve strictly as assistive aids for educators. Final disciplinary decisions remain exclusively under authorized school leadership.",
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
            Terms of service
          </h1>
          <p className="text-base sm:text-lg text-[#E2E8F0] leading-relaxed max-w-2xl mx-auto">
            Operating agreements governing institutional school licensing, proctoring availability, and candidate access across Ethiopia.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-100/80">
            <span>99.9% examination uptime SLA</span>
            <span>•</span>
            <span>Annual candidate seat portability</span>
            <span>•</span>
            <span>National secondary curriculum alignment</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORE TERMS AND CONDITIONS
          Background: Warm Parchment (#FAF8F5)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4 text-left max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1512] tracking-tight leading-tight">
              Institutional terms and service level commitments
            </h2>
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed">
              Transparent operational agreements designed specifically for secondary school boards, academic deans, and district education bureaus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {TERMS.map((item, idx) => (
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

          {/* District Terms Box */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#881337]">
                Customized agreements
              </span>
              <h3 className="text-xl font-bold text-[#1C1512]">
                Need custom district or regional bureau terms?
              </h3>
              <p className="text-base text-[#57534E] leading-relaxed">
                Regional educational bureaus and large multi-campus school networks can request customized master service contracts, centralized billing, and custom local server instances.
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
