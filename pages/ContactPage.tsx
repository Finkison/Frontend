import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";

type TopicOption = "Pricing" | "School setup" | "Security and data" | "Technical support" | "Other" | "";

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

export default function ContactPage(): React.ReactElement {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    workEmail: "",
    schoolName: "",
    topic: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Field refs to move focus to the first invalid field
  const fullNameRef = useRef<HTMLInputElement>(null);
  const workEmailRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = "Contact us";
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let firstInvalidRef: React.RefObject<HTMLElement> | null = null;

    if (!form.fullName.trim()) {
      newErrors.fullName = "Enter your full name.";
      if (!firstInvalidRef) firstInvalidRef = fullNameRef;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.workEmail.trim() || !emailRegex.test(form.workEmail.trim())) {
      newErrors.workEmail = "Enter a valid email.";
      if (!firstInvalidRef) firstInvalidRef = workEmailRef;
    }

    if (!form.topic) {
      newErrors.topic = "Select a topic.";
      if (!firstInvalidRef) firstInvalidRef = topicRef;
    }

    if (!form.message.trim()) {
      newErrors.message = "Enter a message.";
      if (!firstInvalidRef) firstInvalidRef = messageRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef && (firstInvalidRef as React.RefObject<HTMLElement>).current) {
      (firstInvalidRef as React.RefObject<HTMLElement>).current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

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
      setSubmissionId(data?.submission_id || "CNT-RECEIVED");
      setSubmitted(true);
    } catch (err: any) {
      setErrors({
        general: "Could not send. Check your connection and retry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 py-12 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* =========================================================================
              LEFT COLUMN: Details First (Desktop: 6 cols, Mobile: stacked first)
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight">
                Contact us
              </h1>
              <p className="mt-3 text-base text-neutral-600 leading-relaxed max-w-[540px]">
                Direct institutional assistance for school leaders, educators, and technical administrators.
              </p>
            </div>

            {/* Direct Details Block */}
            <div className="space-y-6 pt-4 border-t border-neutral-200">
              <div>
                <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Email
                </span>
                <a
                  href="mailto:support@finkison.com"
                  className="text-base font-medium text-[#881337] hover:underline"
                >
                  support@finkison.com
                </a>
                <span className="block text-xs text-neutral-600 mt-0.5">
                  Inquiries route directly to admissions, security, or support teams.
                </span>
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Phone and Telegram
                </span>
                <div className="text-base font-medium text-neutral-900">
                  +251 11 558 8080
                </div>
                <div className="text-sm text-neutral-600 mt-0.5">
                  Telegram: <span className="font-mono text-xs">@finkison_support</span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Office hours
                </span>
                <div className="text-base font-medium text-neutral-900">
                  Monday – Friday, 8:30 AM – 5:30 PM EAT (UTC+3)
                </div>
                <span className="block text-xs text-neutral-600 mt-0.5">
                  We reply within one business day.
                </span>
              </div>
            </div>

            {/* Existing User Line */}
            <div className="pt-6 border-t border-neutral-200 text-sm text-neutral-600">
              Existing student or teacher? Visit our{" "}
              <Link to="/student/ai-tutor" className="font-semibold text-[#881337] hover:underline">
                Help center
              </Link>{" "}
              for fast guidance.
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Form Card (Desktop: 6 cols, Mobile: stacked second)
             ========================================================================= */}
          <div className="lg:col-span-6 flex justify-start lg:justify-end">
            <div className="w-full max-w-[480px] bg-white border border-neutral-200 rounded-[12px] p-8 shadow-none text-left">
              {submitted ? (
                <div role="status" className="space-y-4 py-4">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Message sent
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Thank you. We have received your inquiry and routed it to our specialized team. We reply to{" "}
                    <span className="font-semibold text-neutral-900">{form.workEmail}</span> within one business day.
                  </p>
                  {submissionId && (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-600">
                      Reference: {submissionId}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        fullName: "",
                        workEmail: "",
                        schoolName: "",
                        topic: "",
                        message: "",
                        honeypot: "",
                      });
                    }}
                    className="mt-4 text-xs font-semibold text-[#881337] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* General Connection Error Alert */}
                  {errors.general && (
                    <div
                      role="alert"
                      className="p-3 rounded-[8px] bg-red-50 border border-red-200 text-red-800 text-xs leading-normal"
                    >
                      {errors.general}
                    </div>
                  )}

                  {/* Honeypot field for bot protection */}
                  <input
                    type="text"
                    name="website"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Field 1: Full name */}
                  <div>
                    <label
                      htmlFor="contact-full-name"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      Full name
                    </label>
                    <input
                      ref={fullNameRef}
                      id="contact-full-name"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "error-full-name" : undefined}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#64748B] bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                    {errors.fullName && (
                      <p id="error-full-name" className="mt-1 text-xs text-danger-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Field 2: Work email */}
                  <div>
                    <label
                      htmlFor="contact-work-email"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      Work email
                    </label>
                    <input
                      ref={workEmailRef}
                      id="contact-work-email"
                      type="email"
                      required
                      value={form.workEmail}
                      onChange={(e) => {
                        setForm({ ...form, workEmail: e.target.value });
                        if (errors.workEmail) setErrors({ ...errors, workEmail: undefined });
                      }}
                      aria-invalid={!!errors.workEmail}
                      aria-describedby={
                        errors.workEmail
                          ? "error-work-email"
                          : "helper-work-email"
                      }
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#64748B] bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                    <p id="helper-work-email" className="mt-1 text-xs text-neutral-600">
                      Use your school email.
                    </p>
                    {errors.workEmail && (
                      <p id="error-work-email" className="mt-1 text-xs text-danger-600">
                        {errors.workEmail}
                      </p>
                    )}
                  </div>

                  {/* Field 3: School name (optional) */}
                  <div>
                    <label
                      htmlFor="contact-school-name"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      School name
                    </label>
                    <input
                      id="contact-school-name"
                      type="text"
                      value={form.schoolName}
                      onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#64748B] bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors"
                    />
                  </div>

                  {/* Field 4: Topic */}
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-semibold text-neutral-900 mb-1.5"
                    >
                      Topic
                    </label>
                    <select
                      ref={topicRef}
                      id="contact-topic"
                      required
                      value={form.topic}
                      onChange={(e) => {
                        setForm({ ...form, topic: e.target.value as TopicOption });
                        if (errors.topic) setErrors({ ...errors, topic: undefined });
                      }}
                      aria-invalid={!!errors.topic}
                      aria-describedby={errors.topic ? "error-topic" : undefined}
                      className="w-full h-[44px] min-h-[44px] px-3.5 rounded-xl border border-[#64748B] bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      <option value="">Select a topic</option>
                      <option value="Pricing">Pricing</option>
                      <option value="School setup">School setup</option>
                      <option value="Security and data">Security and data</option>
                      <option value="Technical support">Technical support</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.topic && (
                      <p id="error-topic" className="mt-1 text-xs text-danger-600">
                        {errors.topic}
                      </p>
                    )}
                  </div>

                  {/* Field 5: Message */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-semibold text-neutral-900"
                      >
                        Message
                      </label>
                      <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
                        {form.message.length}/1,000
                      </span>
                    </div>
                    <textarea
                      ref={messageRef}
                      id="contact-message"
                      required
                      maxLength={1000}
                      rows={5}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "error-message" : undefined}
                      className="w-full p-3.5 rounded-xl border border-[#64748B] bg-white text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 transition-colors resize-none"
                    />
                    {errors.message && (
                      <p id="error-message" className="mt-1 text-xs text-danger-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={loading}
                      className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] font-semibold min-h-[44px]"
                    >
                      {loading ? "Sending message..." : "Send message"}
                    </Button>
                  </div>

                  {/* Consent Line */}
                  <p className="text-xs text-neutral-600 text-center leading-normal pt-1">
                    We use your details only to reply.{" "}
                    <Link to="/privacy" className="text-[#881337] hover:underline font-semibold">
                      Privacy policy
                    </Link>
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
