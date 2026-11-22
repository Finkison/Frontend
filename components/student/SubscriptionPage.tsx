import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import paymentService, { type PaymentStatus, type StudentPaymentPlan } from "../../services/paymentService";
import { useI18n } from "../../i18n";
import { usePageMeta } from "../../hooks/usePageMeta";
import PortalPage from "../shared/PortalPage";

const formatEtb = (amount: number): string => `ETB ${amount.toLocaleString("en-ET")}`;

export default function SubscriptionPage(): React.ReactElement {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plans, setPlans] = useState<StudentPaymentPlan[]>([]);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);
  const preferredPlanId = searchParams.get("plan");

  usePageMeta(t("public.studentPricing.accountTitle"), t("public.studentPricing.description"));

  const refreshStatus = useCallback(async () => {
    const nextStatus = await paymentService.status();
    setStatus(nextStatus);
    return nextStatus;
  }, []);

  useEffect(() => {
    let active = true;
    const txRef = searchParams.get("tx_ref");
    const paymentState = searchParams.get("payment");

    Promise.all([paymentService.plans("ETB"), paymentService.status()])
      .then(async ([planResponse, paymentStatus]) => {
        if (!active) return;
        setPlans(planResponse.plans);
        setStatus(paymentStatus);

        if (txRef && paymentState === "return") {
          setCheckingPayment(true);
          try {
            const verification = await paymentService.verifyTransaction(txRef);
            if (!active) return;
            if (verification.success && verification.status === "SUCCESS") {
              setMessage({ type: "success", text: t("public.studentPricing.paymentSuccess") });
              await refreshStatus();
              navigate("/student/subscription", { replace: true });
            } else if (verification.status === "FAILED") {
              setMessage({ type: "error", text: t("public.studentPricing.paymentFailed") });
            } else {
              setMessage({ type: "info", text: t("public.studentPricing.paymentPending") });
            }
          } catch {
            if (active) setMessage({ type: "error", text: t("public.studentPricing.paymentCheckError") });
          } finally {
            if (active) setCheckingPayment(false);
          }
        } else if (paymentState === "cancel") {
          setMessage({ type: "info", text: t("public.studentPricing.paymentCanceled") });
          navigate("/student/subscription", { replace: true });
        }
      })
      .catch(() => {
        if (active) {
          setLoadError(true);
          setMessage({ type: "error", text: t("public.studentPricing.loadError") });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [loadAttempt, navigate, refreshStatus, searchParams, t]);

  const retryLoadingPlans = () => {
    setLoadError(false);
    setLoading(true);
    setMessage(null);
    setLoadAttempt((attempt) => attempt + 1);
  };

  const startCheckout = async (plan: StudentPaymentPlan) => {
    setPendingPlan(plan.id);
    setMessage(null);
    try {
      const checkout = await paymentService.subscribe(plan.id, plan.currency);
      if (!checkout.success || !checkout.checkout_url) {
        throw new Error(checkout.error || t("public.studentPricing.checkoutError"));
      }
      window.location.assign(checkout.checkout_url);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.error || error?.message || t("public.studentPricing.checkoutError"),
      });
      setPendingPlan(null);
    }
  };

  const checkPayment = async () => {
    const txRef = searchParams.get("tx_ref");
    if (!txRef) return;
    setCheckingPayment(true);
    try {
      const verification = await paymentService.verifyTransaction(txRef);
      if (verification.success && verification.status === "SUCCESS") {
        setMessage({ type: "success", text: t("public.studentPricing.paymentSuccess") });
        await refreshStatus();
        navigate("/student/subscription", { replace: true });
      } else if (verification.status === "FAILED") {
        setMessage({ type: "error", text: t("public.studentPricing.paymentFailed") });
      } else {
        setMessage({ type: "info", text: t("public.studentPricing.paymentPending") });
      }
    } catch {
      setMessage({ type: "error", text: t("public.studentPricing.paymentCheckError") });
    } finally {
      setCheckingPayment(false);
    }
  };

  return (
    <PortalPage className="max-w-5xl space-y-7">
      <header className="flex flex-col gap-4 border-b border-[#E7E0D6] pb-5 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#881337] dark:text-[#FBBF24]">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            {t("public.studentPricing.accountEyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1C1512] dark:text-white">{t("public.studentPricing.accountTitle")}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#57534E] dark:text-stone-300">{t("public.studentPricing.description")}</p>
        </div>
        <Link to="/pricing#student-plans" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#881337] hover:underline dark:text-[#FBBF24]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t("public.studentPricing.backToPlans")}
        </Link>
      </header>

      {message && !(message.type === "error" && plans.length === 0 && !loading) && (
        <div role={message.type === "error" ? "alert" : "status"} className={`rounded-xl border p-4 text-sm leading-6 ${
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
            : message.type === "error"
            ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100"
            : "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100"
        }`}>
          {message.text}
          {message.type === "info" && searchParams.get("tx_ref") && (
            <button type="button" onClick={checkPayment} disabled={checkingPayment} className="ml-3 font-semibold underline disabled:opacity-60">
              {t("public.studentPricing.checkPayment")}
            </button>
          )}
        </div>
      )}

      {status?.is_subscribed && (
        <section className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between" aria-label={t("public.studentPricing.currentPlan")}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 dark:bg-[#261E1A] dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">{t("public.studentPricing.activePlan", { plan: status.subscription_tier || status.tier })}</p>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">{t("public.studentPricing.daysRemaining", { days: status.expires_in_days ?? 0 })}</p>
            </div>
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-white/5 dark:text-emerald-200">{t("public.studentPricing.activeStatus")}</span>
        </section>
      )}

      <section aria-labelledby="student-account-plans" className="space-y-5">
        <div>
          <h2 id="student-account-plans" className="text-lg font-bold text-[#1C1512] dark:text-white">{t("public.studentPricing.choosePlan")}</h2>
          <p className="mt-1 text-sm text-[#57534E] dark:text-stone-300">{t("public.studentPricing.paymentMethods")}</p>
        </div>

        {loading ? (
          <p role="status" className="rounded-xl border border-[#E7E0D6] bg-white p-6 text-sm text-[#57534E] dark:border-white/10 dark:bg-[#261E1A] dark:text-stone-300">{t("public.studentPricing.loading")}</p>
        ) : plans.length === 0 ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-900 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
            {loadError ? t("public.studentPricing.loadError") : t("public.studentPricing.noPlansAvailable")}
            {loadError && (
              <button type="button" onClick={retryLoadingPlans} className="ml-3 font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700">
                {t("public.studentPricing.retry")}
              </button>
            )}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => {
              const isSeason = plan.id === "season_pass";
              const isPreferred = preferredPlanId === plan.id;
              const featureCount = isSeason ? 5 : 4;
              return (
                <article key={plan.id} className={`relative rounded-2xl border bg-white p-6 dark:bg-[#261E1A] ${
                  isPreferred || isSeason ? "border-[#881337] shadow-md ring-1 ring-[#881337]/15 dark:border-[#FBBF24]" : "border-[#E7E0D6] dark:border-white/10"
                }`}>
                  {isPreferred && (
                    <span className="mb-3 inline-flex rounded-full bg-[#FFF1F2] px-3 py-1 text-[11px] font-bold text-[#881337] dark:bg-[#4C0519]/40 dark:text-[#FBBF24]">
                      {t("public.studentPricing.selectedPlan")}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#1C1512] dark:text-white">{t(`public.studentPricing.${plan.id}Name`)}</h3>
                    <Sparkles className="h-5 w-5 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" />
                  </div>
                  <p className="mt-1 text-sm text-[#57534E] dark:text-stone-300">{t(`public.studentPricing.${plan.id}Description`)}</p>
                  <p className="mt-5 text-3xl font-bold tracking-tight text-[#1C1512] dark:text-white">{formatEtb(plan.price)}</p>
                  <p className="mt-1 text-sm text-[#57534E] dark:text-stone-300">{t(`public.studentPricing.${plan.id}Period`)}</p>
                  <ul className="mt-5 space-y-3 border-t border-[#E7E0D6] pt-5 dark:border-white/10">
                    {Array.from({ length: featureCount }, (_, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm leading-5 text-[#57534E] dark:text-stone-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                        <span>{t(`public.studentPricing.${plan.id}Feature${index + 1}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={pendingPlan !== null || checkingPayment}
                    onClick={() => startCheckout(plan)}
                    className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] disabled:cursor-wait disabled:opacity-60 dark:bg-[#FBBF24] dark:text-[#1C1512] dark:hover:bg-[#F59E0B]"
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    {pendingPlan === plan.id ? t("public.studentPricing.openingCheckout") : t("public.studentPricing.payForPlan")}
                    {pendingPlan !== plan.id && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <p className="rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 text-sm leading-6 text-[#57534E] dark:border-white/10 dark:bg-[#201815] dark:text-stone-300">
        {t("public.studentPricing.schoolAccessNote")}
      </p>
    </PortalPage>
  );
}
