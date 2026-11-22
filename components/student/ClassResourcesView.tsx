import React, { useCallback, useEffect, useState } from "react";
import { BookOpen, CalendarDays, Loader2, RefreshCw, School } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "../../services/api";
import { getStudentLearningResources, type StudentLearningResource } from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import PortalPage from "../shared/PortalPage";

type MarkdownBlock = { type: "paragraph" | "ul" | "ol" | "heading"; content: string[]; level?: number };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: "heading", content: [heading[2]], level: heading[1].length });
      continue;
    }
    const unorderedItem = /^[-*]\s+(.+)$/.exec(line);
    if (unorderedItem) {
      const previous = blocks[blocks.length - 1];
      if (previous?.type === "ul") previous.content.push(unorderedItem[1]);
      else blocks.push({ type: "ul", content: [unorderedItem[1]] });
      continue;
    }
    const orderedItem = /^\d+[.)]\s+(.+)$/.exec(line);
    if (orderedItem) {
      const previous = blocks[blocks.length - 1];
      if (previous?.type === "ol") previous.content.push(orderedItem[1]);
      else blocks.push({ type: "ol", content: [orderedItem[1]] });
      continue;
    }
    const previous = blocks[blocks.length - 1];
    if (previous?.type === "paragraph") previous.content.push(line);
    else blocks.push({ type: "paragraph", content: [line] });
  }
  return blocks;
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={key} className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/10">{part.slice(1, -1)}</code>;
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function ResourceContent({ content }: { content: string }): React.ReactElement {
  return <div className="space-y-4 text-sm leading-7 text-stone-700 dark:text-[#E7E0D6]">{parseMarkdown(content).map((block, index) => {
    if (block.type === "heading") {
      const className = block.level === 1 ? "text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]" : "text-base font-semibold text-stone-900 dark:text-[#FDFBF7]";
      return <h3 key={index} className={className}>{renderInline(block.content[0], `h-${index}`)}</h3>;
    }
    if (block.type === "ul" || block.type === "ol") {
      const List = block.type === "ul" ? "ul" : "ol";
      return <List key={index} className={`space-y-2 pl-5 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>{block.content.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `l-${index}-${itemIndex}`)}</li>)}</List>;
    }
    return <p key={index}>{renderInline(block.content.join(" "), `p-${index}`)}</p>;
  })}</div>;
}

function formatDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export default function ClassResourcesView(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState<StudentLearningResource[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [access, setAccess] = useState<"school" | "independent">("independent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getStudentLearningResources();
      const nextResources = Array.isArray(response.data?.resources) ? response.data.resources : [];
      setResources(nextResources);
      setAccess(response.data?.access === "school" ? "school" : "independent");
      setSelectedId((current) => current && nextResources.some((resource) => resource.id === current) ? current : nextResources[0]?.id || null);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError) || t("classroomWorkflows.learningResources.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void loadResources(); }, [loadResources]);

  const selected = resources.find((resource) => resource.id === selectedId) || null;

  return <PortalPage className="max-w-6xl space-y-6">
    <PageHeader
      title={t("classroomWorkflows.learningResources.title")}
      description={t("classroomWorkflows.learningResources.description")}
      secondaryActions={[{ label: t("classroomWorkflows.learningResources.retry"), onClick: () => void loadResources(), icon: RefreshCw, loading }]}
    />

    {loading ? <div role="status" className="flex min-h-40 items-center justify-center gap-3 text-sm text-stone-500 dark:text-[#A89C90]"><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />{t("classroomWorkflows.learningResources.loading")}</div>
      : error ? <section role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/50 dark:bg-rose-950/20"><p className="text-sm text-rose-800 dark:text-rose-200">{error}</p><button type="button" onClick={() => void loadResources()} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-300 px-3 text-sm font-semibold text-rose-800 dark:border-rose-800 dark:text-rose-200"><RefreshCw className="h-4 w-4" aria-hidden="true" />{t("classroomWorkflows.learningResources.retry")}</button></section>
        : access === "independent" ? <section className="rounded-2xl border border-stone-200 bg-white p-7 text-center shadow-xs dark:border-white/10 dark:bg-[#261E1A]"><School className="mx-auto h-8 w-8 text-[#881337] dark:text-[#FBBF24]" aria-hidden="true" /><h2 className="mt-3 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.learningResources.emptyTitle")}</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.learningResources.emptyIndependent")}</p><Link to="/student/school-access" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] dark:bg-[#FBBF24] dark:text-[#1C1512]">{t("classroomWorkflows.learningResources.connectSchool")}</Link></section>
          : resources.length === 0 ? <section className="rounded-2xl border border-dashed border-stone-300 bg-white p-7 text-center dark:border-white/15 dark:bg-[#261E1A]"><BookOpen className="mx-auto h-8 w-8 text-stone-400" aria-hidden="true" /><h2 className="mt-3 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.learningResources.emptyTitle")}</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{t("classroomWorkflows.learningResources.emptySchool")}</p></section>
            : <section className="grid gap-4 lg:grid-cols-[19rem_minmax(0,1fr)]">
              <aside aria-label={t("classroomWorkflows.learningResources.listLabel")} className="h-fit rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-[#261E1A]"><h2 className="px-1 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("classroomWorkflows.learningResources.listLabel")}</h2><div className="mt-3 space-y-2">{resources.map((resource) => <button key={resource.id} type="button" aria-pressed={selectedId === resource.id} onClick={() => setSelectedId(resource.id)} className={`w-full rounded-xl border p-3 text-left transition-colors ${selectedId === resource.id ? "border-[#881337] bg-rose-50/70 dark:border-[#FBBF24] dark:bg-amber-950/20" : "border-stone-200 hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5"}`}><span className="block text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{resource.title}</span><span className="mt-1 block text-xs text-stone-500 dark:text-[#A89C90]">{resource.subject} · {t("classroomWorkflows.learningResources.unit", { unit: resource.unit_number })}</span><span className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-[#A89C90]"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{formatDate(resource.published_at, i18n.language)}</span></button>)}</div></aside>
              <article className="min-h-[24rem] rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-7">{selected ? <><div className="border-b border-stone-200 pb-4 dark:border-white/10"><p className="text-xs font-semibold uppercase tracking-wide text-[#881337] dark:text-[#FBBF24]">{selected.subject} · {t("classroomWorkflows.learningResources.unit", { unit: selected.unit_number })}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-900 dark:text-[#FDFBF7]">{selected.title}</h2><p className="mt-2 text-xs text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.learningResources.teacher")}: {selected.teacher} · {t("classroomWorkflows.learningResources.class")}: {selected.section} · {t("classroomWorkflows.learningResources.published", { date: formatDate(selected.published_at, i18n.language) })}</p></div><div className="pt-5"><ResourceContent content={selected.content_markdown} /></div></> : <p className="text-sm text-stone-500 dark:text-[#A89C90]">{t("classroomWorkflows.learningResources.selectPrompt")}</p>}</article>
            </section>}
  </PortalPage>;
}
