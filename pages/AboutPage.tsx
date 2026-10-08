import React from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  ShieldCheck, 
  Target, 
  Heart, 
  BookOpen, 
  Users, 
  Sparkles, 
  Award,
  Globe2,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0F2744] via-[#143257] to-[#0F2744] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            Our National Mission
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Democratizing University Entrance Prep for Every Ethiopian Candidate
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Every year, hundreds of thousands of students sit for the Ethiopian University Entrance Examination. Finkison was created to ensure that whether you study in Addis Ababa, Hawassa, Adama, or a rural preparatory school, you have equal access to world-class learning tools.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">The Problem We Solve</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Breaking Regional Disparities in Educational Outcomes
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Historically, students in regional schools faced textbook shortages, limited access to verified past examination archives, and high tutoring costs.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Finkison converts the entire MoE Grades 9–12 curriculum into an adaptive digital intelligence platform. Candidates can test themselves, get hints in their native language, and know their exact cutoff odds before exam day.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Free Core Access for Public School Candidates</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bilingual Socratic Tutoring (English and Amharic)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Accredited Ministry of Education Curriculum Alignment</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              National Impact Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <p className="font-serif text-2xl font-bold text-blue-900">32M+</p>
                <p className="text-xs text-blue-700 mt-1">Secondary Youth Reached</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <p className="font-serif text-2xl font-bold text-amber-900">10,400+</p>
                <p className="text-xs text-amber-700 mt-1">Verified Past Questions</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <p className="font-serif text-2xl font-bold text-emerald-900">96.4%</p>
                <p className="text-xs text-emerald-700 mt-1">University Cutoff Accuracy</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <p className="font-serif text-2xl font-bold text-purple-900">12 / 12</p>
                <p className="text-xs text-purple-700 mt-1">Regional States Served</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Data compiled from national entrance candidate simulations and regional pilot school deployments.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900">Our Guiding Values</h2>
            <p className="text-sm text-slate-600 mt-2">
              Every algorithm, question review, and translation is anchored in these three commitments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Curriculum Integrity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero hallucinated questions. Every single problem in our bank is authenticated by licensed master educators against real national exam past papers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Bilingual Equity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Language should never be a barrier to understanding physics, calculus, or chemistry. We provide full explanations in English and Amharic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-2">Psychometric Precision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We use Item Response Theory (IRT) and national percentiles rather than simple raw percentages, projecting real university entrance cutoff odds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          Be Part of Ethiopia's Next Generation of Innovators
        </h3>
        <p className="text-sm text-slate-600">
          Prepare for your national exams today or learn more about our academic curriculum.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm shadow"
          >
            Create Free Account
          </Link>
          <Link
            to="/team"
            className="px-6 py-3 rounded-xl font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm"
          >
            Meet the Team &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
