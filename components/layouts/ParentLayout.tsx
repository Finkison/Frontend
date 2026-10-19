import React from "react";
import AppShell from "../navigation/AppShell";

export default function ParentLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell overrideRole="PARENT">
      {children}
    </AppShell>
  );
}
