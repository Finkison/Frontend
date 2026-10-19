import React from "react";
import AppShell from "../navigation/AppShell";

export default function StudentLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell overrideRole="STUDENT">
      {children}
    </AppShell>
  );
}
