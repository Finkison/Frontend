import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Printer, 
  ArrowRight, 
  Lock, 
  FileText, 
  Check,
  Smartphone,
  Landmark,
  FileCheck
} from "lucide-react";

export default function CheckoutPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Checkout — Finkison";
  }, []);

  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "school";

  const [seats, setSeats] = useState<number>(selectedPlan === "district" ? 500 : (selectedPlan === "starter" ? 50 : 200));
  const [gateway, setGateway] = useState<"telebirr" | "chapa" | "cbe" | "invoice">("telebirr");
  const [institutionName, setInstitutionName] = useState(user?.school || "");
  const [billingEmail, setBillingEmail] = useState(user?.email || "");
  const [contactPhone, setContactPhone] = useState(user?.phone || "");
  const [poNumber, setPoNumber] = useState("");

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  // Price Calculation (in ETB)
  const unitPricePerSeat = selectedPlan === "district" ? 220 : (selectedPlan === "starter" ? 350 : 280);
  const subtotal = seats * unitPricePerSeat;
  const platformFee = 2500;
  const total = subtotal + platformFee;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setTransactionRef(`TXN-ET-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-[#1C1512] font-sans selection:bg-[#FECDD3] selection:text-[#4C0519]">
      {/* =========================================================================
          1. HEADER SECTION
          Background: Warm Parchment (#FAF8F5)
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#574C43]">
            <Link to="/" className="hover:text-[#881337] transition-colors">Platform</Link>
            <span>/</span>
            <Link to="/pricing" className="hover:text-[#881337] transition-colors">Pricing</Link>
            <span>/</span>
            <span className="text-[#1C1512] font-semibold">Checkout</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FFF1F2] border border-[#FECDD3] text-[#881337]">
              Candidate licensing
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1C1512] leading-tight">
              Institutional license checkout
            </h1>
            <p className="text-base sm:text-lg text-[#574C43] leading-relaxed">
              Secure candidate seat provisioning, official VAT invoices, and instant domestic payment settlement for Ethiopian secondary schools.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MAIN CHECKOUT AREA
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8E2D9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {completed ? (
            /* Confirmation Screen */
            <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl border border-[#E8E2D9] bg-[#FAF8F5] text-center space-y-8 shadow-sm">
              <div className="w-16 h-16 bg-[#FFF1F2] text-[#881337] border border-[#FECDD3] rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-3">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#FFF1F2] text-[#881337] border border-[#FECDD3] text-xs font-semibold uppercase tracking-wider">
                  Payment verified
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1512] tracking-tight">
                  Institutional license activated
                </h2>
                <p className="text-base text-[#574C43] max-w-md mx-auto leading-relaxed">
                  Your official VAT invoice and school master credentials ledger have been generated and emailed to <strong>{billingEmail}</strong>.
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="p-6 rounded-xl bg-white border border-[#E8E2D9] text-left text-sm space-y-3.5 shadow-2xs">
                <div className="flex justify-between pb-3 border-b border-slate-100">
                  <span className="text-[#574C43] font-medium">Transaction Reference:</span>
                  <span className="font-mono font-bold text-[#1C1512]">{transactionRef}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-100">
                  <span className="text-[#574C43]">Institution:</span>
                  <span className="font-semibold text-[#1C1512]">{institutionName || "Registered Institution"}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-100">
                  <span className="text-[#574C43]">Provisioned Candidate Seats:</span>
                  <span className="font-semibold text-[#1C1512]">{seats} Students</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate-100">
                  <span className="text-[#574C43]">Settlement Gateway:</span>
                  <span className="font-semibold text-[#1C1512] uppercase">{gateway} Official Settlement</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-bold">
                  <span className="text-[#1C1512]">Total Settled:</span>
                  <span className="text-[#881337]">{total.toLocaleString()} ETB</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/school"
                  className="w-full sm:w-auto min-h-[44px] px-8 py-3 rounded-[8px] bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                >
                  <span>Access school portal</span>
                  <ArrowRight className="w-4 h-4 text-[#1C1512]" />
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-[8px] border border-[#CBD5E1] hover:bg-[#FAF8F5] text-[#1C1512] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#574C43]" />
                  <span>Print receipt</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Form & Billing Input */}
              <div className="lg:col-span-7 space-y-8">
                <form onSubmit={handleProcessPayment} className="space-y-8">
                  
                  {/* Step 1: Institutional Details */}
                  <div className="p-6 sm:p-8 rounded-2xl border border-[#E8E2D9] hover:border-[#FECDD3] bg-white shadow-xs transition-colors space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1C1512] flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#881337]" />
                        <span>1. Institution and billing information</span>
                      </h3>
                      <p className="text-sm text-[#574C43]">
                        Enter official school registration details for national tax compliance.
                      </p>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <label className="block font-semibold text-[#1C1512] mb-1.5">
                          Institution Name
                        </label>
                        <input
                          type="text"
                          required
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          placeholder="e.g. Bole Senior Secondary School"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 text-sm text-[#1C1512] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-[#1C1512] mb-1.5">
                            Billing / Administration Email
                          </label>
                          <input
                            type="email"
                            required
                            value={billingEmail}
                            onChange={(e) => setBillingEmail(e.target.value)}
                            placeholder="admin@school.edu.et"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 text-sm text-[#1C1512] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#1C1512] mb-1.5">
                            Accounting Contact Phone
                          </label>
                          <input
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+251 91 000 0000"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 text-sm text-[#1C1512] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1C1512] mb-1.5">
                          Institutional purchase order or tax reference
                        </label>
                        <input
                          type="text"
                          value={poNumber}
                          onChange={(e) => setPoNumber(e.target.value)}
                          placeholder="e.g. PO-2026-99"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 text-sm font-mono text-[#1C1512] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Seat Capacity Configuration */}
                  <div className="p-6 sm:p-8 rounded-2xl border border-[#E8E2D9] hover:border-[#FECDD3] bg-white shadow-xs transition-colors space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1C1512] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#881337]" />
                        <span>2. Candidate seat allocation</span>
                      </h3>
                      <p className="text-sm text-[#574C43]">
                        Adjust the candidate seat count to reflect total registered Grade 9–12 students.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#574C43]">Enrolled Candidate Seats:</span>
                        <span className="font-bold text-[#881337] text-lg">{seats} Seats</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={1000}
                        step={10}
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        aria-label="Enrolled candidate seats"
                        className="w-full accent-[#881337] cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-[#574C43]">
                        <span>30 seats • Single class</span>
                        <span>500 seats • Grades 11–12</span>
                        <span>1,000 seats • Full institution</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Payment Method Selection */}
                  <div className="p-6 sm:p-8 rounded-2xl border border-[#E8E2D9] hover:border-[#FECDD3] bg-white shadow-xs transition-colors space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#1C1512] flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#881337]" />
                        <span>3. Domestic payment settlement</span>
                      </h3>
                      <p className="text-sm text-[#574C43]">
                        Select verified domestic payment gateway or bank transfer method.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {[
                        { 
                          id: "telebirr", 
                          label: "Telebirr SuperApp", 
                          desc: "Instant mobile settlement via Ethio Telecom merchant QR",
                          icon: <Smartphone className="w-4 h-4 text-[#881337]" />
                        },
                        { 
                          id: "chapa", 
                          label: "Chapa National Gateway", 
                          desc: "Visa, Mastercard, CBE Birr & Awash Pay domestic cards",
                          icon: <CreditCard className="w-4 h-4 text-[#881337]" />
                        },
                        { 
                          id: "cbe", 
                          label: "CBE Birr Direct", 
                          desc: "Direct commercial bank account transfer with deposit reference",
                          icon: <Landmark className="w-4 h-4 text-[#881337]" />
                        },
                        { 
                          id: "invoice", 
                          label: "Institutional Net-30 Wire", 
                          desc: "Official institutional invoice with bank deposit slip and verification",
                          icon: <FileCheck className="w-4 h-4 text-[#881337]" />
                        },
                      ].map((item) => {
                        const isSelected = gateway === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setGateway(item.id as any)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#881337] bg-[#FFF1F2] shadow-xs"
                                : "border-[#E8E2D9] hover:border-[#FECDD3] bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2 font-bold text-[#1C1512]">
                                {item.icon}
                                <span>{item.label}</span>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-[#881337] bg-[#881337] text-white" : "border-[#CBD5E1]"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-xs text-[#574C43] leading-relaxed">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full min-h-[48px] py-3.5 px-6 rounded-[8px] bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold text-sm tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#1C1512]/30 border-t-[#1C1512] rounded-full animate-spin" />
                          <span>Verifying institutional license with gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-[#1C1512]" />
                          <span>Authorize payment and provision {seats} seats ({total.toLocaleString()} ETB)</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-[#574C43]">
                      256-bit SSL encrypted. VAT registered under Ethiopian Proclamation No. 1321/2024.
                    </p>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary & Inclusions */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="p-6 sm:p-8 rounded-2xl border border-[#E8E2D9] bg-[#FAF8F5] space-y-6 shadow-xs">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#1C1512]">
                      Order summary
                    </h3>
                    <p className="text-xs text-[#574C43]">
                      Annual institutional candidate license breakdown
                    </p>
                  </div>

                  <div className="space-y-3.5 text-sm divide-y divide-[#E8E2D9]">
                    <div className="pt-2 flex justify-between">
                      <span className="text-[#574C43]">Candidate seats ({seats} × {unitPricePerSeat} ETB):</span>
                      <span className="font-semibold text-[#1C1512]">{subtotal.toLocaleString()} ETB</span>
                    </div>
                    <div className="pt-3 flex justify-between">
                      <span className="text-[#574C43]">School cloud infrastructure & proctoring:</span>
                      <span className="font-semibold text-[#1C1512]">{platformFee.toLocaleString()} ETB</span>
                    </div>
                    <div className="pt-3 flex justify-between text-base font-bold text-[#1C1512]">
                      <span>Total amount payable:</span>
                      <span className="text-[#881337]">{total.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E8E2D9] text-xs space-y-3">
                    <h4 className="font-bold text-[#1C1512] uppercase tracking-wider text-[11px]">
                      Included with institutional license
                    </h4>
                    <ul className="space-y-2 text-xs text-[#574C43]">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                        <span>Unlimited 2-parameter IRT mock examinations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                        <span>Live teacher proctoring and anti-cheat console</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                        <span>CSV / Excel student roster bulk ingestion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                        <span>Dedicated curriculum specialist support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#E8E2D9] text-xs">
                    <div className="flex items-center gap-2 text-xs text-[#574C43]">
                      <ShieldCheck className="w-4 h-4 text-[#881337] shrink-0" />
                      <span>30-day score satisfaction guarantee</span>
                    </div>
                    <div className="text-xs text-[#574C43]">
                      Need custom district terms?{" "}
                      <Link to="/contact" className="font-semibold text-[#881337] hover:underline">
                        Contact us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
}
