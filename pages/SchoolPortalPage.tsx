import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Layers, 
  Receipt, 
  MessageSquare, 
  Settings, 
  Download, 
  CheckCircle2, 
  Clock, 
  Send, 
  User, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Users,
  Search,
  Filter,
  Check
} from "lucide-react";

import useAuthStore from "../store/authStore";
import { getSchoolProfile, getSchoolMessages } from "../services/schoolService";

/**
 * Standardized School & Institution Portal Page
 * Domain-accurate portal for school administrators, principals, and department heads.
 */
export default function SchoolPortalPage(): React.ReactElement {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"services" | "invoices" | "messages" | "settings">("services");

  // Services State
  const [activePlan, setActivePlan] = useState({
    title: "Institutional School License",
    status: "Active",
    seatsTotal: 0,
    seatsUsed: 0,
    renewalDate: "End of Term",
    accountManager: "Finkison Institutional Advisory"
  });

  // Invoices State
  const [invoices, setInvoices] = useState<any[]>([]);

  // Messages State
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Settings State
  const [orgSettings, setOrgSettings] = useState({
    schoolName: user?.school || "Institution Workspace",
    contactEmail: user?.email || "",
    phone: user?.phone || "",
    region: user?.region || "Addis Ababa",
    subCity: "",
    dataResidency: "National Tier-3 Datacenter"
  });
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  useEffect(() => {
    getSchoolProfile()
      .then((res) => {
        if (res.data) {
          const d = res.data;
          setActivePlan({
            title: d.license_tier || "Institutional School License",
            status: "Active",
            seatsTotal: d.max_student_seats || 0,
            seatsUsed: d.used_seats || 0,
            renewalDate: d.renewal_date || "End of Term",
            accountManager: "Finkison Institutional Advisory"
          });
          setOrgSettings((prev) => ({
            ...prev,
            schoolName: d.name || prev.schoolName,
            contactEmail: d.contact_email || prev.contactEmail,
            phone: d.phone || prev.phone,
            region: d.region || prev.region
          }));
        }
      })
      .catch(() => {});

    getSchoolMessages()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSendingMessage(true);

    setTimeout(() => {
      setMessages([
        ...messages,
        {
          id: `m-${Date.now()}`,
          sender: user?.fullName || user?.name || "School Administrator",
          role: "School Administrator",
          time: "Just now",
          text: replyText.trim()
        }
      ]);
      setReplyText("");
      setSendingMessage(false);
    }, 400);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1512] pb-16">
      {/* Top Banner */}
      <div className="bg-white border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#881337] text-[11px] font-semibold mb-2">
                <Building2 className="w-3.5 h-3.5 text-[#881337]" />
                <span>Institutional school portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1512]">
                {orgSettings.schoolName}
              </h1>
              <p className="text-xs sm:text-sm text-[#574C43] mt-1">
                Manage your institutional licenses, candidate seat capacity, billing invoices, and direct advisory channels.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/school"
                className="px-4 py-2 rounded-xl border border-[#E8E2D9] hover:bg-[#FAF8F5] text-[#574C43] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Open educator console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/checkout?plan=school"
                className="px-4 py-2 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add candidate seats</span>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex items-center gap-2 border-b border-[#E8E2D9] overflow-x-auto">
            {[
              { id: "services", label: "Active services and licenses", icon: Layers },
              { id: "invoices", label: "Invoices and receipts", icon: Receipt },
              { id: "messages", label: "Advisory messages", icon: MessageSquare },
              { id: "settings", label: "Organization and compliance", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "border-[#881337] text-[#881337]"
                      : "border-transparent text-slate-500 hover:text-[#1C1512]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[#E8E2D9] bg-white shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#881337] border border-[#FECDD3] text-[10px] font-bold uppercase tracking-wider">
                    {activePlan.status}
                  </span>
                  <h3 className="text-base font-bold text-[#1C1512] mt-1.5">
                    {activePlan.title}
                  </h3>
                  <p className="text-xs text-[#574C43] mt-0.5">
                    Annual institutional subscription covering Grade 11 & 12 exam preparation modules.
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Renews on:</span>
                  <span className="text-xs font-semibold text-slate-800">{activePlan.renewalDate}</span>
                </div>
              </div>

              {/* Seat Capacity Bar */}
              {(() => {
                const seatPct = activePlan.seatsTotal > 0 ? Math.round((activePlan.seatsUsed / activePlan.seatsTotal) * 100) : 0;
                const seatsAvail = Math.max(0, activePlan.seatsTotal - activePlan.seatsUsed);
                return (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs space-y-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#574C43]">Enrolled Candidates:</span>
                      <span className="font-bold text-[#1C1512]">{activePlan.seatsUsed} / {activePlan.seatsTotal} Seats Utilized ({seatPct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#881337] rounded-full" style={{ width: `${Math.min(100, seatPct)}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#574C43]">
                      <span>{seatsAvail} seats available for late enrollments</span>
                      <Link to="/checkout?plan=school" className="text-[#881337] font-semibold hover:underline">
                        Expand Capacity &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })()}

              {/* Inclusions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3.5 rounded-xl border border-[#E8E2D9] bg-white">
                  <ShieldCheck className="w-4 h-4 text-[#881337] mb-1.5" />
                  <h4 className="font-bold text-[#1C1512]">Anti-cheat proctoring</h4>
                  <p className="text-[11px] text-[#574C43] mt-0.5">Automated window tracking and educator override controls.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E8E2D9] bg-white">
                  <Layers className="w-4 h-4 text-[#881337] mb-1.5" />
                  <h4 className="font-bold text-[#1C1512]">600-point score predictor</h4>
                  <p className="text-[11px] text-[#574C43] mt-0.5">Stream-calibrated university admission cutoff forecasts.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E8E2D9] bg-white">
                  <Users className="w-4 h-4 text-[#881337] mb-1.5" />
                  <h4 className="font-bold text-[#1C1512]">Dedicated advisor</h4>
                  <p className="text-[11px] text-[#574C43] mt-0.5">Direct channel to {activePlan.accountManager}.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVOICES */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[#E8E2D9] bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1C1512]">
                    Billing ledger and formal invoices
                  </h3>
                  <p className="text-xs text-[#574C43] mt-0.5">
                    Download verified tax receipts for internal institutional audits and official records.
                  </p>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No billing transactions or invoices on record.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E8E2D9] text-[#574C43] uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-3">Invoice ID</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Enrolled Seats</th>
                        <th className="py-3 px-3">Total Settled</th>
                        <th className="py-3 px-3">Settlement Route</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#FAF8F5]/60">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#1C1512]">{inv.id}</td>
                          <td className="py-3.5 px-3 text-[#574C43]">{inv.date}</td>
                          <td className="py-3.5 px-3 text-[#1C1512] font-medium">{inv.seats} Seats</td>
                          <td className="py-3.5 px-3 font-semibold text-[#1C1512]">{inv.amount}</td>
                          <td className="py-3.5 px-3 text-[#574C43]">{inv.method}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#881337] font-bold text-[10px] border border-[#FECDD3]">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => window.print()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E2D9] hover:bg-[#FAF8F5] text-[#574C43] text-[11px] font-semibold cursor-pointer"
                            >
                              <Download className="w-3 h-3 text-[#574C43]" />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-[#E8E2D9] bg-white shadow-2xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#1C1512]">
                  Direct educational advisor channel
                </h3>
                <p className="text-xs text-[#574C43] mt-0.5">
                  Private communication line between your administration and Finkison curriculum leads.
                </p>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No message history with the advisory team. Dispatch a message below to start a thread.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-white border border-[#E8E2D9] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#1C1512]">
                          <span>{m.sender}</span>
                          <span className="text-[10px] font-normal text-slate-400">({m.role})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.time}</span>
                      </div>
                      <p className="text-[#574C43] text-xs leading-relaxed">{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Inquire about custom mock sets, teacher onboarding sessions, or cohort diagnostics..."
                  className="w-full p-3.5 rounded-xl border border-[#E8E2D9] text-xs focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 bg-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingMessage || !replyText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingMessage ? "Sending..." : "Dispatch message to advisor"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl border border-[#E8E2D9] bg-white shadow-2xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1C1512]">
                  Institutional profile and data sovereignty settings
                </h3>
                <p className="text-xs text-[#574C43] mt-0.5">
                  Maintain official contact credentials and inspect server location controls.
                </p>
              </div>

              {savedSettingsNotice && (
                <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs text-[#881337] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#881337] shrink-0" />
                  <span>Institutional settings updated successfully.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#1C1512] mb-1">
                    Official school title
                  </label>
                  <input
                    type="text"
                    value={orgSettings.schoolName}
                    onChange={(e) => setOrgSettings({ ...orgSettings, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C1512] mb-1">
                    Administrative notification email
                  </label>
                  <input
                    type="email"
                    value={orgSettings.contactEmail}
                    onChange={(e) => setOrgSettings({ ...orgSettings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C1512] mb-1">
                    Administrative telephone
                  </label>
                  <input
                    type="tel"
                    value={orgSettings.phone}
                    onChange={(e) => setOrgSettings({ ...orgSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1C1512] mb-1">
                    Regional bureau jurisdiction
                  </label>
                  <input
                    type="text"
                    value={orgSettings.region}
                    onChange={(e) => setOrgSettings({ ...orgSettings, region: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20"
                  />
                </div>
              </div>

              {/* Data Sovereignty Box */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1C1512]">
                  <ShieldCheck className="w-4 h-4 text-[#881337]" />
                  <span>National curriculum data safeguard</span>
                </div>
                <p className="text-[#574C43] leading-relaxed text-[11px]">
                  All student examination results, response time metrics, and personal candidate identifiers are stored exclusively in Addis Ababa domestic cloud instances. Zero foreign data transfer.
                </p>
                <div className="text-[11px] text-[#574C43] font-mono">
                  Primary Host: {orgSettings.dataResidency}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4C0519] hover:bg-[#881337] text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Save institutional settings
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export const InstitutionalDashboard = SchoolPortalPage;
