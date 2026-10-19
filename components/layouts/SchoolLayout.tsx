import React from "react";
import AppShell from "../navigation/AppShell";
import useAuthStore from "../../store/authStore";

export default function SchoolLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const { user } = useAuthStore();
  const role = user?.role === "TEACHER" ? "TEACHER" : "SCHOOL_ADMIN";

  return (
    <AppShell overrideRole={role}>
      {children}
    </AppShell>
  );
}
