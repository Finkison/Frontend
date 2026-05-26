import { useI18n } from "../../i18n";

export default function RoleSelector({ role, setRole }) {
  const { t } = useI18n();

  return (
    <div style={{ marginBottom: 12 }}>
      <label>{t("role")}: </label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">{t("student")}</option>
        <option value="parent">{t("parent")}</option>
        <option value="school">{t("school")}</option>
      </select>
    </div>
  );
}
