import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import RoleSelector from "./RoleSelector";
import { useState } from "react";
import { requestOtp, verifyOtp } from "../../services/authService";
import { useI18n } from "../../i18n";

export default function LoginForm() {
  const { t } = useI18n();
  const [role, setRole] = useState("student");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const onRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const payload = contact.includes("@") ? { email: contact } : { phone: contact };
      await requestOtp(payload);
      setStep("verify");
      setInfo("OTP sent successfully. Enter the code to continue securely.");
    } catch {
      setError("OTP service is currently unreachable. Confirm backend is running on port 8000, then retry.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const payload = contact.includes("@") ? { email: contact } : { phone: contact };
      const { data } = await verifyOtp({ ...payload, otp, role, full_name: "Finkison User" });
      login(data.user, data.role, data.access);
      navigate(`/${data.role}`);
    } catch {
      setError("Verification failed. Check the OTP and try again, or use demo access for platform preview.");
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccess = () => {
    login({ name: "Demo User" }, role, "demo-token");
    navigate(`/${role}`);
  };

  return (
    <form className="card auth-card" onSubmit={step === "request" ? onRequestOtp : onVerify}>
      <h2>{t("secure_sign_in")}</h2>
      <p className="muted">{t("auth_subtitle")}</p>

      <label className="auth-label" htmlFor="contact">{t("phone_or_email")}</label>
      <input
        id="contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Phone number or email"
        className="auth-input"
        required
      />

      <RoleSelector role={role} setRole={setRole} />

      {step === "verify" && (
        <>
          <label className="auth-label" htmlFor="otp">{t("otp")}</label>
          <input
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t("otp")}
            className="auth-input"
            required
          />
        </>
      )}

      {info && <p className="auth-info">{info}</p>}
      {error && <p className="auth-error">{error}</p>}

      <div className="auth-actions">
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Please wait..." : step === "request" ? t("request_otp") : t("verify_continue")}
        </button>
        <button className="btn ghost" type="button" onClick={useDemoAccess}>{t("demo_access")}</button>
      </div>

      <p><Link to="/">{t("back")}</Link></p>
    </form>
  );
}
