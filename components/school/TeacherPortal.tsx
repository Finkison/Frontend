import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Calendar, 
  GraduationCap,
  Layers,
  Clock,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  Shield,
  X,
  MessageSquare,
  Send,
  Bell,
  Volume2
} from "lucide-react";
import { useToast } from "../shared/Toast";
import { 
  createLessonPlan, 
  getLessonPlans, 
  getSchoolStudents, 
  saveGradeEntries,
  getTeachers,
  inviteTeacher,
  getClassrooms,
  getSchoolMessages,
  replySchoolMessage,
  broadcastAnnouncement
} from "../../services/schoolService";

interface StudentScoreRecord {
  id: string;
  name: string;
  grade: string;
  score: number;
}

interface PublishedLessonPlan {
  id: string;
  title: string;
  subject: string;
  duration: number;
  createdAt: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  subject: string;
  assigned_classrooms: string[];
}

export default function TeacherPortal(): React.ReactElement {
  const { showToast } = useToast();
  const [outline, setOutline] = useState({
    title: "",
    duration: 3,
    subject: "Mathematics"
  });
  const [submittingOutline, setSubmittingOutline] = useState(false);
  const [savingGrades, setSavingGrades] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState(false);

  const [students, setStudents] = useState<StudentScoreRecord[]>([]);
  const [recentPlans, setRecentPlans] = useState<PublishedLessonPlan[]>([]);
  const [teachers, setTeachers] = useState<StaffMember[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  // Invite Staff Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    role: "TEACHER",
    department: "Natural Science",
    subject: "Mathematics",
    classroom_ids: [] as string[]
  });

  // Parent Communications State
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    target_grade: "all"
  });

  const loadData = async () => {
    try {
      const [studentsRes, plansRes, teachersRes, classesRes, messagesRes] = await Promise.allSettled([
        getSchoolStudents(),
        getLessonPlans(),
        getTeachers(),
        getClassrooms(),
        getSchoolMessages()
      ]);

      if (studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value.data)) {
        const mapped = studentsRes.value.data.map((s: any) => ({
          id: s.id,
          name: s.name || s.full_name || s.fullName || "Student",
          grade: s.grade_display || s.gradeDisplay || `Grade ${s.grade || 12}`,
          score: Math.min(100, Math.max(40, Math.round(((s.predicted_score || s.predictedScore || 450) / 700) * 100)))
        }));
        setStudents(mapped.length > 0 ? mapped : [
          { id: "std-001", name: "Abebe Bikila", grade: "Grade 12A", score: 88 },
          { id: "std-002", name: "Betty Girmay", grade: "Grade 12A", score: 94 },
          { id: "std-003", name: "Naod Yoseph", grade: "Grade 11B", score: 78 }
        ]);
      }

      if (plansRes.status === "fulfilled" && Array.isArray(plansRes.value.data)) {
        setRecentPlans(plansRes.value.data);
      }

      if (teachersRes.status === "fulfilled" && Array.isArray(teachersRes.value.data)) {
        setTeachers(teachersRes.value.data);
      }

      if (classesRes.status === "fulfilled" && Array.isArray(classesRes.value.data)) {
        setClassrooms(classesRes.value.data);
      }

      if (messagesRes.status === "fulfilled" && Array.isArray(messagesRes.value.data)) {
        setMessages(messagesRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load school educator data", err);
    }
  };

  const handleReplyMessage = async (msgId: string) => {
    const text = replyText[msgId]?.trim();
    if (!text) {
      showToast({ type: "error", title: "Empty Reply", message: "Please enter your response to the guardian." });
      return;
    }
    setReplyingId(msgId);
    try {
      await replySchoolMessage({ message_id: msgId, reply_content: text });
      showToast({
        type: "success",
        title: "Response Dispatched",
        message: "Your message has been sent to the guardian's notification portal."
      });
      setReplyText(prev => ({ ...prev, [msgId]: "" }));
      loadData();
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Dispatch Failed",
        message: err?.response?.data?.message || err?.message || "Failed to dispatch reply."
      });
    } finally {
      setReplyingId(null);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;
    setBroadcasting(true);
    try {
      const res = await broadcastAnnouncement(broadcastForm);
      showToast({
        type: "success",
        title: "Announcement Dispatched",
        message: res.data?.message || "Broadcast notification sent to student guardians."
      });
      setShowBroadcastModal(false);
      setBroadcastForm({ title: "", message: "", target_grade: "all" });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Broadcast Failed",
        message: err?.response?.data?.message || err?.message || "Failed to dispatch broadcast alert."
      });
    } finally {
      setBroadcasting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outline.title.trim()) return;

    setSubmittingOutline(true);
    setSuccess(false);

    try {
      const res = await createLessonPlan({
        title: outline.title.trim(),
        subject: outline.subject,
        duration: outline.duration
      });

      setSuccess(true);
      showToast({
        type: "success",
        title: "Lesson Plan Deployed",
        message: `Plan '${outline.title}' synchronized to school curriculum.`
      });

      if (res.data?.data) {
        setRecentPlans(prev => [res.data.data, ...prev]);
      }

      setOutline({ title: "", duration: 3, subject: "Mathematics" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Deployment Failed",
        message: err?.response?.data?.message || err?.message || "Failed to deploy curriculum outline."
      });
    } finally {
      setSubmittingOutline(false);
    }
  };

  const handleScoreChange = (index: number, newScore: number) => {
    setStudents(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], score: Math.max(0, Math.min(100, newScore)) };
      return copy;
    });
  };

  const handleSaveGrades = async () => {
    setSavingGrades(true);
    setGradeSuccess(false);

    try {
      const payload = students.map(s => ({
        student_id: s.id,
        name: s.name,
        score: s.score
      }));

      const res = await saveGradeEntries(payload);
      setGradeSuccess(true);
      showToast({
        type: "success",
        title: "Assessments Recorded",
        message: res.data?.message || "Classroom exam scores successfully saved to national system."
      });

      setTimeout(() => setGradeSuccess(false), 3000);
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Save Failed",
        message: err?.response?.data?.message || err?.message || "Failed to commit assessment grades."
      });
    } finally {
      setSavingGrades(false);
    }
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      await inviteTeacher(newTeacher);
      showToast({
        type: "success",
        title: "Staff Member Invited",
        message: `${newTeacher.name} successfully registered with school faculty.`
      });
      setShowInviteModal(false);
      setNewTeacher({
        name: "",
        email: "",
        phone: "",
        role: "TEACHER",
        department: "Natural Science",
        subject: "Mathematics",
        classroom_ids: []
      });
      loadData();
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Invitation Failed",
        message: err?.response?.data?.error || err?.message || "Only Principals can onboard staff members."
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Faculty & Staff Header Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-xs font-semibold border border-indigo-500/20 mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>School Faculty Directory</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Department Heads & Teaching Staff
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage school faculty members, subject specializations, and assigned classroom sections.
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Educator</span>
          </button>
        </div>

        {teachers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No faculty members registered for this school yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Assigned Classrooms</th>
                  <th className="py-3 px-4">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.role === "PRINCIPAL" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {t.role}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{t.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {t.subject || "All Subjects"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {t.assigned_classrooms?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {t.assigned_classrooms.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">All School Sections</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {t.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Grid: Lesson Planner & Diagnostic Score Entry */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Lesson outline creator */}
        <form onSubmit={handleCreateOutline} className="md:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 text-xs font-semibold border border-blue-500/20 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Syllabus Alignment</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Curriculum Lesson Planner
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structure curriculum outlines and sync them with national standard topics for adaptive learning.
              </p>
            </div>

            {success && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lesson plan synchronized and published to school students!</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="outlineTitle" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Lesson Title / Syllabus Topic *
                </label>
                <input
                  id="outlineTitle"
                  type="text"
                  placeholder="e.g. Definite Integrals & Area Calculation"
                  value={outline.title}
                  onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="outlineSubject" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    id="outlineSubject"
                    value={outline.subject}
                    onChange={(e) => setOutline({ ...outline, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Aptitude">General Aptitude</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="outlineDuration" className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    Weeks Allocated *
                  </label>
                  <input
                    id="outlineDuration"
                    type="number"
                    min={1}
                    max={12}
                    value={outline.duration}
                    onChange={(e) => setOutline({ ...outline, duration: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={submittingOutline}
              className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs shadow transition-colors cursor-pointer"
            >
              {submittingOutline ? "Deploying Outline..." : "Deploy Lesson Outline"}
            </button>
          </div>
        </form>

        {/* Manual grade records */}
        <div className="md:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-semibold border border-purple-500/20 mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Assessment Calibration</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-900">
                Classroom Diagnostic Score Entry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Log scores for physical classroom exams to calibrate IRT predictive score models.
              </p>
            </div>

            {gradeSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Grade records committed to national database!</span>
              </div>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {students.map((s, i) => (
                <div key={s.id || i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{s.name}</span>
                    <span className="text-[10px] text-slate-400">{s.grade}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.score}
                      onChange={(e) => handleScoreChange(i, Number(e.target.value))}
                      className="w-16 px-2.5 py-1.5 rounded-lg border border-slate-200 text-center font-bold text-xs bg-white focus:border-amber-500 outline-none"
                    />
                    <span className="text-xs text-slate-400 font-semibold">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleSaveGrades}
              disabled={savingGrades || students.length === 0}
              className="w-full py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingGrades ? "Saving Records..." : "Save Assessment Records"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Published Lesson Plans Table */}
      {recentPlans.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Active Curriculum Lesson Plans</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{recentPlans.length} published</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentPlans.map(plan => (
              <div key={plan.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-600">
                  <span>{plan.subject}</span>
                  <span className="text-slate-400 font-normal">{plan.duration} weeks</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{plan.title}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Added {plan.createdAt || "Recently"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent Communications & Advisory Inbox */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20 mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Parent Advisory & Direct Channel</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-slate-900">
              Guardian Inquiries & Family Communications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review messages sent by guardians regarding student entrance prep, attendance, and academic support.
            </p>
          </div>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Broadcast Announcement</span>
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No Pending Guardian Inquiries</p>
            <p className="text-[11px] text-slate-400">All student parent questions have been addressed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{m.sender_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      Candidate: {m.student_name} ({m.student_grade || "Grade 12"} - Section {m.student_section || "A"})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      Predicted Score: {m.student_predicted_score || 450}/700
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{m.created_at}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{m.subject}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
                    "{m.content}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Reply to ${m.sender_name}...`}
                    value={replyText[m.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [m.id]: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-emerald-500 outline-none"
                  />
                  <button
                    onClick={() => handleReplyMessage(m.id)}
                    disabled={replyingId === m.id}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{replyingId === m.id ? "Sending..." : "Reply"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Broadcast Parent Announcement
              </h3>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Target Cohort Grade
                </label>
                <select
                  value={broadcastForm.target_grade}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, target_grade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none bg-white cursor-pointer"
                >
                  <option value="all">All Enrolled Grades (School-Wide)</option>
                  <option value="12">Grade 12 (EUEE Candidates Only)</option>
                  <option value="11">Grade 11 (Preparatory Tier)</option>
                  <option value="10">Grade 10 (Secondary Foundations)</option>
                  <option value="9">Grade 9 (New Cohort)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Model Exam Schedule Announcement"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type notice to parents..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{broadcasting ? "Broadcasting..." : "Dispatch Announcement"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Invite Faculty Member
              </h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aster Bedada"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="aster@school.edu"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+251911223344"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Role *
                  </label>
                  <select
                    value={newTeacher.role}
                    onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="TEACHER">Teacher</option>
                    <option value="PRINCIPAL">Principal / Director</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="Natural Science">Natural Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Subject Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Assign Classroom Sections
                </label>
                {classrooms.length === 0 ? (
                  <p className="text-[11px] text-slate-400">No classroom sections configured yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-28 overflow-y-auto p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                    {classrooms.map((cls) => {
                      const isChecked = newTeacher.classroom_ids.includes(cls.id);
                      return (
                        <label key={cls.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewTeacher(prev => ({
                                ...prev,
                                classroom_ids: checked
                                  ? [...prev.classroom_ids, cls.id]
                                  : prev.classroom_ids.filter(id => id !== cls.id)
                              }));
                            }}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span className="truncate">{cls.name || `${cls.grade} ${cls.section}`}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-5 py-2 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs cursor-pointer"
                >
                  {inviting ? "Inviting..." : "Onboard Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
