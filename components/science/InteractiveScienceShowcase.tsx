import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Atom, Dna, Activity, FunctionSquare as FunctionIcon, ArrowRight } from "lucide-react";

import PhysicsWaveSimulation from "./PhysicsWaveSimulation";
import BiologyDnaSimulation from "./BiologyDnaSimulation";
import ChemistryMolecularSimulation from "./ChemistryMolecularSimulation";
import MathGeometrySimulation from "./MathGeometrySimulation";

type SubjectId = "physics" | "biology" | "chemistry" | "mathematics";

interface SubjectTabInfo {
  id: SubjectId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  curriculumUnit: string;
  practiceRoute: string;
  sampleNotesRoute: string;
}

const SUBJECT_TABS: SubjectTabInfo[] = [
  {
    id: "physics",
    label: "Physics",
    icon: Activity,
    curriculumUnit: "Grade 11: Unit 4 (Oscillations & Wave Mechanics)",
    practiceRoute: "/student/practice",
    sampleNotesRoute: "/academics?stream=natural",
  },
  {
    id: "biology",
    label: "Biology",
    icon: Dna,
    curriculumUnit: "Grade 12: Unit 2 (Molecular Genetics & DNA Replication)",
    practiceRoute: "/student/practice",
    sampleNotesRoute: "/academics?stream=natural",
  },
  {
    id: "chemistry",
    label: "Chemistry",
    icon: Atom,
    curriculumUnit: "Grade 10: Unit 3 (Atomic Structure & Quantum Orbitals)",
    practiceRoute: "/student/practice",
    sampleNotesRoute: "/academics?stream=natural",
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: FunctionIcon,
    curriculumUnit: "Grade 11: Unit 5 (Trigonometric Functions & Harmonic Motion)",
    practiceRoute: "/student/practice",
    sampleNotesRoute: "/academics?stream=natural",
  },
];

export default function InteractiveScienceShowcase(): React.ReactElement {
  const [activeSubject, setActiveSubject] = useState<SubjectId>("physics");
  const [isInViewport, setIsInViewport] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy pause when off-screen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activeTab = SUBJECT_TABS.find((t) => t.id === activeSubject) || SUBJECT_TABS[0];

  return (
    <div ref={containerRef} className="w-full space-y-6">
      {/* 4 Tabs Bar (Max 4 tabs per viewer rule) */}
      <div
        role="tablist"
        aria-label="STEM Visual Simulation Subjects"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-[8px] bg-[#FAF8F5] dark:bg-[#1C1512] border border-[#E7E0D6] dark:border-white/10"
      >
        {SUBJECT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubject === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              type="button"
              onClick={() => setActiveSubject(tab.id)}
              className={`min-h-[44px] px-3 py-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337] ${
                isActive
                  ? "bg-white dark:bg-[#261E1A] text-[#881337] dark:text-[#FBBF24] shadow-xs border border-[#FECDD3] dark:border-[#FBBF24]/30"
                  : "text-[#5C5046] dark:text-stone-400 hover:text-[#261E1A] dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#881337] dark:text-[#FBBF24]" : "text-[#7D6F63] dark:text-stone-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div
        role="tabpanel"
        id={`panel-${activeSubject}`}
        aria-labelledby={`tab-${activeSubject}`}
        className="space-y-4"
      >
        {/* Unit Mapping Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#7D6F63] dark:text-stone-400">Curriculum alignment:</span>
            <span className="font-semibold text-[#261E1A] dark:text-white">{activeTab.curriculumUnit}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={activeTab.sampleNotesRoute}
              className="text-[#881337] dark:text-[#FBBF24] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View curriculum notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to={activeTab.practiceRoute}
              className="text-[#881337] dark:text-[#FBBF24] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Practice exam questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Simulation Rendering (Only 1 active visual playing) */}
        {isInViewport && (
          <div className="transition-opacity duration-200">
            {activeSubject === "physics" && <PhysicsWaveSimulation />}
            {activeSubject === "biology" && <BiologyDnaSimulation />}
            {activeSubject === "chemistry" && <ChemistryMolecularSimulation />}
            {activeSubject === "mathematics" && <MathGeometrySimulation />}
          </div>
        )}
      </div>
    </div>
  );
}
