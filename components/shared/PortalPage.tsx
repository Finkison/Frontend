import React from "react";

export interface PortalPageProps {
  children: React.ReactNode;
  className?: string;
}

export default function PortalPage({ children, className = "" }: PortalPageProps): React.ReactElement {
  const classes = className.split(/\s+/).filter(Boolean);
  const widthClass = classes.find((value) => value.startsWith("max-w-")) || "max-w-6xl";
  const spacingClass = classes.find((value) => value.startsWith("space-y-")) || "space-y-7";
  const remainingClasses = classes
    .filter((value) => !value.startsWith("max-w-") && !value.startsWith("space-y-"))
    .join(" ");

  return (
    <div className={`mx-auto w-full ${widthClass} ${spacingClass} pb-12 font-sans ${remainingClasses}`}>
      {children}
    </div>
  );
}
