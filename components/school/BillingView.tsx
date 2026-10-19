import React, { useState, useEffect } from "react";
import { getSchoolProfile, expandSchoolLicense } from "../../services/schoolService";
import { CreditCard, Users, BrainCircuit, Check, ShieldCheck, Plus, Sparkles } from "lucide-react";
import { useToast } from "../ui/Toast";

export default function SchoolBillingView(): React.ReactElement {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExpandModal, setShowExpandModal] = useState(false);
  const [additionalSeats, setAdditionalSeats] = useState(50);
  const [expanding, setExpanding] = useState(false);

  useEffect(() => {
    getSchoolProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExpandSeats = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpanding(true);
    try {
      await expandSchoolLicense({
        additional_seats: Number(additionalSeats),
        payment_method: "Bank Transfer",
        reference_note: "Enterprise seat expansion order"
      });
      showToast({ title: "License expanded", message: `Added ${additionalSeats} student seats.`, type: "success" });
      setShowExpandModal(false);
      const res = await getSchoolProfile();
      setProfile(res.data);
    } catch {
      showToast({ title: "Error", message: "Failed to expand license.", type: "error" });
    } finally {
      setExpanding(false);
    }
  };

  const maxSeats = profile?.max_student_seats || 0;
  const usedSeats = profile?.used_seats || 0;
  const seatPct = maxSeats > 0 ? Math.min(100, Math.round((usedSeats / maxSeats) * 100)) : 0;
  const usedCredits = profile?.ai_credits_used || 0;
  const totalCredits = profile?.ai_credits_total || 20000;
  const creditPct = totalCredits > 0 ? Math.min(100, Math.round((usedCredits / totalCredits) * 100)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">Billing & Licenses</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Manage institutional seat allocations, monthly AI credits, and pedagogical tool limits.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowExpandModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[40px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
        >
          <Plus className="w-4 h-4" />
          <span>Expand seats</span>
        </button>
      </div>

      {/* Quota Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Seats */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-[#0F172A]">Student Seats</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A] font-mono">
              {usedSeats} <span className="text-sm font-normal text-slate-400">/ {maxSeats}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{Math.max(0, maxSeats - usedSeats)} seats remaining</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#881337] h-full" style={{ width: `${seatPct}%` }} />
          </div>
        </div>

        {/* Card 2: AI Credits */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-[#0F172A]">AI Credits Balance</span>
            <BrainCircuit className="w-4 h-4 text-[#881337]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#0F172A] font-mono">
              {usedCredits.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ {totalCredits.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Refreshes on 1st of each month</div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#D97706] h-full" style={{ width: `${creditPct}%` }} />
          </div>
        </div>

        {/* Card 3: Plan Status */}
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-[#0F172A]">Current Tier</span>
            <ShieldCheck className="w-4 h-4 text-[#881337]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0F172A]">
              Enterprise School
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Annual Institutional Contract</div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active • Renews Oct 2027
          </span>
        </div>
      </div>

      {/* Tool Limits Policy Configuration */}
      <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-[#0F172A]">Institutional AI Tool Limits</h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Pedagogical limits enforced across all teacher exam generators and AI teaching tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 border border-[#E2E8F0] rounded-[6px] bg-[#FAF8F5] space-y-1">
            <div className="font-semibold text-[#0F172A]">English, Biology, Chemistry</div>
            <div className="text-slate-500">Max Questions Per Exam Generator: <span className="font-bold text-[#0F172A]">100 Questions</span></div>
            <div className="text-[11px] text-slate-400">Cognitive Bloom taxonomy: Recall, Comprehension, Application</div>
          </div>
          <div className="p-3.5 border border-[#E2E8F0] rounded-[6px] bg-[#FAF8F5] space-y-1">
            <div className="font-semibold text-[#0F172A]">Mathematics & Physics</div>
            <div className="text-slate-500">Max Questions Per Exam Generator: <span className="font-bold text-[#0F172A]">60 Questions</span></div>
            <div className="text-[11px] text-slate-400">Step-by-step calculus, derivations, and multi-step computational problems</div>
          </div>
        </div>
      </div>

      {/* Expand Seats Modal */}
      {showExpandModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[8px] shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="text-sm font-semibold text-[#0F172A]">Expand Student Capacity</h2>
            </div>
            <form onSubmit={handleExpandSeats} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] mb-1">Additional Student Seats</label>
                <select
                  value={additionalSeats}
                  onChange={(e) => setAdditionalSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-[6px] bg-white text-xs"
                >
                  <option value={25}>+25 seats</option>
                  <option value={50}>+50 seats</option>
                  <option value={100}>+100 seats</option>
                  <option value={200}>+200 seats</option>
                </select>
              </div>
              <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] rounded-[6px] text-[#881337] text-xs">
                Invoices will be billed against your institutional account according to standard regional contract pricing.
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowExpandModal(false)}
                  className="px-3.5 py-2 border border-[#E2E8F0] rounded-[6px] text-[#475569] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={expanding}
                  className="px-3.5 py-2 bg-[#881337] hover:bg-[#9F1239] text-white rounded-[6px] font-semibold cursor-pointer transition-colors"
                >
                  {expanding ? "Expanding..." : "Confirm expansion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
