import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">{t("brand_title")}</h1>
          <p>{t("brand_subtitle")}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/login">{t("start_learning")}</Link>
            <Link className="btn ghost" to="/student">Explore Student Experience</Link>
            <Link className="btn ghost" to="/parent">Explore Parent Experience</Link>
            <Link className="btn ghost" to="/school">Explore School Experience</Link>
          </div>
        </div>
      </section>

      <section className="grid">
        <article className="card feature-card">
          <h3>{t("adaptive_practice")}</h3>
          <p>Topic-focused practice, unit exams, semester assessments, and full entrance simulation in one unified flow.</p>
        </article>
        <article className="card feature-card">
          <h3>{t("performance_insights")}</h3>
          <p>Readable analytics that highlight weak areas, improvement velocity, and score trajectory for evidence-based preparation.</p>
        </article>
        <article className="card feature-card">
          <h3>{t("parent_school_portal")}</h3>
          <p>Role-specific visibility for families and schools with accountable reporting and actionable academic alerts.</p>
        </article>
      </section>

      <section className="article-grid">
        <article className="card article-card">
          <h3>How To Use The Platform Effectively</h3>
          <p>Begin with targeted unit practice, review explanations immediately, then transition to cumulative model tests weekly.</p>
        </article>
        <article className="card article-card">
          <h3>Assessment Design Philosophy</h3>
          <p>Questions are structured to balance recall, reasoning, and time discipline, aligned to modern national entrance standards.</p>
        </article>
        <article className="card article-card">
          <h3>Academic Success Framework</h3>
          <p>Students perform best when daily consistency, weak-topic recovery, and periodic benchmark exams are combined intentionally.</p>
        </article>
      </section>
    </div>
  );
}
