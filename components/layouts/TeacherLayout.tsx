import React from "react";
import AppShell from "../navigation/AppShell";

export default function TeacherLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell overrideRole="TEACHER">
      {children}
    </AppShell>
  );
}
