import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Download,
  Plus,
  Users,
  GraduationCap,
  Layers,
  FileSpreadsheet,
  Settings,
  Flame,
  ArrowRight,
  ExternalLink,
  Code,
  Check,
  Building2,
  User,
  HeartHandshake,
  LayoutDashboard,
  Search,
  Menu,
  Bell,
  HelpCircle,
  Globe,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  EmptyState,
  Banner,
  Tabs,
  Modal,
  DataTable,
  Stepper,
} from "../components/ui";
import { ROLE_NAVIGATION_MAP } from "../components/navigation/navigationConfig";
import UnderlineTabs from "../components/navigation/UnderlineTabs";

export default function DesignSystemShowcasePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState("navigation");
  const [selectedNavRole, setSelectedNavRole] = useState<string>("SCHOOL_ADMIN");
  const [isSidebarPreviewCollapsed, setIsSidebarPreviewCollapsed] = useState(false);
  const [underlineTabActive, setUnderlineTabActive] = useState("overview");
  const [selectedRole, setSelectedRole] = useState("admin");
  const [modalOpen, setModalOpen] = useState(false);
  const [stepperIndex, setStepperIndex] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const tabs = [
    { id: "navigation", label: "Navigation system" },
    { id: "tokens", label: "Design tokens" },
    { id: "components", label: "Component library" },
    { id: "roles", label: "Roles & permissions" },
    { id: "flows", label: "Key workflows" },
    { id: "content", label: "Content & glossary" },
    { id: "audit", label: "Audit checklist" },
  ];

  // Sample Data for DataTable
  const sampleTableData = [
    { id: "SEC-101", name: "Natural Science Cohort A", grade: "12", section: "Section A", score: 620, target: 650, status: "On Track" },
    { id: "SEC-102", name: "Natural Science Cohort B", grade: "12", section: "Section B", score: 585, target: 600, status: "On Track" },
    { id: "SEC-103", name: "Social Science Cohort A", grade: "11", section: "Section A", score: 480, target: 500, status: "Review Needed" },
    { id: "SEC-104", name: "Natural Science Cohort C", grade: "12", section: "Section C", score: 672, target: 680, status: "On Track" },
    { id: "SEC-105", name: "Social Science Cohort B", grade: "11", section: "Section B", score: 450, target: 480, status: "Review Needed" },
  ];

  const tableColumns = [
    { key: "id", header: "Cohort ID", sortable: true, width: "120px" },
    { key: "name", header: "Cohort name", sortable: true },
    { key: "grade", header: "Grade", sortable: true, width: "80px" },
    { key: "section", header: "Section", sortable: true, width: "100px" },
    {
      key: "score",
      header: "Average score",
      sortable: true,
      numeric: true,
      render: (row: any) => (
        <span
          className={`font-semibold ${
            row.score >= 500 ? "text-[#15803D]" : row.score >= 350 ? "text-amber-600" : "text-rose-600 font-bold"
          }`}
        >
          {row.score} / 700
        </span>
      ),
    },
    {
      key: "target",
      header: "Target benchmark",
      numeric: true,
      render: (row: any) => <span>{row.target} / 700</span>,
    },
    {
      key: "status",
      header: "Benchmark status",
      render: (row: any) => (
        <Badge variant={row.status === "On Track" ? "brand" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  // Roles Navigation Config
  const roleNavMatrix: Record<string, { title: string; badge: string; desc: string; links: string[]; metrics: string[] }> = {
    super_admin: {
      title: "Platform Super Admin",
      badge: "Internal Team",
      desc: "Full institutional governance across tenant organizations, billing contracts, regional SLAs, and compliance archives.",
      links: ["School Directory", "District Tenants", "Global Roster Telemetry", "Contract Invoicing", "System Audit Logs", "Feature Flags"],
      metrics: ["Total Enrolled Districts", "Active School Licenses", "Server Cluster Latency", "National Exam Readiness Rate"],
    },
    admin: {
      title: "School / District Administrator",
      badge: "School Owner / Principal",
      desc: "Operational oversight for classrooms, academic terms, educator workloads, CSV roster ingestion, and statutory academic exports.",
      links: ["Executive Dashboard", "Class & Cohort Sections", "Candidate Roster", "Live Exam Proctoring", "Faculty Directory", "Transcripts & Reports", "School Settings"],
      metrics: ["Total Candidates (Active Seats)", "Section Attendance Rate", "Median EUEE Score Forecast", "At-Risk Intervention Count"],
    },
    teacher: {
      title: "Teacher / Faculty",
      badge: "Educator",
      desc: "Classroom instruction, curriculum unit progression, adaptive assignment generation, speed assessments, and parent advisories.",
      links: ["Faculty Dashboard", "Assigned Classes", "Curriculum Units", "Assignment Builder", "Gradebook Ledger", "Direct Parent Messages"],
      metrics: ["Active Section Size", "Assignment Submission Rate", "Cohort Unit Mastery", "Upcoming Exam Deadlines"],
    },
    student: {
      title: "Student / Candidate",
      badge: "Daily Learner",
      desc: "Personalized national exam preparation, modular textbook lessons, timed past papers, Socratic AI tutor drills, and score forecasting.",
      links: ["Study Dashboard", "Course Materials", "Smart Notes", "Knowledge Pathway", "Question Bank & Drills", "Mock Examinations", "Score Forecast"],
      metrics: ["Current EUEE Forecast Score", "Daily Practice Streak", "Curriculum Coverage %", "Weekly Drills Completed"],
    },
    parent: {
      title: "Parent / Guardian",
      badge: "Guardian",
      desc: "Real-time visibility into student attendance, benchmark exam forecasts, critical academic deficit alerts, and faculty communication.",
      links: ["Child Progress Overview", "Academic Risk Alerts", "Teacher Direct Messages", "Statutory Report Cards"],
      metrics: ["Child Predicted Score", "Weekly Attendance Rate", "Active Course Assignments", "Unread Teacher Advisories"],
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Design system"
          description="Enterprise design tokens, component specifications, role-based navigation rules, and audit guidelines for Finkison EdTech."
          breadcrumbs={[
            { label: "Institutional Portal", href: "/" },
            { label: "Design system" },
          ]}
          badge={{ text: "Standard v2.4", variant: "brand" }}
          primaryAction={{
            label: "Open modal",
            onClick: () => setModalOpen(true),
            variant: "primary",
          }}
          secondaryActions={[
            {
              label: "View specification",
              href: "#tokens",
              variant: "secondary",
            },
          ]}
        />

        {/* System Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* TAB 0: NAVIGATION SYSTEM STANDARDIZATION */}
        {activeTab === "navigation" && (
          <div className="space-y-6">
            {/* 1. App Shell Architecture Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle>Unified institutional app shell</CardTitle>
                    <CardDescription>
                      Three persistent regions: left sidebar, top bar, and independently scrolling content area. The shell layout never changes position, size, or style across pages.
                    </CardDescription>
                  </div>
                  <Badge variant="brand">Standard v2.4</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                      <span className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-mono text-[11px] border border-[#15803D]/20">1</span>
                      <span>Left sidebar</span>
                    </div>
                    <p className="text-[#475569] leading-5">
                      240px expanded, 64px collapsed icon rail, 280px mobile drawer. Background #FFFFFF, 1px right border #E2E8F0. User collapse preference remembered in localStorage.
                    </p>
                  </div>

                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                      <span className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-mono text-[11px] border border-[#15803D]/20">2</span>
                      <span>Top bar</span>
                    </div>
                    <p className="text-[#475569] leading-5">
                      Fixed 56px height, background #FFFFFF, bottom border #E2E8F0. Hosts sidebar toggle, breadcrumbs, 360px global command search (Ctrl+K), and fixed 5-action right cluster.
                    </p>
                  </div>

                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                      <span className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-mono text-[11px] border border-[#15803D]/20">3</span>
                      <span>Content area & bottom bar</span>
                    </div>
                    <p className="text-[#475569] leading-5">
                      1280px max width, scrolls independently. Skip-to-content is the first focusable element. Mobile students & parents receive a 64px persistent bottom tab bar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Interactive Role Menu Map & Sidebar Preview */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Role-based menus & interactive preview</CardTitle>
                    <CardDescription>
                      Same structure and component styling across every role. Only the navigation items change by role. Select a role to test its exact sidebar and mobile tabs.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsSidebarPreviewCollapsed((v) => !v)}
                    >
                      {isSidebarPreviewCollapsed ? "Expand to 240px" : "Collapse to 64px"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Switcher Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "SUPER_ADMIN", label: "Super Admin" },
                    { id: "SCHOOL_ADMIN", label: "School Admin" },
                    { id: "TEACHER", label: "Teacher" },
                    { id: "STUDENT", label: "Student" },
                    { id: "PARENT", label: "Parent" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedNavRole(r.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-[8px] border transition-colors cursor-pointer min-h-[44px] ${
                        selectedNavRole === r.id
                          ? "bg-[#F0FDF4] border-[#15803D] text-[#15803D]"
                          : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Live Sidebar Interactive Demonstration */}
                {ROLE_NAVIGATION_MAP[selectedNavRole] && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Simulated Sidebar Preview Frame */}
                    <div className="lg:col-span-5 border border-[#E2E8F0] rounded-[8px] bg-white overflow-hidden shadow-2xs">
                      <div className="p-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                        <span className="font-semibold">
                          Sidebar Preview ({isSidebarPreviewCollapsed ? "64px Collapsed" : "240px Expanded"})
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Role: {ROLE_NAVIGATION_MAP[selectedNavRole].roleName}
                        </span>
                      </div>

                      <div
                        className={`transition-all duration-200 p-2 space-y-3 ${
                          isSidebarPreviewCollapsed ? "w-[64px] mx-auto" : "w-full"
                        }`}
                      >
                        {/* 1. Org Block */}
                        <div className="p-2 border-b border-slate-100 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-[8px] bg-[#15803D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          {!isSidebarPreviewCollapsed && (
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#0F172A] truncate">Finkison Academy</p>
                              <p className="text-[10px] text-slate-400 truncate">{ROLE_NAVIGATION_MAP[selectedNavRole].roleName}</p>
                            </div>
                          )}
                        </div>

                        {/* 2. Primary Navigation */}
                        <div className="space-y-1">
                          {!isSidebarPreviewCollapsed && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                              Primary ({ROLE_NAVIGATION_MAP[selectedNavRole].primaryNav.length} items)
                            </p>
                          )}
                          {ROLE_NAVIGATION_MAP[selectedNavRole].primaryNav.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = idx === 0;
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center h-[40px] px-3 rounded-[8px] text-xs font-medium cursor-pointer transition-colors ${
                                  isSidebarPreviewCollapsed ? "justify-center" : "gap-2"
                                } ${
                                  isActive
                                    ? "bg-[#F0FDF4] text-[#15803D] border-l-[3px] border-[#15803D] font-semibold"
                                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                                }`}
                              >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#15803D]" : "text-[#475569]"}`} />
                                {!isSidebarPreviewCollapsed && (
                                  <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge !== undefined && (
                                      <span className="px-1.5 py-0.5 rounded-[8px] text-[10px] font-mono tabular-nums font-bold bg-slate-100 text-slate-600">
                                        {item.badge}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* 3. Secondary Navigation */}
                        <div className="space-y-1 pt-1">
                          {isSidebarPreviewCollapsed ? (
                            <div className="h-px bg-slate-200 my-2" />
                          ) : (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
                              {ROLE_NAVIGATION_MAP[selectedNavRole].secondaryNav.groupTitle || "Secondary"}
                            </p>
                          )}
                          {ROLE_NAVIGATION_MAP[selectedNavRole].secondaryNav.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center h-[40px] px-3 rounded-[8px] text-xs font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] cursor-pointer ${
                                  isSidebarPreviewCollapsed ? "justify-center" : "gap-2"
                                }`}
                              >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isSidebarPreviewCollapsed && (
                                  <>
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.badge !== undefined && (
                                      <span className="px-1.5 py-0.5 rounded-[8px] text-[10px] font-mono tabular-nums font-bold bg-slate-100 text-slate-600">
                                        {item.badge}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* 4. Bottom Items */}
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          {ROLE_NAVIGATION_MAP[selectedNavRole].bottomItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.id}
                                className={`flex items-center h-[40px] px-3 rounded-[8px] text-xs font-medium text-[#475569] hover:bg-[#F8FAFC] cursor-pointer ${
                                  isSidebarPreviewCollapsed ? "justify-center" : "gap-2"
                                }`}
                              >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isSidebarPreviewCollapsed && <span className="truncate">{item.label}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Role Menu Metadata & Rules Breakdown */}
                    <div className="lg:col-span-7 space-y-4 text-xs">
                      <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-3">
                        <h4 className="font-bold text-[#0F172A] text-sm">
                          Exact Menu Schema: {ROLE_NAVIGATION_MAP[selectedNavRole].roleName}
                        </h4>
                        <div className="space-y-2">
                          <p className="font-semibold text-slate-700">Primary Destinations (Max 7):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ROLE_NAVIGATION_MAP[selectedNavRole].primaryNav.map((item) => (
                              <span
                                key={item.id}
                                className="px-2.5 py-1 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-medium flex items-center gap-1.5"
                              >
                                <item.icon className="w-3.5 h-3.5 text-[#15803D]" />
                                <span>{item.label}</span>
                                <span className="text-slate-400 font-mono text-[10px]">({item.to})</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <p className="font-semibold text-slate-700">Secondary Grouped Items (Max 5):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ROLE_NAVIGATION_MAP[selectedNavRole].secondaryNav.items.map((item) => (
                              <span
                                key={item.id}
                                className="px-2.5 py-1 rounded-[8px] bg-white border border-[#E2E8F0] text-[#475569] font-medium flex items-center gap-1.5"
                              >
                                <item.icon className="w-3.5 h-3.5 text-slate-500" />
                                <span>{item.label}</span>
                                <span className="text-slate-400 font-mono text-[10px]">({item.to})</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {ROLE_NAVIGATION_MAP[selectedNavRole].mobileBottomTabs && (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <p className="font-semibold text-[#15803D] flex items-center gap-1.5">
                              <span>Mobile Bottom Tab Bar (64px, 5 items):</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {ROLE_NAVIGATION_MAP[selectedNavRole].mobileBottomTabs!.map((tab) => (
                                <span
                                  key={tab.id}
                                  className="px-2.5 py-1 rounded-[8px] bg-[#F0FDF4] border border-[#15803D]/20 text-[#15803D] font-bold flex items-center gap-1.5"
                                >
                                  <tab.icon className="w-3.5 h-3.5" />
                                  <span>{tab.label}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Architecture Enforcement Box */}
                      <div className="p-4 rounded-[8px] bg-[#F0FDF4] border border-[#15803D]/20 space-y-1.5 text-slate-800">
                        <p className="font-bold text-[#15803D]">Consistency Guarantee</p>
                        <p>
                          Every item uses the exact same label, icon, and route across roles. Items the user cannot access are hidden (never disabled). Max one level of nesting; sub-features use tabs inside the page.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. Item Anatomy & All 5 Interaction States */}
            <Card>
              <CardHeader>
                <CardTitle>Sidebar item anatomy & 5 interactive states</CardTitle>
                <CardDescription>
                  Exact specifications: Height 40px, horizontal padding 12px, radius 8px, icon 20px, 8px gap, Body 14/20 weight 500.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  {/* Default State */}
                  <div className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">1. Default</p>
                    <div className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] text-[#475569] font-medium border border-transparent">
                      <Layers className="w-5 h-5 text-[#475569]" />
                      <span>Classes</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Text & icon #475569</p>
                  </div>

                  {/* Hover State */}
                  <div className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">2. Hover</p>
                    <div className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] bg-[#F8FAFC] text-[#0F172A] font-medium border border-transparent">
                      <Layers className="w-5 h-5 text-[#0F172A]" />
                      <span>Classes</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Bg #F8FAFC, text #0F172A</p>
                  </div>

                  {/* Active State */}
                  <div className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-[#15803D] uppercase tracking-wider text-[10px]">3. Active</p>
                    <div className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] bg-[#F0FDF4] text-[#15803D] font-semibold border-l-[3px] border-[#15803D]">
                      <Layers className="w-5 h-5 text-[#15803D]" />
                      <span>Classes</span>
                    </div>
                    <p className="text-[11px] text-[#15803D]">Bg #F0FDF4, 3px green left indicator</p>
                  </div>

                  {/* Focus State */}
                  <div className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">4. Focus</p>
                    <div className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] text-[#0F172A] font-medium ring-2 ring-[#15803D] ring-offset-2">
                      <Layers className="w-5 h-5 text-[#0F172A]" />
                      <span>Classes</span>
                    </div>
                    <p className="text-[11px] text-slate-400">2px green ring, 2px offset</p>
                  </div>

                  {/* Disabled State */}
                  <div className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">5. Disabled</p>
                    <div className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] text-[#475569] opacity-40 cursor-not-allowed">
                      <Layers className="w-5 h-5 text-[#475569]" />
                      <span>Classes</span>
                    </div>
                    <p className="text-[11px] text-slate-400">40% opacity, tooltip reason</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Top Bar Interactive Anatomy */}
            <Card>
              <CardHeader>
                <CardTitle>Top bar layout & fixed right action order</CardTitle>
                <CardDescription>
                  Height 56px, background #FFFFFF, bottom border 1px #E2E8F0. Hosts global command search (360px) and fixed 5-action right sequence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-[#E2E8F0] rounded-[8px] bg-white p-3 space-y-4">
                  {/* Visual TopBar Blueprint */}
                  <div className="h-[56px] border border-[#E2E8F0] rounded-[8px] bg-white px-4 flex items-center justify-between gap-3 shadow-2xs">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-[8px] bg-slate-100 text-slate-600">
                        <Menu className="w-4 h-4" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[#475569]">School</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-[#0F172A] font-semibold">Classes</span>
                      </div>
                    </div>

                    {/* Center Search */}
                    <div className="hidden md:flex items-center justify-between w-72 px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5" />
                        <span>Search (360px)...</span>
                      </div>
                      <kbd className="px-1 rounded border bg-white font-mono text-[9px]">Ctrl+K</kbd>
                    </div>

                    {/* Right Fixed Cluster */}
                    <div className="flex items-center gap-1.5">
                      <span className="p-1.5 rounded text-slate-600 hover:bg-slate-50" title="1. Quick create (+)"><Plus className="w-4 h-4" /></span>
                      <span className="p-1.5 rounded text-slate-600 relative hover:bg-slate-50" title="2. Notifications (capped at 9+)">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#15803D] text-white rounded-full text-[8px] flex items-center justify-center font-bold">4</span>
                      </span>
                      <span className="p-1.5 rounded text-slate-600 hover:bg-slate-50" title="3. Help"><HelpCircle className="w-4 h-4" /></span>
                      <span className="p-1.5 rounded text-slate-600 hover:bg-slate-50" title="4. Language switcher"><Globe className="w-4 h-4" /></span>
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center ml-1" title="5. Profile menu">D</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] text-[#475569] pt-2">
                    <p>• <strong>1. Quick create (+):</strong> New student, class, assignment</p>
                    <p>• <strong>2. Notifications:</strong> Cap at 9+, All/Unread tabs</p>
                    <p>• <strong>3. Help:</strong> Docs, Shortcuts, Support</p>
                    <p>• <strong>4. Language:</strong> EN, AM, OM, TI</p>
                    <p>• <strong>5. Profile menu:</strong> Identity, settings, sign out</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. Underline Tabs Specification */}
            <Card>
              <CardHeader>
                <CardTitle>Underline tabs (In-page secondary navigation)</CardTitle>
                <CardDescription>
                  Underline tabs with 2px brand green indicator. Max 6 visible tabs; 7th tab and above automatically overflow into a 'More' dropdown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <UnderlineTabs
                  tabs={[
                    { id: "overview", label: "Overview", count: 12 },
                    { id: "curriculum", label: "Curriculum units" },
                    { id: "assignments", label: "Assignments", count: 4 },
                    { id: "students", label: "Student roster", count: 48 },
                    { id: "gradebook", label: "Gradebook ledger" },
                    { id: "attendance", label: "Daily attendance" },
                    { id: "timetable", label: "Timetable schedule" },
                    { id: "analytics", label: "Telemetry & reports" },
                  ]}
                  activeTab={underlineTabActive}
                  onChange={setUnderlineTabActive}
                />
                <p className="text-xs text-[#475569]">
                  Active tab: <strong className="text-[#15803D]">{underlineTabActive}</strong>. Tabs switch in-page views and never trigger full navigation reloads.
                </p>
              </CardContent>
            </Card>

            {/* 6. Responsive Behavior & Accessibility Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Responsive behavior & WCAG 2.2 AA accessibility</CardTitle>
                <CardDescription>
                  Systematic viewport adaptations and strict keyboard focus management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-[#0F172A]">Responsive Breakpoint Rules</p>
                    <ul className="space-y-1.5 text-[#475569]">
                      <li>• <strong>Desktop (1280px+):</strong> Persistent 240px expanded sidebar.</li>
                      <li>• <strong>Laptop & Tablet Landscape (1024–1279px):</strong> Collapsed 64px sidebar by default; expands via toggle.</li>
                      <li>• <strong>Tablet Portrait & Mobile (&lt;1024px):</strong> 280px drawer opened from TopBar hamburger with backdrop blur.</li>
                      <li>• <strong>Mobile Students & Parents:</strong> Persistent 64px bottom tab bar (max 5 items, touch target &ge; 44px).</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <p className="font-bold text-[#0F172A]">Accessibility & Localization Rules</p>
                    <ul className="space-y-1.5 text-[#475569]">
                      <li>• <strong>Semantic Landmarks:</strong> Sidebar is <code>&lt;nav aria-label="Main"&gt;</code>, breadcrumbs are <code>&lt;nav aria-label="Breadcrumb"&gt;</code>.</li>
                      <li>• <strong>Current Page:</strong> Active items enforce <code>aria-current="page"</code>.</li>
                      <li>• <strong>Keyboard Order:</strong> Skip-to-content &rarr; Sidebar &rarr; TopBar &rarr; Main content. Esc closes drawers.</li>
                      <li>• <strong>Localization Ready:</strong> Accommodates 40% text expansion (Amharic/Tigrinya) with ellipsis truncation; never wraps.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 1: DESIGN TOKENS */}
        {activeTab === "tokens" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color tokens & contrast standards</CardTitle>
                <CardDescription>
                  Strict brand green palette with light-theme backgrounds and WCAG 2.2 AA compliant neutrals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Brand Green */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#15803D] flex items-center justify-center text-white font-mono text-xs font-bold">
                      #15803D
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Primary brand green</p>
                      <p className="text-[11px] text-[#475569]">Buttons, active tabs, key indicators</p>
                    </div>
                  </div>

                  {/* Green Hover */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#166534] flex items-center justify-center text-white font-mono text-xs font-bold">
                      #166534
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Brand green hover</p>
                      <p className="text-[11px] text-[#475569]">Hover state for primary actions</p>
                    </div>
                  </div>

                  {/* Green Tint */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#F0FDF4] border border-[#15803D]/20 flex items-center justify-center text-[#15803D] font-mono text-xs font-bold">
                      #F0FDF4
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Green surface tint</p>
                      <p className="text-[11px] text-[#475569]">Active navigation item backgrounds</p>
                    </div>
                  </div>

                  {/* Surface Neutral */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] font-mono text-xs font-bold">
                      #F8FAFC
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">App background</p>
                      <p className="text-[11px] text-[#475569]">Soft institutional off-white</p>
                    </div>
                  </div>

                  {/* Border Neutral */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#E2E8F0] flex items-center justify-center text-[#0F172A] font-mono text-xs font-bold">
                      #E2E8F0
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Structural border</p>
                      <p className="text-[11px] text-[#475569]">Subtle boundaries (prefer over shadows)</p>
                    </div>
                  </div>

                  {/* Text Primary */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#0F172A] flex items-center justify-center text-white font-mono text-xs font-bold">
                      #0F172A
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Primary typography</p>
                      <p className="text-[11px] text-[#475569]">14.8:1 contrast on white (exceeds AAA)</p>
                    </div>
                  </div>

                  {/* Text Secondary */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-[#475569] flex items-center justify-center text-white font-mono text-xs font-bold">
                      #475569
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Secondary typography</p>
                      <p className="text-[11px] text-[#475569]">6.4:1 contrast on white (WCAG AA)</p>
                    </div>
                  </div>

                  {/* Semantic Alert */}
                  <div className="p-4 rounded-[8px] border border-[#E2E8F0] bg-white space-y-2">
                    <div className="h-14 rounded-[8px] bg-rose-600 flex items-center justify-center text-white font-mono text-xs font-bold">
                      #E11D48
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">Destructive / Error</p>
                      <p className="text-[11px] text-[#475569]">At-risk flags, irreversible actions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography & tabular numerals</CardTitle>
                <CardDescription>
                  Single font family Inter. Weights 400, 500, and 600 only. Numbers in grades and metrics use tabular numerals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-[8px] bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400">Display 32/40 (600)</p>
                      <p className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">Institutional telemetry</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Tabular numerals</p>
                      <p className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-[#15803D]">
                        ETB 1,480,250.00
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[8px] bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400">H1 24/32 (600)</p>
                      <p className="text-xl font-semibold text-[#0F172A]">National examination cohort</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Aligned metrics</p>
                      <p className="text-xl font-mono tabular-nums font-semibold text-[#0F172A]">
                        642 / 700 pts (91.7%)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[8px] bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono text-slate-400">Body 14/20 (400 / 500)</p>
                      <p className="text-sm text-[#475569] max-w-[70ch]">
                        Every student record is encrypted with AES-256 and synchronized through domestic Tier-3 datacenters. FERPA compliant.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Small 12/16 (500)</p>
                      <p className="text-xs font-medium text-[#475569]">
                        Last synced: 2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: COMPONENT LIBRARY */}
        {activeTab === "components" && (
          <div className="space-y-6">
            {/* Buttons Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons & interaction states</CardTitle>
                <CardDescription>
                  8 states: default, hover, focus, active, disabled, loading, error, empty. Verb-first labels (1-2 words).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wide">Variants</p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">Add student</Button>
                      <Button variant="secondary">Export roster</Button>
                      <Button variant="ghost">View log</Button>
                      <Button variant="destructive">Revoke access</Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#475569] mb-2 uppercase tracking-wide">Special states</p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" loading>Save changes</Button>
                      <Button variant="primary" disabled>Publish exam</Button>
                      <Button variant="secondary" error>Network failed</Button>
                      <Button variant="primary" icon={Plus}>Create class</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Form Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Form controls</CardTitle>
                <CardDescription>
                  Inputs and selects with labels, single-line helper text, and error messages under 15 words.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="School name"
                    placeholder="Enter registered school name"
                    helperText="Must match regional educational bureau certificate."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (e.target.value.length < 3 && e.target.value.length > 0) {
                        setInputError("School name must be at least 3 characters.");
                      } else {
                        setInputError("");
                      }
                    }}
                    error={inputError}
                  />

                  <Select
                    label="Academic stream"
                    options={[
                      { value: "natural", label: "Natural Science" },
                      { value: "social", label: "Social Science" },
                      { value: "general", label: "General Secondary (Grades 9-10)" },
                    ]}
                    helperText="Determines national exam syllabus and item bank."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Badges & Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Badges & semantic alerts</CardTitle>
                <CardDescription>
                  Semantic status markers with text, border, and background tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="brand">Brand active</Badge>
                  <Badge variant="success">Passed exam</Badge>
                  <Badge variant="warning">Low attendance</Badge>
                  <Badge variant="error">At-risk (&lt;350)</Badge>
                  <Badge variant="info">Scheduled mock</Badge>
                  <Badge variant="neutral">Draft section</Badge>
                </div>

                <div className="space-y-2.5">
                  <Banner
                    variant="info"
                    title="Statutory data notice"
                    message="All candidate records conform to Ethiopian Educational Data Standards."
                  />
                  <Banner
                    variant="warning"
                    title="Pending roster sync"
                    message="3 students are pending seat assignment. Roster updates finalize in 24 hours."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Standardized data table</CardTitle>
                <CardDescription>
                  Sortable headers, filter search, pagination, bulk selection, and tabular numerals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={tableColumns}
                  data={sampleTableData}
                  searchKey="name"
                  searchPlaceholder="Filter candidate by name..."
                  pageSize={3}
                  bulkActions={[
                    {
                      label: "Send notice",
                      onClick: (rows) => alert(`Notice sent to ${rows.length} candidates`),
                      variant: "secondary",
                    },
                    {
                      label: "Assign drill",
                      onClick: (rows) => alert(`Assigned drill to ${rows.length} candidates`),
                      variant: "primary",
                    },
                  ]}
                  onExportCsv={() => alert("Exported candidate roster CSV")}
                />
              </CardContent>
            </Card>

            {/* Stepper Component */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow stepper</CardTitle>
                <CardDescription>
                  Step progress indicator used in multi-phase administrative setups.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stepper
                  steps={[
                    { id: "s1", title: "Organization", description: "School details" },
                    { id: "s2", title: "Calendar & terms", description: "Semester dates" },
                    { id: "s3", title: "Roster import", description: "CSV upload" },
                    { id: "s4", title: "Invite teachers", description: "Faculty emails" },
                  ]}
                  currentStep={stepperIndex}
                  onStepClick={(idx) => setStepperIndex(idx)}
                />
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={stepperIndex === 0}
                    onClick={() => setStepperIndex((s) => Math.max(0, s - 1))}
                  >
                    Previous step
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={stepperIndex === 3}
                    onClick={() => setStepperIndex((s) => Math.min(3, s + 1))}
                  >
                    Next step
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* TAB 3: ROLES & PERMISSIONS */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role-based access matrix</CardTitle>
                <CardDescription>
                  Select a role to inspect its tailored navigation, default page, and key operational metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(roleNavMatrix).map((roleKey) => (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => setSelectedRole(roleKey)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-[8px] border transition-colors cursor-pointer min-h-[44px] ${
                        selectedRole === roleKey
                          ? "bg-[#F0FDF4] border-[#15803D] text-[#15803D]"
                          : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-slate-50"
                      }`}
                    >
                      {roleNavMatrix[roleKey].title}
                    </button>
                  ))}
                </div>

                {/* Role Details Card */}
                {selectedRole && (
                  <div className="border border-[#E2E8F0] rounded-[8px] bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-[#0F172A]">
                          {roleNavMatrix[selectedRole].title}
                        </h4>
                        <p className="text-xs text-[#475569]">
                          {roleNavMatrix[selectedRole].desc}
                        </p>
                      </div>
                      <Badge variant="brand">{roleNavMatrix[selectedRole].badge}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Sidebar navigation items (Show only what this role needs)
                        </p>
                        <ul className="space-y-1.5">
                          {roleNavMatrix[selectedRole].links.map((link) => (
                            <li
                              key={link}
                              className="text-xs text-[#0F172A] flex items-center gap-2 p-2 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                              <span>{link}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Key metrics on dashboard (Max 4 metrics)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {roleNavMatrix[selectedRole].metrics.map((metric, idx) => (
                            <div
                              key={metric}
                              className="p-3 rounded-[8px] border border-[#E2E8F0] bg-white space-y-1"
                            >
                              <p className="text-[11px] text-[#475569]">{metric}</p>
                              <p className="text-base font-mono tabular-nums font-bold text-[#0F172A]">
                                {idx === 0 ? "1,248" : idx === 1 ? "98.4%" : idx === 2 ? "592 / 700" : "14"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: KEY WORKFLOWS */}
        {activeTab === "flows" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>5 core institutional workflows</CardTitle>
                <CardDescription>
                  Each workflow is designed end-to-end with entry points, minimal steps, validation, confirmation, and failure recovery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Flow 1 */}
                  <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#15803D] font-bold text-xs flex items-center justify-center border border-[#15803D]/30">
                          1
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          School onboarding & CSV roster ingestion
                        </h4>
                      </div>
                      <Badge variant="brand">Admin Flow</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Entry</p>
                        <p className="text-[#475569] mt-0.5">Landing page /checkout or sales invite link.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Steps</p>
                        <p className="text-[#475569] mt-0.5">Org profile → Academic terms → CSV drop → Invite faculty.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Validation</p>
                        <p className="text-[#475569] mt-0.5">Unique student phone, valid section tags, header row check.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Confirmation</p>
                        <p className="text-[#475569] mt-0.5">Import receipt + auto-generated credential slips.</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow 2 */}
                  <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#15803D] font-bold text-xs flex items-center justify-center border border-[#15803D]/30">
                          2
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Teacher class assignment & grading
                        </h4>
                      </div>
                      <Badge variant="info">Teacher Flow</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Entry</p>
                        <p className="text-[#475569] mt-0.5">Teacher dashboard or Classes section view.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Steps</p>
                        <p className="text-[#475569] mt-0.5">Select syllabus unit → Dispatch past paper / quiz → Review grades.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Validation</p>
                        <p className="text-[#475569] mt-0.5">Passing threshold between 0-100%, due date in future.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Confirmation</p>
                        <p className="text-[#475569] mt-0.5">Toast alert + student notification badge dispatch.</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow 3 */}
                  <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#15803D] font-bold text-xs flex items-center justify-center border border-[#15803D]/30">
                          3
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Student task completion & instant feedback
                        </h4>
                      </div>
                      <Badge variant="success">Student Flow</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Entry</p>
                        <p className="text-[#475569] mt-0.5">Student command center active tasks list.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Steps</p>
                        <p className="text-[#475569] mt-0.5">Launch drill → Submit answers → View step-by-step breakdown.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Validation</p>
                        <p className="text-[#475569] mt-0.5">Session recovery cache preserves inputs.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Confirmation</p>
                        <p className="text-[#475569] mt-0.5">Score updated on predictor + weak unit tag recorded.</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow 4 */}
                  <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#15803D] font-bold text-xs flex items-center justify-center border border-[#15803D]/30">
                          4
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          District administrator audit & seat scaling
                        </h4>
                      </div>
                      <Badge variant="brand">District Flow</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Entry</p>
                        <p className="text-[#475569] mt-0.5">Billing portal or institutional settings.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Steps</p>
                        <p className="text-[#475569] mt-0.5">View seat meter → Adjust tier slider → Download invoice.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Validation</p>
                        <p className="text-[#475569] mt-0.5">Tax identification number verification.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Confirmation</p>
                        <p className="text-[#475569] mt-0.5">PDF invoice with QR verification code.</p>
                      </div>
                    </div>
                  </div>

                  {/* Flow 5 */}
                  <div className="border border-[#E2E8F0] rounded-[8px] p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#F0FDF4] text-[#15803D] font-bold text-xs flex items-center justify-center border border-[#15803D]/30">
                          5
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          Parent progress inspection & teacher inquiry
                        </h4>
                      </div>
                      <Badge variant="warning">Parent Flow</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Entry</p>
                        <p className="text-[#475569] mt-0.5">Parent portal home or SMS notification link.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Steps</p>
                        <p className="text-[#475569] mt-0.5">View predicted score → Inspect attendance → Message teacher.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Validation</p>
                        <p className="text-[#475569] mt-0.5">Single-thread restriction per subject teacher.</p>
                      </div>
                      <div className="p-3 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
                        <p className="font-semibold text-[#0F172A]">Confirmation</p>
                        <p className="text-[#475569] mt-0.5">Timestamped thread receipt with read state.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: CONTENT & GLOSSARY */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Institutional terminology glossary</CardTitle>
                <CardDescription>
                  Consistency rules: Use standard educational terms throughout all screens, error messages, and documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto border border-[#E2E8F0] rounded-[8px]">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569]">
                        <th className="p-3 font-semibold">Standard institutional term</th>
                        <th className="p-3 font-semibold text-rose-600">Prohibited / Consumer term</th>
                        <th className="p-3 font-semibold">Definition & contextual usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr>
                        <td className="p-3 font-semibold text-[#15803D]">Class</td>
                        <td className="p-3 text-slate-500 line-through">Course, Group, Batch</td>
                        <td className="p-3 text-[#475569]">An academic section organized under a grade (e.g. Grade 12 Section A).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#15803D]">Candidate</td>
                        <td className="p-3 text-slate-500 line-through">Client, Customer, User</td>
                        <td className="p-3 text-[#475569]">A registered student sitting for benchmark assessments or national entrance exams.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#15803D]">Faculty</td>
                        <td className="p-3 text-slate-500 line-through">Staffers, Employees</td>
                        <td className="p-3 text-[#475569]">The instructional teaching personnel assigned to sections within a school.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#15803D]">Benchmark Assessment</td>
                        <td className="p-3 text-slate-500 line-through">Mini-game, Trivia</td>
                        <td className="p-3 text-[#475569]">Timed, curriculum-aligned diagnostic examinations mimicking the national EUEE standard.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-[#15803D]">Terminal Report Card</td>
                        <td className="p-3 text-slate-500 line-through">Score slip, Report</td>
                        <td className="p-3 text-[#475569]">Statutory academic transcript ready for official educational submission.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Microcopy standards</CardTitle>
                <CardDescription>
                  Concise, institutional phrasing. No marketing superlatives or conversational filler.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-[8px] border border-emerald-200 bg-[#F0FDF4] space-y-1.5">
                    <p className="font-bold text-[#15803D]">Recommended (Institutional tone)</p>
                    <ul className="space-y-1 text-slate-700">
                      <li>• "Add student" (Verb-first, 2 words)</li>
                      <li>• "Class size exceeds maximum seat capacity of 60." (&lt;15 words)</li>
                      <li>• "No candidates registered for Section B." (Short empty state)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-[8px] border border-rose-200 bg-rose-50 space-y-1.5">
                    <p className="font-bold text-rose-700">Prohibited (Consumer/Hype tone)</p>
                    <ul className="space-y-1 text-slate-700">
                      <li>• "Supercharge your classroom now!" (Marketing hype)</li>
                      <li>• "Oops, something went wrong on our end, check back later!" (Vague error)</li>
                      <li>• "Hey there, you haven't added anyone yet!" (Overly casual)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 6: AUDIT CHECKLIST */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Design system compliance audit checklist</CardTitle>
                <CardDescription>
                  Confirm every screen adheres to enterprise accessibility, performance, and typography standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs">
                  {[
                    { label: "WCAG 2.2 AA Contrast", desc: "All text elements meet 4.5:1 minimum contrast ratio against #FFFFFF / #F8FAFC surfaces." },
                    { label: "Touch Target Sizing", desc: "Interactive buttons, links, inputs, and tab triggers meet 44x44px minimum touch targets." },
                    { label: "Tabular Numerals", desc: "All tables, grades, exam percentages, and metrics use font-mono and tabular-nums." },
                    { label: "Single Typography System", desc: "Inter font with strict scale (Display 32, H1 24, H2 20, H3 16, Body 14, Small 12) with 400/500/600 weights." },
                    { label: "Restricted Green Usage", desc: "#15803D used strictly for primary action buttons, active navigation, and key progress meters." },
                    { label: "Border-First Elevation", desc: "Subtle borders (#E2E8F0) preferred over heavy dropshadows across cards and modules." },
                    { label: "Concise Institutional Copy", desc: "Page titles 1-3 words, button labels 1-2 verb-first words, error messages under 15 words." },
                    { label: "FERPA / Data Sovereignty", desc: "Zero student data monetization guarantee with domestic datacenter compliance statement." },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#F0FDF4] text-[#15803D] flex items-center justify-center shrink-0 mt-0.5 border border-[#15803D]/20">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A]">{item.label}</p>
                        <p className="text-[#475569] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interactive Modal Demonstration */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Institutional audit summary"
          description="Export official telemetry report for regional bureau submission."
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert("Audit report generated");
                  setModalOpen(false);
                }}
              >
                Download report
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs text-[#475569]">
            <p>
              This report compiles candidate enrollment counts, section capacities, and national examination diagnostic scores for the current academic year.
            </p>
            <div className="p-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <p className="font-semibold text-[#0F172A]">Selected cohort:</p>
              <p>Grade 12 Natural & Social Science (4 sections, 214 candidates)</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
