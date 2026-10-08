import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Swords, 
  Bot, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Users, 
  Clock, 
  ChevronRight,
  Brain,
  Calculator,
  Atom,
  FlaskConical,
  Scale,
  Dna,
  HeartHandshake,
  School
} from "lucide-react";

export default function LandingPage(): React.ReactElement {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const demoQuestion = {
    subject: "Mathematics (Natural Science)",
    year: "2016 E.C. Entrance Exam",
    prompt: "What is the limit of (sin(3x)) / x as x approaches 0?",
    options: ["0", "1", "3", "Does not exist"],
    correct: 2,
    explanationEn: "Using the standard trigonometric limit rule: lim_{x->0} [sin(kx)/x] = k. Since k = 3, the limit is 3."
  };

  const handleSelectAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowExplanation(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F2744] via-[#143257] to-[#0F2744] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto">
          {/* Announcement Pill */}
          <div className="flex justify-center sm:justify-start mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="font-semibold">2016/2017 E.C. Entrance Exam Countdown</span>
              <span className="text-white/40">|</span>
              <span className="text-white font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> 118 Days Remaining
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Master the Ethiopian{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  National Entrance
                </span>{" "}
                Examination
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                The comprehensive EdTech ecosystem for Grades 9–12 candidates. Practice 10,000+ past national exam questions, get instant step-by-step Socratic AI guidance, and project your university cutoff odds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center sm:justify-start">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Free Preparation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/academics"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4 text-slate-300" />
                  <span>Explore Academics & Syllabi</span>
                </Link>

                <Link
                  to="/student/battle"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span>1v1 Quiz Battle</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ministry of Education (MoE) Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>10,400+ Verified Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>32M+ Secondary Candidates</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Practice Demo</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {demoQuestion.year}
                  </span>
                </div>

                <div className="pt-4">
                  <p className="text-xs font-semibold text-amber-600 mb-1">{demoQuestion.subject}</p>
                  <p className="font-semibold text-slate-900 text-base mb-4">{demoQuestion.prompt}</p>

                  <div className="space-y-2 mb-4">
                    {demoQuestion.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === demoQuestion.correct;
                      let btnStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700";

                      if (showExplanation) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                        } else if (isSelected) {
                          btnStyle = "border-rose-400 bg-rose-50 text-rose-900";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {showExplanation && isCorrect && (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Box */}
                  {showExplanation ? (
                    <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-amber-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" /> Socratic Explanation:
                        </span>
                        <span className="text-[10px] text-slate-400">Step-by-step breakdown</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-mono">{demoQuestion.explanationEn}</p>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 italic">
                      Click an option above to test your knowledge and see live explanation
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold font-serif text-[#0F2744]">48,200+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Questions Solved Today</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif text-amber-600">+52 Pts</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Avg. Predicted Score Gain</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif text-emerald-600">96.4%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">University Cutoff Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-serif text-blue-600">12 / 12</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Ethiopian Regions Covered</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Comprehensive Curriculum
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Curriculum Aligned with the Ethiopian Ministry of Education
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Grade 9 & 10 students build full cross-disciplinary mastery across both Natural and Social courses, while Grade 11 & 12 candidates specialize for 500+ EUEE scores.
          </p>
        </div>

        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grades 9 & 10 • Unified Comprehensive Curriculum</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Grade 9 & 10 Students Take Both Natural & Social Science Courses
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In Ethiopian high schools, Grade 9 and 10 candidates are <strong>not categorized into streams</strong>. You study Physics, Chemistry, Biology, History, Geography, Economics, Civics, Mathematics, English, and IT concurrently. Prerequisite foundations learned here directly determine your Grade 12 EUEE entrance score.
            </p>
          </div>
          <Link
            to="/academics"
            className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>Explore Grade 9–10 Syllabi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stream Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Natural Science Card */}
          <div className="rounded-3xl p-8 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Natural Science Stream</h3>
                  <p className="text-xs text-slate-500">For Medicine, Engineering & Technology Candidates</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                6 Core Subjects
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link to="/academics?subject=Mathematics" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Mathematics</span>
              </Link>
              <Link to="/academics?subject=Physics" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <Atom className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Physics</span>
              </Link>
              <Link to="/academics?subject=Chemistry" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <FlaskConical className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Chemistry</span>
              </Link>
              <Link to="/academics?subject=Biology" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <Dna className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Biology</span>
              </Link>
              <Link to="/academics?subject=English" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">English</span>
              </Link>
              <Link to="/academics?subject=Aptitude" className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Scholastic Aptitude</span>
              </Link>
            </div>

            <Link
              to="/academics?stream=natural"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore Natural Science Syllabus & Past Papers &rarr;
            </Link>
          </div>

          {/* Social Science Card */}
          <div className="rounded-3xl p-8 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Social Science Stream</h3>
                  <p className="text-xs text-slate-500">For Law, Business, Humanities & Social Work</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                6 Core Subjects
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link to="/academics?subject=History" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">History</span>
              </Link>
              <Link to="/academics?subject=Geography" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Geography</span>
              </Link>
              <Link to="/academics?subject=Economics" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Economics</span>
              </Link>
              <Link to="/academics?subject=Civics" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Civics & Ethics</span>
              </Link>
              <Link to="/academics?subject=English" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">English</span>
              </Link>
              <Link to="/academics?subject=Aptitude" className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 flex items-center gap-2.5 transition-colors">
                <Brain className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Scholastic Aptitude</span>
              </Link>
            </div>

            <Link
              to="/academics?stream=social"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
            >
              Explore Social Science Syllabus & Past Papers &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Why Candidates Choose Finkison
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Pedagogical Rigor Meets Advanced AI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We go beyond static PDFs. Finkison adapts to how you learn, predicts your cutoff chances, and motivates you daily.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Adaptive Spaced Repetition</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Our Item Response Theory (IRT) engine tracks your accuracy per unit and serves remedial questions when you make a mistake until mastery is proven.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Real past papers (2012–2016 E.C.)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unit-level diagnosis & weak gap flags</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">Bilingual Socratic AI Tutor</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Ask questions anytime and receive step-by-step guidance in English and Amharic (አማርኛ). It guides you to the formula rather than just giving away the answer.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full LaTeX equation rendering</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> National curriculum preservation</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 hover:border-rose-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                <Swords className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-3">1v1 Real-Time Battle Arena</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Challenge classmates or random candidates across Ethiopia in 15-second rapid-fire quiz duels. Stake XP, win badges, and climb regional leaderboards.
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Low-latency WebSocket room matching</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" /> School vs school regional tournaments</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Portal Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Unified Academic Ecosystem</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Built for Students, Trusted by Parents & Schools
          </h2>
          <p className="text-slate-600 text-base">
            Dedicated portals designed specifically for candidate preparation, guardian peace of mind, and administrative school analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h4 className="font-serif font-bold text-lg text-slate-900">Student Portal</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Daily practice streaks, IRT-projected score cards, cutoff university eligibility calculators, and full timed mock exam simulations.
            </p>
            <Link to="/student" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Enter Student Console &rarr;
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
              <h4 className="font-serif font-bold text-lg text-slate-900">Parent Portal</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              SMS notifications on daily study hours, mock exam milestones, attendance alerts, and direct contact with school educators.
            </p>
            <Link to="/parent" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Enter Guardian Dashboard &rarr;
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <School className="w-6 h-6 text-purple-600" />
              <h4 className="font-serif font-bold text-lg text-slate-900">School Admin Console</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Class section analytics, weakest curriculum units by grade, exam assignment tools, and downloadable MoE compliance reports.
            </p>
            <Link to="/school" className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              Enter School Console &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold">Ready to secure your spot at your dream university?</h3>
            <p className="text-slate-900/90 text-sm max-w-xl">
              Join thousands of Ethiopian students preparing with verified past exams and Socratic AI guidance.
            </p>
          </div>
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl font-bold bg-slate-900 hover:bg-slate-950 text-white shadow-xl hover:shadow-2xl transition-all shrink-0 text-sm"
          >
            Create Free Account Now
          </Link>
        </div>
      </section>
    </div>
  );
}
