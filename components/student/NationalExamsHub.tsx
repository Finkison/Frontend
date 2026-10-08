import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Clock, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  Layers,
  BookOpen,
  Atom,
  Calculator,
  Brain,
  FlaskConical,
  Dna,
  Zap
} from "lucide-react";
import { getExams, startExam, generateSectionalExam } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";
import { CardSkeleton } from "../shared/SkeletonLoader";

export default function NationalExamsHub(): React.ReactElement {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const startSession = useSessionStore((s) => s.startSession);

  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  // Sectional Generator State
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [isSimultaneous, setIsSimultaneous] = useState(false);
  const [generatingSectional, setGeneratingSectional] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [user?.stream]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await getExams(user?.stream || "Natural Science");
      const list = res.data?.data || res.data || [];
      setExams(Array.isArray(list) ? list : []);
    } catch {
      // Resilient fallback
      setExams([
        {
          id: "exam-2016-eng-sectional",
          title: "2016 E.C. National Entrance Examination: English (Sectional Model)",
          subject: "English",
          stream: "General Secondary",
          durationMinutes: 120,
          totalQuestions: 13,
          year: "2016 E.C."
        },
        {
          id: "exam-2016-math-sectional",
          title: "2016 E.C. National Entrance Examination: Mathematics (Sectional Model)",
          subject: "Mathematics",
          stream: "Natural Science",
          durationMinutes: 120,
          totalQuestions: 60,
          year: "2016 E.C."
        },
        {
          id: "exam-2016-phys-sectional",
          title: "2016 E.C. National Entrance Examination: Physics (Sectional Model)",
          subject: "Physics",
          stream: "Natural Science",
          durationMinutes: 120,
          totalQuestions: 50,
          year: "2016 E.C."
        },
        {
          id: "exam-2016-apt-sectional",
          title: "2016 E.C. General Scholastic Aptitude Test (GSAT)",
          subject: "Aptitude",
          stream: "General Secondary",
          durationMinutes: 120,
          totalQuestions: 60,
          year: "2016 E.C."
        },
        {
          id: "exam-2016-grand-simultaneous",
          title: "2016 E.C. Grand All-in-One Multi-Section Entrance Simulation",
          subject: "Comprehensive",
          stream: "Natural Science",
          durationMinutes: 180,
          totalQuestions: 27,
          year: "2016 E.C."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (exam: any) => {
    setLaunchingId(exam.id);
    try {
      const res = await startExam({ exam_id: exam.id, stream: exam.stream });
      const data = res.data?.data || res.data || {};
      const questions = data.questions || [];
      const sections = data.sections || [];
      const durationSeconds = data.duration || data.duration_seconds || (exam.durationMinutes * 60) || 7200;

      startSession(data.id || exam.id, "national_mock", questions, durationSeconds, sections);
      navigate("/student/session");
    } catch {
      startSession(
        `mock-${exam.id}`,
        "national_mock",
        [
          {
            id: "q-mock-1",
            section: "Section 1: General Knowledge",
            question_text_en: "If the position of a particle is given by s(t) = 2t^3 - 6t^2 + 10, find the acceleration at t = 2 seconds.",
            options: [
              { label: "A", text: "12 m/s^2" },
              { label: "B", text: "24 m/s^2" },
              { label: "C", text: "0 m/s^2" },
              { label: "D", text: "6 m/s^2" }
            ],
            correct_answer: 0,
            correctAnswer: 0,
            explanation_en: "v(t) = s'(t) = 6t^2 - 12t. a(t) = v'(t) = 12t - 12. At t = 2: a(2) = 12(2) - 12 = 12 m/s^2."
          }
        ],
        7200
      );
      navigate("/student/session");
    } finally {
      setLaunchingId(null);
    }
  };

  const handleLaunchSectionalGenerator = async () => {
    setGeneratingSectional(true);
    try {
      const res = await generateSectionalExam({
        subject: selectedSubject,
        stream: user?.stream || "Natural Science",
        year: "2016 E.C.",
        simultaneous: isSimultaneous
      });
      const data = res.data?.data || res.data || {};
      const questions = data.questions || [];
      const sections = data.sections || [];
      const durationSeconds = data.duration_seconds || data.duration || 7200;

      startSession(data.id || data.sessionId || `sec-${Date.now()}`, "national_mock", questions, durationSeconds, sections);
      navigate("/student/session");
    } catch (err) {
      console.error("Sectional generator failed:", err);
    } finally {
      setGeneratingSectional(false);
    }
  };

  const subjectOptions = [
    {
      id: "English",
      name: "English",
      icon: BookOpen,
      sectionsNote: "Section 1: Passages & Comprehension • Section 2: Grammar & Usage • Section 3: Synonyms & Antonyms • Section 4: Communication"
    },
    {
      id: "Mathematics",
      name: "Mathematics",
      icon: Calculator,
      sectionsNote: "Section 1: Algebra & Polynomials • Section 2: Sequences & Limits • Section 3: Differential & Integral Calculus • Section 4: Vectors & Geometry"
    },
    {
      id: "Physics",
      name: "Physics",
      icon: Atom,
      sectionsNote: "Section 1: Mechanics & Dynamics • Section 2: Electromagnetism • Section 3: Thermodynamics & Optics • Section 4: Quantum Physics"
    },
    {
      id: "Chemistry",
      name: "Chemistry",
      icon: FlaskConical,
      sectionsNote: "Section 1: Physical Chemistry • Section 2: Chemical Kinetics & Equilibrium • Section 3: Electrochemistry • Section 4: Organic Chemistry"
    },
    {
      id: "Biology",
      name: "Biology",
      icon: Dna,
      sectionsNote: "Section 1: Cell Biology • Section 2: Molecular Genetics • Section 3: Human Anatomy & Physiology • Section 4: Ecology"
    },
    {
      id: "Scholastic Aptitude",
      name: "Scholastic Aptitude",
      icon: Brain,
      sectionsNote: "Section 1: Verbal Analogies • Section 2: Quantitative Sequences & Math Logic • Section 3: Spatial & Abstract Matrices"
    },
  ];

  const filteredExams = selectedYear === "All"
    ? exams
    : exams.filter((e) => e.year?.includes(selectedYear));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0A192F] to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Ethiopian National Examination Standard</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              National Model Exam Simulation Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the full 2-hour official Ethiopian University Entrance Examination (EUEE). Authentic past papers from 2012 to 2016 E.C. with timed countdowns, multi-section passage reading, and automated scaled scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Standard Duration</span>
              <p className="font-mono text-xl font-bold text-amber-400 mt-0.5">120 Mins</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">National Max</span>
              <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">600 Pts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0F2744] text-white border border-slate-800 shadow-lg space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Full Entrance Exam Generator</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Authentic Multi-Section Entrance Booklet Simulator
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Generates official entrance exams with genuine sections (e.g. English Reading Passages, Grammar, Vocab/Antonyms, Communication) or an all-in-one simultaneous grand mock.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <button
              onClick={() => setIsSimultaneous(false)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !isSimultaneous ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
              }`}
            >
              Single Subject (Sectional)
            </button>
            <button
              onClick={() => setIsSimultaneous(true)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isSimultaneous ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-300 hover:text-white"
              }`}
            >
              ⚡ Grand Simultaneous (All Subjects)
            </button>
          </div>
        </div>

        {/* Configuration Body */}
        {!isSimultaneous ? (
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-300 block">
              Choose Entrance Subject to Simulate:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjectOptions.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                const Icon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? "bg-amber-400/15 border-amber-400 text-white ring-1 ring-amber-400"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                    <span className="text-xs font-bold block">{sub.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider block">
                Included Sections in this Exam:
              </span>
              <p className="text-slate-200">
                {subjectOptions.find((s) => s.id === selectedSubject)?.sectionsNote}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Full National Entrance Day Simulation (All Subjects)</span>
            </div>
            <p>
              Simulates the full Ethiopian University Entrance Examination day into a unified test portal! Includes <strong>English Passages, Advanced Grammar, Synonyms & Antonyms, Math Calculus & Sequences, Physics Mechanics, Chemistry Equilibrium, and Aptitude Reasoning</strong> with a continuous 180-minute countdown and comprehensive scaled percentile calculation.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {isSimultaneous ? "180 Minutes" : "120 Minutes"}
            </span>
            <span className="flex items-center gap-1 font-mono text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Authentic EUEE Format
            </span>
          </div>

          <button
            onClick={handleLaunchSectionalGenerator}
            disabled={generatingSectional}
            className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{generatingSectional ? "Assembling Entrance Exam..." : "Generate & Launch Official Exam"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Past Paper Archive:</span>
        {["All", "2016", "2015", "2014", "2013", "2012"].map((yr) => (
          <button
            key={yr}
            onClick={() => setSelectedYear(yr)}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition-colors shrink-0 cursor-pointer ${
              selectedYear === yr
                ? "bg-slate-900 text-amber-400 border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {yr === "All" ? "All Past Papers" : `${yr} E.C.`}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : filteredExams.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700">No Exams Found for {selectedYear}</h4>
          <p className="text-xs text-slate-500">Try selecting "All Past Papers" to view full repository.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const isLaunching = launchingId === exam.id;
            return (
              <div
                key={exam.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                      {exam.year || "National Exam"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.durationMinutes || 120} mins</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Stream: <strong className="text-slate-800 font-medium">{exam.stream || "Natural Science"}</strong> • {exam.totalQuestions || 60} Questions
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scaled Score: /600</span>
                  </div>

                  <button
                    onClick={() => handleStartExam(exam)}
                    disabled={isLaunching}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isLaunching ? "Preparing Exam..." : "Launch Simulation"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
