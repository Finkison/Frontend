import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbCrumb {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbCrumb[];
  className?: string;
}

function formatRouteSegment(segment: string): string {
  const map: Record<string, string> = {
    school: "School",
    class: "Classes",
    students: "Students",
    teachers: "Faculty",
    proctor: "Live Proctoring",
    reports: "Reports",
    settings: "Settings",
    student: "Student",
    lessons: "Course Materials",
    notes: "Smart Notes",
    practice: "Question Bank",
    "ai-tutor": "AI Tutor",
    score: "Score Forecast",
    "weak-areas": "Knowledge Gaps",
    "exam-history": "Exam History",
    "study-plan": "Study Planner",
    parent: "Family Portal",
    alerts: "Alerts",
    messages: "Messages",
    client: "Client Portal",
    "design-system": "Design System",
  };
  if (map[segment]) return map[segment];
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps): React.ReactElement {
  const location = useLocation();

  // If items not explicitly passed, auto-derive from pathname (max 4 levels)
  const crumbs: BreadcrumbCrumb[] = React.useMemo(() => {
    if (items && items.length > 0) return items.slice(0, 4);

    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ label: "Home" }];
    }

    const derived: BreadcrumbCrumb[] = [];
    let accumulatedPath = "";

    segments.slice(0, 4).forEach((seg, idx) => {
      accumulatedPath += `/${seg}`;
      const isLast = idx === segments.length - 1;
      derived.push({
        label: formatRouteSegment(seg),
        to: isLast ? undefined : accumulatedPath,
      });
    });

    return derived;
  }, [items, location.pathname]);

  if (crumbs.length === 0) return <></>;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium text-[#475569] ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const isMiddleCollapsed = crumbs.length > 2 && idx > 0 && idx < crumbs.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              )}

              {/* Mobile collapse middle items to '...' */}
              {isMiddleCollapsed && (
                <span className="sm:hidden text-slate-400 font-mono">...</span>
              )}

              <span className={isMiddleCollapsed ? "hidden sm:inline" : ""}>
                {isLast || !crumb.to ? (
                  <span
                    aria-current="page"
                    className="text-[#0F172A] font-semibold truncate max-w-[140px] sm:max-w-[200px]"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.to}
                    className="text-[#475569] hover:text-[#1D4ED8] hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] rounded px-0.5 truncate max-w-[120px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
