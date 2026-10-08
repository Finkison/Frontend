import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { 
  GraduationCap, 
  Target, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  ChevronRight
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps): React.ReactElement {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);

  const gradeNum = parseInt(String(user?.grade || "").replace(/\D/g, "") || "12", 10);
  const isJunior = gradeNum <= 10;

  const [stream, setStream] = useState(
    isJunior ? "General Secondary" : (user?.stream || "Natural Science")
  );
  const [targetScore, setTargetScore] = useState(user?.targetScore || 540);
  const [targetUniversity, setTargetUniversity] = useState(user?.targetUniversity || "Addis Ababa University (AAU)");

  const handleFinish = () => {
    if (user) {
      const existingToken = useAuthStore.getState().token || "demo-token";
      login(
        {
          ...user,
          stream: isJunior ? "General Secondary" : stream,
          targetScore,
          targetUniversity
        },
        user.role || "STUDENT",
        existingToken
      );
    }
    if (onComplete) {
      onComplete();
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto">
      {/* Steps Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Candidate Onboarding</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {currentStep === 1 && (isJunior ? "Grade 9–10 Unified Curriculum" : "Select Your Academic Stream")}
            {currentStep === 2 && "Calibrate Your University Target"}
            {currentStep === 3 && "Daily Diagnostic Study Plan"}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">Step {currentStep} of 3</span>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step 1: Stream */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {isJunior ? (
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Grade {gradeNum} Comprehensive Curriculum
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Under Ethiopia's national education policy, Grade 9 and 10 students study <strong>both Natural and Social Science courses concurrently</strong> without stream segregation. Academic streaming into Natural vs Social Science begins in Grade 11.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200/60">
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-blue-700 uppercase">🔬 Natural Sciences</p>
                  <p className="text-xs text-slate-600 mt-0.5">Physics, Chemistry, Biology</p>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-amber-700 uppercase">🌍 Social Sciences</p>
                  <p className="text-xs text-slate-600 mt-0.5">History, Geography, Economics, Civics</p>
                </div>
                <div className="bg-white/90 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[11px] font-bold text-indigo-700 uppercase">📐 Core Foundations</p>
                  <p className="text-xs text-slate-600 mt-0.5">Mathematics, English, IT</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 leading-relaxed">
                The Ethiopian National University Entrance Examination is divided into two core tracks. Finkison customizes your past questions and predictive models according to your track.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStream("Natural Science")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    stream === "Natural Science"
                      ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Natural Science</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mathematics, Physics, Chemistry, Biology, English, Aptitude.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStream("Social Science")}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    stream === "Social Science"
                      ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-200"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Social Science</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    History, Geography, Economics, Civics, English, Aptitude.
                  </p>
                </button>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              Target Higher Education Institution
            </label>
            <select
              value={targetUniversity}
              onChange={(e) => setTargetUniversity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-amber-500 outline-none"
            >
              <option value="Addis Ababa University (AAU) - Medicine">Addis Ababa University (AAU) - Medicine</option>
              <option value="Addis Ababa University (AAU) - Faculty of Technology">Addis Ababa University (AAU) - Faculty of Technology</option>
              <option value="Addis Ababa Science & Technology University (AASTU)">Addis Ababa Science & Technology University (AASTU)</option>
              <option value="Adama Science & Technology University (ASTU)">Adama Science & Technology University (ASTU)</option>
              <option value="Hawassa University - College of Medicine & Health Sciences">Hawassa University - Health Sciences</option>
              <option value="Jimma University - Institute of Technology">Jimma University - Institute of Technology</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase text-slate-700">
                Target Score Goal
              </label>
              <span className="font-serif text-lg font-bold text-amber-600">{targetScore} / 600</span>
            </div>
            <input
              type="range"
              min="350"
              max="600"
              step="5"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>National Threshold (350)</span>
              <span>Engineering (480+)</span>
              <span>Medicine Cutoff (560+)</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Your Diagnostic Cockpit is Configured</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Based on your goal of <strong>{targetScore} points</strong> for <strong>{targetUniversity}</strong>, the Socratic AI tutor will schedule 15 daily questions focused on highest-weight topics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Diagnostic baseline exam unlocked</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Bilingual Socratic tutoring (Amharic & English) active</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>National percentile tracking calibrated</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Launch Candidate Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
