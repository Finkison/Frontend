import React from "react";
import { Clock, ShieldAlert, BookOpen } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function WaitingForAssignmentView(): React.ReactElement {
  const { user } = useAuthStore();
  const subject = (user as any)?.subject || "Subject";

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center font-sans">
      <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] flex items-center justify-center mx-auto mb-4">
        <Clock className="w-7 h-7" />
      </div>
      <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">
        Waiting for assignment
      </h1>
      <p className="text-xs text-[#475569] mt-2 max-w-md mx-auto leading-relaxed">
        Your school director has registered your account as a <span className="font-semibold text-[#0F172A]">{subject}</span> teacher, but has not assigned you to active grade sections for the current academic year yet.
      </p>

      <div className="mt-8 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-left text-xs space-y-2">
        <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#1D4ED8]" />
          <span>Data isolation policy</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">
          In accordance with institutional data isolation policies, teachers cannot view student rosters, grades, or dispatch classroom assessments until an active teaching assignment is confirmed by the school administration.
        </p>
      </div>
    </div>
  );
}
