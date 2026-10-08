import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  ChevronDown,
  BookOpen,
  Brain,
  Lightbulb,
  ListOrdered,
  Copy,
  CheckCircle2,
  Loader2,
  Languages,
  GraduationCap,
  Bookmark,
  Trash2,
  Pin,
  Search,
  Filter,
  X,
  ExternalLink,
  Calendar,
  BookMarked
} from "lucide-react";
import { useScope } from "../../hooks/useScope";
import api from "../../services/api";
import MathText from "../shared/MathText";
import { 
  createStudentNote, 
  getStudentNotes, 
  deleteStudentNote, 
  updateStudentNote, 
  StudentNoteItem 
} from "../../services/curriculumService";
import { useToast } from "../shared/Toast";

interface GeneratedNote {
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    keyPoints?: string[];
    formula?: string;
    example?: string;
  }[];
  mnemonics: string[];
  examTips: string[];
  language: string;
}

function generateLocalNote(subject: string, topic: string, language: string): GeneratedNote {
  const notes: Record<string, GeneratedNote> = {
    "Mathematics": {
      title: `${topic || "Quadratic Equations"} — Study Notes`,
      summary: "Comprehensive review of quadratic equations, their properties, solution methods, and applications in the Ethiopian national curriculum.",
      sections: [
        {
          heading: "1. Definition & Standard Form",
          content: "A quadratic equation is a second-degree polynomial equation of the form ax² + bx + c = 0, where a ≠ 0. The coefficient 'a' determines the parabola's direction (opens up if a > 0, down if a < 0).",
          keyPoints: [
            "Standard form: ax² + bx + c = 0",
            "The discriminant Δ = b² - 4ac determines the nature of roots",
            "If Δ > 0: two distinct real roots",
            "If Δ = 0: one repeated real root",
            "If Δ < 0: two complex conjugate roots"
          ],
          formula: "x = (-b ± √(b² - 4ac)) / 2a"
        },
        {
          heading: "2. Solution Methods",
          content: "There are four primary methods for solving quadratic equations, each suited to different problem types.",
          keyPoints: [
            "Factoring: Best when factors are obvious integers",
            "Completing the square: Always works, useful for deriving vertex form",
            "Quadratic formula: Universal method, works for all quadratics",
            "Graphical method: Roots are x-intercepts of the parabola"
          ],
          example: "Solve: x² - 5x + 6 = 0\n→ Factor: (x - 2)(x - 3) = 0\n→ x = 2 or x = 3"
        },
        {
          heading: "3. EUEE Application Patterns",
          content: "In the Ethiopian national exam, quadratic problems typically appear in 3 formats: direct solve, word problems (projectile/area), and discriminant analysis.",
          keyPoints: [
            "Always check if factoring works first (saves time)",
            "For word problems: define variables, set up equation, solve, verify units",
            "Common trap: forgetting to check if a = 0 (which makes it linear, not quadratic)"
          ]
        }
      ],
      mnemonics: [
        "\"Negative boy couldn't decide to go to the radical party...\" → Quadratic formula mnemonic",
        "\"FACT-or first\" → Always try factoring before the formula",
        "\"D > 0 = 2 roots, D = 0 = 1 root, D < 0 = 0 real roots\" → Discriminant rules"
      ],
      examTips: [
        "EUEE typically has 2-3 quadratic questions worth 4-6 marks total",
        "If the equation looks messy, use the quadratic formula directly",
        "Always verify your answer by substituting back into the original equation",
        "Time allocation: spend no more than 2 minutes per quadratic question"
      ],
      language: "en"
    },
    "Physics": {
      title: `${topic || "Newton's Laws of Motion"} — Study Notes`,
      summary: "Detailed review of Newton's three laws of motion with applications, free body diagrams, and EUEE problem-solving strategies.",
      sections: [
        {
          heading: "1. Newton's First Law (Law of Inertia)",
          content: "An object at rest stays at rest, and an object in motion stays in motion with constant velocity, unless acted upon by an unbalanced external force.",
          keyPoints: [
            "Inertia = resistance to change in motion",
            "Mass is the measure of inertia",
            "No net force → no acceleration (not necessarily no motion!)",
            "Common misconception: objects need force to keep moving (wrong!)"
          ]
        },
        {
          heading: "2. Newton's Second Law (F = ma)",
          content: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
          keyPoints: [
            "F = ma (vector equation: direction matters!)",
            "Net force = sum of all forces (use free body diagrams)",
            "Units: Force in Newtons (N = kg⋅m/s²)",
            "Weight ≠ Mass: W = mg where g ≈ 9.8 m/s²"
          ],
          formula: "ΣF = ma → a = ΣF/m",
          example: "A 5 kg box on a frictionless surface has a 20 N force applied.\na = F/m = 20/5 = 4 m/s²"
        },
        {
          heading: "3. Newton's Third Law (Action-Reaction)",
          content: "For every action force, there is an equal and opposite reaction force. These forces act on DIFFERENT objects.",
          keyPoints: [
            "Action and reaction forces are equal in magnitude, opposite in direction",
            "They act on DIFFERENT objects (never cancel each other)",
            "Example: You push wall → wall pushes you back",
            "EUEE trap: asking which forces cancel (only forces on SAME object cancel)"
          ]
        }
      ],
      mnemonics: [
        "\"I'm a (F=ma)\" → Second law formula",
        "\"For every push, there's a push back\" → Third law simplified",
        "\"REST or CONSTANT → no net force\" → First law summary"
      ],
      examTips: [
        "Always draw a Free Body Diagram (FBD) before solving",
        "Resolve forces into x and y components on inclined planes",
        "In EUEE, the most common errors are sign mistakes in vector addition",
        "Newton's laws appear in 3-4 questions, often combined with kinematics"
      ],
      language: "en"
    }
  };

  return notes[subject] || notes["Mathematics"]!;
}

export default function NotesGenerator(): React.ReactElement {
  const scope = useScope();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"generator" | "vault">("generator");

  // Generator states
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<"en" | "am" | "or">("en");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<GeneratedNote | null>(null);
  const [copied, setCopied] = useState(false);
  const [savingVault, setSavingVault] = useState(false);
  const [savedVault, setSavedVault] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  // Vault states
  const [savedNotes, setSavedNotes] = useState<StudentNoteItem[]>([]);
  const [loadingVault, setLoadingVault] = useState(false);
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultSubjectFilter, setVaultSubjectFilter] = useState("all");
  const [viewingNote, setViewingNote] = useState<StudentNoteItem | null>(null);

  const fetchSavedNotes = async () => {
    setLoadingVault(true);
    try {
      const res = await getStudentNotes();
      setSavedNotes(res.data?.notes || []);
    } catch {
      setSavedNotes([]);
    } finally {
      setLoadingVault(false);
    }
  };

  useEffect(() => {
    fetchSavedNotes();
  }, []);

  const handleSaveToNotebook = async () => {
    if (!note) return;
    setSavingVault(true);
    try {
      const markdownBody = `# ${note.title}\n\n**Summary:** ${note.summary}\n\n` +
        note.sections.map(s => `### ${s.heading}\n${s.content}\n${s.formula ? `\nFormula: ${s.formula}\n` : ''}${s.keyPoints?.length ? '\nKey Points:\n' + s.keyPoints.map(k => `- ${k}`).join('\n') : ''}`).join('\n\n') +
        (note.examTips?.length ? `\n\n### Exam Tips\n` + note.examTips.map(t => `- ${t}`).join('\n') : '');

      const res = await createStudentNote({
        title: note.title,
        content: markdownBody,
        subject: subject,
        topic: topic || note.title,
        tags: [subject, scope.gradeDisplay, "AI Generated"],
        source: "generator"
      });
      if (res.data?.note) {
        setSavedNotes(prev => [res.data.note, ...prev]);
      }
      setSavedVault(true);
      showToast({
        type: "success",
        title: "Saved to Notebook",
        message: `'${note.title}' added to your personal learning vault.`
      });
      setTimeout(() => setSavedVault(false), 3000);
    } catch (err) {
      console.error("Failed to save note to personal notebook", err);
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Could not persist note to notebook."
      });
    } finally {
      setSavingVault(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteStudentNote(noteId);
      setSavedNotes(prev => prev.filter(n => n.id !== noteId));
      if (viewingNote?.id === noteId) setViewingNote(null);
      showToast({
        type: "success",
        title: "Note Removed",
        message: "Study note deleted from your notebook."
      });
    } catch {
      showToast({
        type: "error",
        title: "Delete Failed",
        message: "Could not delete note."
      });
    }
  };

  const handleTogglePin = async (n: StudentNoteItem) => {
    try {
      const updatedPin = !n.is_pinned;
      await updateStudentNote(n.id, { is_pinned: updatedPin });
      setSavedNotes(prev => prev.map(item => item.id === n.id ? { ...item, is_pinned: updatedPin } : item));
      if (viewingNote?.id === n.id) {
        setViewingNote(prev => prev ? { ...prev, is_pinned: updatedPin } : null);
      }
    } catch {
      showToast({
        type: "error",
        title: "Update Failed",
        message: "Could not update pin state."
      });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/generate-notes/", {
        subject, topic: topic || undefined,
        language, grade: scope.gradeDisplay,
        stream: scope.stream,
      });
      if (res.data?.note) {
        setNote(res.data.note);
      } else {
        setNote(generateLocalNote(subject, topic, language));
      }
    } catch {
      setNote(generateLocalNote(subject, topic, language));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!notesRef.current) return;
    navigator.clipboard.writeText(notesRef.current.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredVaultNotes = savedNotes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                          n.content.toLowerCase().includes(vaultSearch.toLowerCase()) ||
                          (n.topic && n.topic.toLowerCase().includes(vaultSearch.toLowerCase()));
    const matchesSubject = vaultSubjectFilter === "all" || n.subject.toLowerCase() === vaultSubjectFilter.toLowerCase();
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            AI Study Notes & Personal Notebook
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate exam-ready notes or organize notes captured during textbook lessons.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("generator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "generator"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Generator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("vault");
              fetchSavedNotes();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "vault"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-blue-500" />
            <span>My Notebook</span>
            {savedNotes.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-extrabold">
                {savedNotes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mode 1: AI Generator */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Subject */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Subject</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:border-blue-500 focus:bg-white outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {scope.availableSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Topic (optional)</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quadratic Equations"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-colors"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Language</label>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800">
                  <Languages className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>English (National Standard)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {scope.gradeDisplay} Notes</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Notes Display */}
          {note && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" ref={notesRef}>
              
              <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-slate-900">{note.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{scope.gradeDisplay} • {scope.stream} • {subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSaveToNotebook} 
                    disabled={savingVault}
                    className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Save to My Personal Notebook"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>{savedVault ? "Saved in Notebook!" : "Save to Notebook"}</span>
                  </button>
                  <button onClick={handleCopy} className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer" title="Copy notes">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={handlePrint} className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer" title="Print notes">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <p className="text-sm text-blue-900 leading-relaxed font-medium">{note.summary}</p>
              </div>

              {/* Content Sections */}
              {note.sections.map((section, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-blue-500" />
                      {section.heading}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-700 leading-relaxed">{section.content}</p>

                    {section.keyPoints && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Points</p>
                        <ul className="space-y-1">
                          {section.keyPoints.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.formula && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Formula</p>
                        <p className="font-mono text-sm font-bold text-amber-900">{section.formula}</p>
                      </div>
                    )}

                    {section.example && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Worked Example</p>
                        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">{section.example}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Mnemonics */}
              {note.mnemonics.length > 0 && (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-purple-900 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-500" />
                    Memory Aids & Mnemonics
                  </h3>
                  <ul className="space-y-2">
                    {note.mnemonics.map((m, i) => (
                      <li key={i} className="text-sm text-purple-800 flex items-start gap-2">
                        <span className="text-purple-400 font-bold shrink-0">💡</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam Tips */}
              {note.examTips.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    EUEE Exam Tips
                  </h3>
                  <ul className="space-y-2">
                    {note.examTips.map((tip, i) => (
                      <li key={i} className="text-sm text-emerald-800 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">🎯</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!note && !loading && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Notes Generated Yet</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Select a subject and optionally a topic above, then click "Generate Notes" to create comprehensive,
                exam-ready study material tailored to your {scope.gradeDisplay} curriculum.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Personal Notebook Vault */}
      {activeTab === "vault" && (
        <div className="space-y-6">
          {/* Vault Filter Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search saved notes..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={vaultSubjectFilter}
                onChange={(e) => setVaultSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none bg-slate-50 cursor-pointer"
              >
                <option value="all">All Subjects ({savedNotes.length})</option>
                {Array.from(new Set(savedNotes.map(n => n.subject).filter(Boolean))).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingVault ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Loading your study notebook...
            </div>
          ) : filteredVaultNotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookMarked className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Your Notebook is Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Save high-yield summaries from the AI Generator or take real-time notes while reading lessons in the textbook reader.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVaultNotes.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {n.subject}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(n)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            n.is_pinned ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-slate-500"
                          }`}
                          title={n.is_pinned ? "Unpin Note" : "Pin Note to Top"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n.id)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-900 line-clamp-2">
                      {n.title}
                    </h3>

                    {n.topic && (
                      <p className="text-[11px] font-medium text-slate-400">
                        Topic: {n.topic}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                      {n.content.replace(/^#+\s+/gm, "")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    <button
                      type="button"
                      onClick={() => setViewingNote(n)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read Note</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Note Reading Modal */}
          {viewingNote && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {viewingNote.subject} &bull; {viewingNote.topic || "Study Note"}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                      {viewingNote.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingNote(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2 space-y-4 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {viewingNote.content}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Saved on {new Date(viewingNote.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewingNote.content);
                        showToast({ type: "success", title: "Copied", message: "Note text copied to clipboard." });
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Copy Text
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(viewingNote.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewingNote(null)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
