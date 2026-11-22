import React from "react";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

export default function WaitingForAssignmentView(): React.ReactElement {
  const { user } = useAuthStore();
  const subject = user?.subject || "Subject";

  return (
    <PortalPage className="max-w-2xl space-y-6 px-4 py-10">
      <PageHeader
        title="Your classes are not assigned yet"
        description={`${subject} teaching tools will appear after your class is assigned.`}
      />

      <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-5 text-center dark:border-white/10 dark:bg-[#1C1512]">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#261E1A] dark:text-[#FDFBF7]">
          <ShieldAlert className="h-4 w-4 text-[#881337]" aria-hidden="true" />
          <span>Waiting for class assignment</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-stone-600 dark:text-[#E7E0D6]">
          Student rosters, grades, and classwork stay private until your assignment is confirmed.
        </p>
        <Link to="/contact" className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337]">
          Contact school support
        </Link>
      </div>
    </PortalPage>
  );
}
