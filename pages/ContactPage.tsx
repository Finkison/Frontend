import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Clock3, Mail, Phone } from "lucide-react";
import api, { getApiErrorMessage } from "../services/api";
import Button from "../components/ui/Button";
import { usePageMeta } from "../hooks/usePageMeta";
import { useI18n } from "../i18n";

type TopicOption = "Pricing" | "School setup" | "Security and data" | "Technical support" | "Other" | "";
const CONTACT_TOPICS: TopicOption[] = ["Pricing", "School setup", "Security and data", "Technical support", "Other"];

function getContactTopic(value: string | null): TopicOption {
  return value && CONTACT_TOPICS.includes(value as TopicOption) ? value as TopicOption : "";
}

interface FormState {
  fullName: string;
  workEmail: string;
  schoolName: string;
  topic: TopicOption;
  message: string;
  honeypot: string;
}

interface FormErrors {
  fullName?: string;
  workEmail?: string;
  topic?: string;
  message?: string;
  general?: string;
}

function createContactFormDefaults(searchParams: URLSearchParams): FormState {
  return {
    fullName: "",
    workEmail: "",
    schoolName: searchParams.get("school") || "",
    topic: getContactTopic(searchParams.get("topic")),
    message: (searchParams.get("message") || "").slice(0, 1000),
    honeypot: "",
  };
}

export default function ContactPage(): React.ReactElement {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(() => createContactFormDefaults(searchParams));

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const workEmailRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setForm(createContactFormDefaults(searchParams));
    setErrors({});
    setSubmitted(false);
    setSubmissionId(null);
  }, [searchParams]);

  usePageMeta(
    t("public.pages.contactTitle"),
    t("public.pages.contactDescription")
  );

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let firstInvalidField: HTMLElement | null = null;

    if (!form.fullName.trim()) {
      newErrors.fullName = t("public.copy.fullNameRequired");
      firstInvalidField ||= fullNameRef.current;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.workEmail.trim() || !emailRegex.test(form.workEmail.trim())) {
      newErrors.workEmail = t("public.copy.emailInvalid");
      firstInvalidField ||= workEmailRef.current;
    }

    if (!form.topic) {
      newErrors.topic = t("public.copy.topicRequired");
      firstInvalidField ||= topicRef.current;
    }

    if (!form.message.trim()) {
      newErrors.message = t("public.copy.messageRequired");
      firstInvalidField ||= messageRef.current;
    }

    setErrors(newErrors);
    firstInvalidField?.focus();

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSubmissionId(null);

    try {
      const response = await api.post("/contact/", {
        full_name: form.fullName.trim(),
        work_email: form.workEmail.trim(),
        school_name: form.schoolName.trim(),
        topic: form.topic,
        message: form.message.trim(),
        honeypot: form.honeypot,
      });

      const data = response.data?.data || response.data;
      if (data?.success === false) throw new Error(t("public.copy.sendMessageError"));
      setSubmissionId(typeof data?.submission_id === "string" ? data.submission_id : null);
      setSubmitted(true);
    } catch (error: unknown) {
      setErrors({
        general: getApiErrorMessage(error) || t("public.copy.sendMessageError"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-dark-page min-h-screen bg-white dark:bg-[#261E1A] text-neutral-900 py-12 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          <div className="lg:col-span-6 space-y-8 text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
                {t("public.pages.contactTitle")}
              </h1>
              <p className="mt-3 text-base text-neutral-600 leading-relaxed max-w-[540px]">
                {t("public.copy.contactDescription")}
              </p>
            </div>

            <div className="grid gap-3 border-t border-neutral-200 pt-5 sm:grid-cols-2 lg:grid-cols-1">
              <a href="mailto:support@finkison.com" className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-[#881337]/40 hover:bg-neutral-50 dark:border-white/10 dark:bg-[#261E1A] dark:hover:bg-white/5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519] dark:text-[#FBBF24]"><Mail className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-neutral-500">{t("public.copy.email")}</span>
                  <span className="mt-1 flex items-center gap-1 break-all text-sm font-semibold text-[#881337] group-hover:underline dark:text-[#FBBF24]">support@finkison.com <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /></span>
                </span>
              </a>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519] dark:text-[#FBBF24]"><Phone className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-neutral-500">{t("public.copy.phoneAndTelegram")}</span>
                  <a href="tel:+251115588080" className="mt-1 block text-sm font-semibold text-neutral-900 hover:underline">+251 11 558 8080</a>
                  <a href="https://t.me/finkison_support" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#881337] hover:underline dark:text-[#FBBF24]">Telegram · @finkison_support <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a>
                </span>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:col-span-2 lg:col-span-1 dark:border-white/10 dark:bg-[#261E1A]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519] dark:text-[#FBBF24]"><Clock3 className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-neutral-500">{t("public.copy.officeHoursLabel")}</span>
                  <span className="mt-1 block text-sm leading-5 text-neutral-900">{t("public.copy.officeHours")}</span>
                </span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-6 flex justify-start lg:justify-end">
            <div className="w-full max-w-[480px] bg-white dark:bg-[#261E1A] border border-neutral-200 rounded-[12px] p-8 shadow-none text-left">
              {submitted ? (
                <div role="status" className="space-y-4 py-4">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {t("public.copy.messageSent")}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {t("public.copy.thanksReply")}{" "}
                    <span className="font-semibold text-neutral-900">{form.workEmail}</span>.
                  </p>
                  <p className="text-sm text-neutral-600">{t("public.copy.replyTime")}</p>
                  {submissionId && (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-600">
                      {t("public.copy.reference")}: {submissionId}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm(createContactFormDefaults(searchParams));
                      setSubmissionId(null);
                    }}
                    className="mt-4 text-xs font-semibold text-[#881337] hover:underline cursor-pointer"
                  >
                    {t("public.copy.sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-busy={loading} data-validation-copy="Enter your full name. Enter a valid email. Select a topic. Enter a message. Could not send. Check your connection and retry." className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-neutral-900">{t("public.copy.contactFormTitle")}</h2>
                    <p className="text-sm leading-5 text-neutral-600">{t("public.copy.contactFormDescription")}</p>
                  </div>
                  {errors.general && (
                    <div
                      role="alert"
                      className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-red-800 text-xs leading-normal"
                    >
                      {errors.general}
                    </div>
                  )}

                  <input
                    type="text"
                    name="website"
                    value={form.honeypot}
                    onChange={(e) => setForm((current) => ({ ...current, honeypot: e.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      <span aria-label="Full name">{t("public.copy.fullName")}</span>
                    </label>
                    <input
                      ref={fullNameRef}
                      id="contact-full-name"
                      name="full_name"
                      type="text"
                      required
                      maxLength={150}
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, fullName: e.target.value }));
                        if (errors.fullName) setErrors((current) => ({ ...current, fullName: undefined }));
                      }}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "error-full-name" : undefined}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#A89C90] bg-white dark:bg-[#261E1A] text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                    {errors.fullName && (
                      <p id="error-full-name" className="mt-1 text-xs text-danger-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-work-email"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      <span aria-label="Email address">{t("public.copy.emailAddress")}</span>
                    </label>
                    <input
                      ref={workEmailRef}
                      id="contact-work-email"
                      name="work_email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={form.workEmail}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, workEmail: e.target.value }));
                        if (errors.workEmail) setErrors((current) => ({ ...current, workEmail: undefined }));
                      }}
                      aria-invalid={!!errors.workEmail}
                      aria-describedby={errors.workEmail ? "error-work-email" : undefined}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#A89C90] bg-white dark:bg-[#261E1A] text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                    {errors.workEmail && (
                      <p id="error-work-email" className="mt-1 text-xs text-danger-600">
                        {errors.workEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-school-name"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      <span aria-label="School name (optional)">{t("public.copy.schoolOrOrganizationOptional")}</span>
                    </label>
                    <input
                      id="contact-school-name"
                      name="school_name"
                      type="text"
                      maxLength={200}
                      autoComplete="organization"
                      value={form.schoolName}
                      onChange={(e) => setForm((current) => ({ ...current, schoolName: e.target.value }))}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#A89C90] bg-white dark:bg-[#261E1A] text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      <span aria-label="Topic">{t("public.copy.whatCanWeHelpWith")}</span>
                    </label>
                    <select
                      ref={topicRef}
                      id="contact-topic"
                      name="topic"
                      required
                      value={form.topic}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, topic: e.target.value as TopicOption }));
                        if (errors.topic) setErrors((current) => ({ ...current, topic: undefined }));
                      }}
                      aria-invalid={!!errors.topic}
                      aria-describedby={errors.topic ? "error-topic" : undefined}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#A89C90] bg-white dark:bg-[#261E1A] text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <option value="">{t("public.copy.selectTopic")}</option>
                      <option value="Pricing">{t("public.copy.pricingTopic")}</option>
                      <option value="School setup">{t("public.copy.schoolSetupTopic")}</option>
                      <option value="Security and data">{t("public.copy.securityDataTopic")}</option>
                      <option value="Technical support">{t("public.copy.technicalSupportTopic")}</option>
                      <option value="Other">{t("public.copy.otherTopic")}</option>
                    </select>
                    {errors.topic && (
                      <p id="error-topic" className="mt-1 text-xs text-danger-600">
                        {errors.topic}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-neutral-900"
                      >
                        {t("public.copy.message")}
                      </label>
                      <span id="contact-message-count" className="text-[11px] text-neutral-500 font-mono tabular-nums">
                        {form.message.length}/1,000
                      </span>
                    </div>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      name="message"
                      required
                      maxLength={1000}
                      rows={5}
                      spellCheck
                      value={form.message}
                      onChange={(e) => {
                        setForm((current) => ({ ...current, message: e.target.value }));
                        if (errors.message) setErrors((current) => ({ ...current, message: undefined }));
                      }}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-count error-message" : "contact-message-count"}
                      className="w-full p-3.5 rounded-xl border border-[#A89C90] bg-white dark:bg-[#261E1A] text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors resize-none"
                    />
                    {errors.message && (
                      <p id="error-message" className="mt-1 text-xs text-danger-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={loading}
                      className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] font-semibold min-h-[44px]"
                    >
                      <span aria-label="Send message">{loading ? t("public.copy.sendingMessage") : t("public.copy.sendMessage")}</span>
                    </Button>
                  </div>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t("public.copy.replyTime")}
                  </p>

                  <p className="text-xs text-neutral-600 text-center leading-normal pt-1">
                    <span data-consent-copy="Learn how we handle your information.">{t("public.copy.privacyLead")}</span>{" "}
                    <Link to="/privacy" className="text-[#881337] hover:underline font-semibold" aria-label="Privacy policy">{t("public.copy.privacyPolicy")}</Link>
                    {" · "}
                    <Link to="/security" className="text-[#881337] hover:underline font-semibold">{t("public.footer.security")}</Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
