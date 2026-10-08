import React, { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  X,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Building2,
  Lock
} from "lucide-react";
import paymentService, { ChapaInitResponse, ChapaVerifyResponse } from "../../services/paymentService";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps): React.ReactElement | null {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "season">("season");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "awaiting_chapa" | "success">("select");
  const [transactionData, setTransactionData] = useState<ChapaInitResponse | null>(null);
  const [verifyResult, setVerifyResult] = useState<ChapaVerifyResponse | null>(null);

  if (!isOpen) return null;

  const planName = selectedPlan === "season" ? "Entrance Season Pass" : "Monthly Pro Pass";
  const amount = selectedPlan === "season" ? 450 : 150;

  const handleLaunchChapa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await paymentService.initializeChapa({
        plan_name: planName,
        amount: amount,
        return_url: `${window.location.origin}/student?payment=return&plan=${encodeURIComponent(planName)}`
      });

      if (res && res.success) {
        setTransactionData(res);
        setStep("awaiting_chapa");
        if (res.checkout_url) {
          window.open(res.checkout_url, "_blank", "noopener,noreferrer");
        }
      } else {
        setErrorMsg(res.error || "Unable to initialize Chapa gateway. Please retry.");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to connect to Chapa payment gateway.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!transactionData?.tx_ref) return;
    setVerifying(true);
    setErrorMsg(null);

    try {
      const result = await paymentService.verifyChapa(transactionData.tx_ref);
      if (result.success && result.status === "SUCCESS") {
        setVerifyResult(result);
        setStep("success");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMsg(result.error || "Payment not yet confirmed by Chapa. If you just approved the prompt on your phone, please wait a few seconds and check again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || err?.message || "Verification check failed. Please retry.");
    } finally {
      setVerifying(false);
    }
  };

  const resetModal = () => {
    setStep("select");
    setTransactionData(null);
    setVerifyResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "select" && (
          <form onSubmit={handleLaunchChapa} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chapa Verified National Gateway</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">Upgrade to Pro Candidate</h2>
              <p className="text-xs text-slate-500 mt-1">
                Unlock full access to past national mock simulations, trilingual Socratic AI tutoring, and the 1v1 Arena.
              </p>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedPlan === "monthly"
                    ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Monthly Pass</span>
                <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">150 ETB</div>
                <span className="text-[11px] text-slate-500">Billed monthly</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("season")}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  selectedPlan === "season"
                    ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="absolute top-0 right-0 bg-emerald-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-bl-lg">
                  Best Value
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Entrance Season</span>
                <div className="font-serif text-2xl font-bold text-slate-900 mt-0.5">450 ETB</div>
                <span className="text-[11px] text-slate-500">Active until Exam Day</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    CH
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">Chapa Payment Gateway</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Official National Payment Aggregator</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Exclusive Gateway
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                All Ethiopian mobile payment services and domestic/international bank cards are unified seamlessly inside Chapa’s secure checkout.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Telebirr</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">CBE Birr</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                  <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Awash Birr</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800">Cards / Visa</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>256-bit encrypted checkout handled directly by Chapa FinTech.</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting to Chapa Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay {amount} ETB via Chapa Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === "awaiting_chapa" && transactionData && (
          <div className="py-4 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl mx-auto bg-emerald-100 text-emerald-700 flex items-center justify-center animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                Checkout Window Dispatched
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Authorize on Chapa</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Please complete your {amount} ETB payment in the Chapa window using Telebirr, CBE Birr, Awash, or Card.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-slate-800">{planName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-slate-800">{amount} ETB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono text-[11px] text-slate-700 font-semibold">{transactionData.tx_ref}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={verifying}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Chapa API...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Completed Payment</span>
                  </>
                )}
              </button>

              {transactionData.checkout_url && (
                <button
                  type="button"
                  onClick={() => window.open(transactionData.checkout_url, "_blank", "noopener,noreferrer")}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Re-open Chapa Checkout Page</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setStep("select")}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer pt-2"
              >
                Cancel or choose another plan
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl mx-auto bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Chapa Transaction Verified
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">Welcome to Pro Candidate!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your full subscription is now active through the upcoming National Examination. All mock simulations and AI tutors are fully unlocked.
              </p>
            </div>

            {verifyResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-left max-w-sm mx-auto space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Activated Plan:</span>
                  <span className="font-bold text-slate-800">{verifyResult.plan_name || planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700">Active Pro</span>
                </div>
                {verifyResult.tx_ref && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference:</span>
                    <span className="font-mono text-[10px] text-slate-600">{verifyResult.tx_ref}</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={resetModal}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-[0.99]"
            >
              Back to Candidate Cockpit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
