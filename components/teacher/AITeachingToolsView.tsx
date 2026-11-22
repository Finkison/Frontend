import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Archive, BookOpen, Check, Copy, Download, Loader2, RefreshCw, Save, Search, Sparkles } from "lucide-react";
import { useToast } from "../ui/Toast";
import PortalPage from "../shared/PortalPage";
import {
  archiveTeacherTeachingResource,
  executeAITeachingTool,
  getAITeachingTools,
  getTeacherAssignedPairs,
  getTeacherTeachingResources,
  publishTeacherTeachingResource,
  restoreTeacherTeachingResource,
  updateTeacherTeachingResource,
  type TeacherTeachingResource,
} from "../../services/schoolService";
import PageHeader from "../shared/PageHeader";
import { useI18n } from "../../i18n";

type TeachingTool = { id: string; name: string; description: string };
type TeachingAssignment = { section_id: string | number; section_name?: string; grade?: string; subject_id: string | number; subject_name: string };
type ToolResult = { resourceId: string; title: string; content: string; section: string; status: "draft" | "published" | "archived" };

const assignmentKey = (item: TeachingAssignment) => `${item.subject_id}:${item.section_id}`;

function formatUpdatedAt(value: string, locale: string, fallback: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString(locale);
}

export default function AITeachingToolsView(): React.ReactElement {
  const { showToast } = useToast();
  const { t, language: appLanguage } = useI18n();
  const [searchParams] = useSearchParams();
  const requestedTool = searchParams.get("tool") || "";
  const dateLocale = appLanguage === "am" ? "am-ET" : appLanguage === "om" ? "om-ET" : "en-ET";
  const [tools, setTools] = useState<TeachingTool[]>([]);
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [resources, setResources] = useState<TeacherTeachingResource[]>([]);
  const [toolId, setToolId] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [unitNumber, setUnitNumber] = useState(1);
  const [language, setLanguage] = useState("English");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState("");
  const [resourcesPage, setResourcesPage] = useState(1);
  const [resourcesHasMore, setResourcesHasMore] = useState(false);
  const [resourcesRetryPage, setResourcesRetryPage] = useState(1);
  const [librarySearchDraft, setLibrarySearchDraft] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryStatus, setLibraryStatus] = useState("all");
  const [generating, setGenerating] = useState(false);
  const [savingResource, setSavingResource] = useState(false);
  const [publishingResource, setPublishingResource] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [confirmArchiveResourceId, setConfirmArchiveResourceId] = useState<string | null>(null);
  const [archivingResourceId, setArchivingResourceId] = useState<string | null>(null);
  const [restoringResourceId, setRestoringResourceId] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [savedContent, setSavedContent] = useState("");

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [toolsResponse, assignmentsResponse] = await Promise.all([
        getAITeachingTools(),
        getTeacherAssignedPairs(),
      ]);
      const nextTools = Array.isArray(toolsResponse.data?.tools) ? toolsResponse.data.tools : [];
      const nextAssignments = Array.isArray(assignmentsResponse.data?.pairs) ? assignmentsResponse.data.pairs : [];
      setTools(nextTools);
      setAssignments(nextAssignments);
      setToolId((current) => current || nextTools[0]?.id || "");
      setAssignmentId((current) => current || (nextAssignments[0] ? assignmentKey(nextAssignments[0]) : ""));
    } catch {
      setLoadError(t("teacherAiTools.workspaceLoadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadResources = useCallback(async (page = 1, append = false) => {
    setResourcesLoading(true);
    setResourcesError("");
    try {
      const response = await getTeacherTeachingResources({
        page,
        page_size: 25,
        status: libraryStatus === "all" ? undefined : libraryStatus,
        search: librarySearch || undefined,
      });
      const data = response.data;
      const nextResources = Array.isArray(data?.resources) ? data.resources : [];
      setResources((current) => append ? [...current, ...nextResources] : nextResources);
      setResourcesPage(data?.page || page);
      setResourcesHasMore(Boolean(data?.has_more));
      setResourcesRetryPage(data?.page || page);
    } catch {
      setResourcesError(t("teacherAiTools.libraryLoadError"));
      setResourcesRetryPage(page);
    } finally {
      setResourcesLoading(false);
    }
  }, [librarySearch, libraryStatus, t]);

  useEffect(() => { void loadWorkspace(); }, [loadWorkspace]);
  useEffect(() => { void loadResources(1); }, [loadResources]);
  useEffect(() => {
    if (requestedTool && tools.some((tool) => tool.id === requestedTool)) {
      setToolId(requestedTool);
    }
  }, [requestedTool, tools]);
  useEffect(() => {
    const timeout = window.setTimeout(() => setLibrarySearch(librarySearchDraft.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [librarySearchDraft]);

  const selectedTool = tools.find((tool) => tool.id === toolId);
  const selectedAssignment = assignments.find((item) => assignmentKey(item) === assignmentId);
  const canGenerate = Boolean(selectedTool && selectedAssignment);
  const hasUnsavedChanges = Boolean(result && result.content !== savedContent);

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTool || !selectedAssignment || generating) return;
    setGenerating(true);
    setResult(null);
    try {
      const response = await executeAITeachingTool({
        tool_id: selectedTool.id,
        subject_id: String(selectedAssignment.subject_id),
        section_id: String(selectedAssignment.section_id),
        unit_number: unitNumber,
        context: context.trim(),
        language_level: language,
      });
      const data = response.data?.data || response.data;
      if (data?.success === false || !data?.resource_id || !data?.content_markdown) {
        throw new Error(data?.error || "The teaching draft could not be created and saved.");
      }
      const nextResult = {
        resourceId: String(data.resource_id),
        title: String(data.title || selectedTool.name),
        content: String(data.content_markdown),
        section: selectedAssignment.section_name || selectedAssignment.grade || t("teacherAiTools.classFallback", { id: selectedAssignment.section_id }),
        status: "draft" as const,
      };
      setResult(nextResult);
      setSavedContent(nextResult.content);
      setResources((current) => [
        {
          id: nextResult.resourceId,
          tool_type: selectedTool.id,
          title: nextResult.title,
          content_markdown: nextResult.content,
          subject: selectedAssignment.subject_name,
          section: selectedAssignment.section_name || selectedAssignment.grade || t("teacherAiTools.classFallback", { id: selectedAssignment.section_id }),
          unit_number: unitNumber,
          status: "draft" as const,
          created_at: String(data.created_at || new Date().toISOString()),
          updated_at: String(data.created_at || new Date().toISOString()),
        },
        ...current.filter((item) => item.id !== nextResult.resourceId),
      ].slice(0, 100));
      showToast({ title: t("teacherAiTools.draftCreatedTitle"), message: t("teacherAiTools.draftCreatedMessage"), type: "success" });
    } catch (error: any) {
      showToast({ title: t("teacherAiTools.createFailedTitle"), message: t("teacherAiTools.createFailedMessage"), type: "error" });
    } finally {
      setGenerating(false);
    }
  };

  const openResource = (resource: TeacherTeachingResource) => {
    if (result?.resourceId === resource.id && hasUnsavedChanges) return;
    if (result && result.resourceId !== resource.id && hasUnsavedChanges) {
      showToast({ title: t("teacherAiTools.saveEditsFirst"), message: t("teacherAiTools.saveEditsFirstMessage"), type: "error" });
      return;
    }
    setResult({ resourceId: resource.id, title: resource.title, content: resource.content_markdown, section: resource.section, status: resource.status });
    setSavedContent(resource.content_markdown);
    setConfirmPublish(false);
  };

  const saveResource = async () => {
    if (!result || result.status !== "draft" || savingResource || !hasUnsavedChanges) return;
    setSavingResource(true);
    try {
      await updateTeacherTeachingResource(result.resourceId, { title: result.title, content_markdown: result.content });
      setSavedContent(result.content);
      setResources((current) => current.map((item) => item.id === result.resourceId
        ? { ...item, title: result.title, content_markdown: result.content, updated_at: new Date().toISOString() }
        : item));
      showToast({ title: t("teacherAiTools.draftSavedTitle"), message: t("teacherAiTools.draftSavedMessage"), type: "success" });
    } catch (error: any) {
      showToast({ title: t("teacherAiTools.saveFailedTitle"), message: t("teacherAiTools.saveFailedMessage"), type: "error" });
    } finally {
      setSavingResource(false);
    }
  };

  const publishResource = async () => {
    if (!result || result.status !== "draft" || hasUnsavedChanges || publishingResource || archivingResourceId === result.resourceId) return;
    setPublishingResource(true);
    try {
      const response = await publishTeacherTeachingResource(result.resourceId);
      if (response.data?.success === false) throw new Error(response.data?.error || "The resource could not be published.");
      const publishedAt = String(response.data?.published_at || new Date().toISOString());
      setResources((current) => current.map((item) => item.id === result.resourceId
        ? { ...item, status: "published", published_at: publishedAt, updated_at: publishedAt }
        : item));
      setResult((current) => current?.resourceId === result.resourceId ? { ...current, status: "published" } : current);
      setConfirmPublish(false);
      showToast({ title: t("teacherAiTools.resourcePublishedTitle"), message: t("teacherAiTools.resourcePublishedMessage", { section: result.section }), type: "success" });
    } catch (error: any) {
      showToast({ title: t("teacherAiTools.publishFailedTitle"), message: t("teacherAiTools.publishFailedMessage"), type: "error" });
    } finally {
      setPublishingResource(false);
    }
  };

  const archiveResource = async (resource: TeacherTeachingResource) => {
    if (resource.status === "archived" || archivingResourceId) return;
    if (result?.resourceId === resource.id && hasUnsavedChanges) {
      showToast({ title: t("teacherAiTools.saveEditsFirst"), message: t("teacherAiTools.saveEditsFirstMessage"), type: "error" });
      return;
    }
    setConfirmArchiveResourceId(resource.id);
  };

  const confirmArchiveResource = async (resource: TeacherTeachingResource) => {
    if (resource.status === "archived" || archivingResourceId) return;
    setArchivingResourceId(resource.id);
    try {
      await archiveTeacherTeachingResource(resource.id);
      setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: "archived" } : item));
      if (result?.resourceId === resource.id) setResult((current) => current ? { ...current, status: "archived" } : current);
      setConfirmPublish(false);
      setConfirmArchiveResourceId(null);
      void loadResources(1);
      showToast({ title: t("teacherAiTools.resourceArchivedTitle"), message: t("teacherAiTools.resourceArchivedMessage"), type: "success" });
    } catch (error: any) {
      showToast({ title: t("teacherAiTools.archiveFailedTitle"), message: t("teacherAiTools.archiveFailedMessage"), type: "error" });
    } finally {
      setArchivingResourceId(null);
    }
  };

  const restoreResource = async (resource: TeacherTeachingResource) => {
    if (resource.status !== "archived" || restoringResourceId) return;
    setRestoringResourceId(resource.id);
    try {
      await restoreTeacherTeachingResource(resource.id);
      setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: "draft", updated_at: new Date().toISOString() } : item));
      setResult((current) => current?.resourceId === resource.id ? { ...current, status: "draft" } : current);
      setSavedContent(resource.content_markdown);
      void loadResources(1);
      showToast({ title: t("teacherAiTools.resourceRestoredTitle"), message: t("teacherAiTools.resourceRestoredMessage"), type: "success" });
    } catch {
      showToast({ title: t("teacherAiTools.restoreFailedTitle"), message: t("teacherAiTools.restoreFailedMessage"), type: "error" });
    } finally {
      setRestoringResourceId(null);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.content);
      showToast({ title: t("teacherAiTools.draftCopiedTitle"), message: t("teacherAiTools.draftCopiedMessage"), type: "success" });
    } catch {
      showToast({ title: t("teacherAiTools.copyFailedTitle"), message: t("teacherAiTools.copyFailedMessage"), type: "error" });
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const file = new Blob([`# ${result.title}\n\n${result.content}`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "teaching-draft"}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const noAssignments = useMemo(() => !loading && !loadError && assignments.length === 0, [loading, loadError, assignments.length]);

  return (
    <PortalPage className="max-w-6xl space-y-6">
      <PageHeader
        eyebrow={t("teacherAiTools.eyebrow")}
        title={t("teacherAiTools.title")}
        description={t("teacherAiTools.description")}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={handleGenerate} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#261E1A] sm:p-6">
          {loading ? <p role="status" className="text-sm text-stone-500 dark:text-[#A89C90]">{t("teacherAiTools.loadingTools")}</p>
            : loadError ? <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><p>{loadError}</p><button type="button" onClick={() => void loadWorkspace()} className="mt-3 inline-flex min-h-9 items-center gap-1.5 font-semibold underline underline-offset-2"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherAiTools.retry")}</button></div>
              : noAssignments ? <div className="rounded-xl border border-dashed border-stone-300 p-6 text-center dark:border-white/15"><BookOpen className="mx-auto h-7 w-7 text-stone-400" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherAiTools.noAssignmentTitle")}</h2><p className="mt-1 text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("teacherAiTools.noAssignmentDescription")}</p></div>
                : tools.length === 0 ? <div role="status" className="rounded-xl border border-dashed border-stone-300 p-6 text-center dark:border-white/15"><Sparkles className="mx-auto h-7 w-7 text-stone-400" aria-hidden="true" /><h2 className="mt-3 text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherAiTools.noToolsTitle")}</h2><p className="mt-1 text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("teacherAiTools.noToolsDescription")}</p><button type="button" onClick={() => void loadWorkspace()} className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-white dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherAiTools.refresh")}</button></div>
                : <>
                  <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAiTools.toolLabel")}</span><select value={toolId} onChange={(event) => setToolId(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{tools.map((tool) => <option key={tool.id} value={tool.id}>{t(`teacherAiTools.toolNames.${tool.id}`, { defaultValue: tool.name })}</option>)}</select>{selectedTool && <p className="text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t(`teacherAiTools.toolDescriptions.${selectedTool.id}`, { defaultValue: selectedTool.description })}</p>}</label>
                  <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAiTools.assignmentLabel")}</span><select value={assignmentId} onChange={(event) => setAssignmentId(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">{assignments.map((item) => <option key={assignmentKey(item)} value={assignmentKey(item)}>{item.subject_name} / {item.section_name || item.grade || t("teacherAiTools.classFallback", { id: item.section_id })}</option>)}</select></label>
                  <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAiTools.unitLabel")}</span><input type="number" min={1} max={99} value={unitNumber} onChange={(event) => setUnitNumber(Number(event.target.value))} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /></label><label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAiTools.languageLabel")}</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]"><option value="English">{"English"}</option><option value="Amharic">{"Amharic"}</option><option value="Afaan Oromoo">{"Afaan Oromoo"}</option></select></label></div>
                  <label className="block space-y-1.5"><span className="text-xs font-semibold text-stone-700 dark:text-[#E7E0D6]">{t("teacherAiTools.contextLabel")} <span className="font-normal text-stone-500">({t("teacherAiTools.optional")})</span></span><textarea rows={4} maxLength={2000} value={context} onChange={(event) => setContext(event.target.value)} placeholder={t("teacherAiTools.contextPlaceholder")} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm leading-5 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" /><span className="block text-xs leading-5 text-stone-500 dark:text-[#A89C90]">{t("teacherAiTools.contextPrivacy")}</span></label>
                  <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-stone-600 dark:text-[#A89C90]">{t("teacherAiTools.accessNote")}</p><button type="submit" disabled={!canGenerate || generating || loading || Boolean(loadError)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#881337] px-4 text-sm font-semibold text-white hover:bg-[#9F1239] disabled:cursor-not-allowed disabled:opacity-60">{generating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}{generating ? t("teacherAiTools.creating") : t("teacherAiTools.createDraft")}</button></div>
                </>}
        </form>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-[#FAF8F5] p-5 dark:border-white/10 dark:bg-[#1C1512]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-[#FDFBF7]">{t("teacherAiTools.libraryTitle")}</h2>
              <p className="mt-1 text-xs leading-5 text-stone-600 dark:text-[#A89C90]">{t("teacherAiTools.libraryDescription")}</p>
            </div>
            <button type="button" onClick={() => void loadResources(1)} disabled={resourcesLoading} aria-label={t("teacherAiTools.refreshLibrary")} className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-stone-300 text-stone-600 hover:bg-white disabled:opacity-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">
              <RefreshCw className={`h-4 w-4 ${resourcesLoading ? "animate-spin" : ""}`} aria-hidden="true" />
            </button>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); setLibrarySearch(librarySearchDraft.trim()); }} className="mt-4 grid gap-2">
            <label className="relative block">
              <span className="sr-only">{t("teacherAiTools.searchAria")}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
              <input value={librarySearchDraft} onChange={(event) => setLibrarySearchDraft(event.target.value)} placeholder={t("teacherAiTools.searchPlaceholder")} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white pl-9 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#881337] focus:outline-none focus:ring-2 focus:ring-[#881337]/15 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]" />
            </label>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <label>
                <span className="sr-only">{t("teacherAiTools.statusFilter")}</span>
                <select value={libraryStatus} onChange={(event) => setLibraryStatus(event.target.value)} className="min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-xs text-stone-800 dark:border-white/15 dark:bg-[#1C1512] dark:text-[#FDFBF7]">
                  <option value="all">{t("teacherAiTools.allResources")}</option><option value="draft">{t("teacherAiTools.drafts")}</option><option value="published">{t("teacherAiTools.published")}</option><option value="archived">{t("teacherAiTools.archived")}</option>
                </select>
              </label>
              <button type="submit" className="min-h-10 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-white dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{t("teacherAiTools.search")}</button>
            </div>
          </form>
          {resourcesError && <div role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200"><p>{resourcesError}</p><button type="button" onClick={() => void loadResources(resourcesRetryPage, resourcesRetryPage > 1)} className="mt-2 inline-flex min-h-8 items-center gap-1.5 font-semibold underline underline-offset-2"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherAiTools.retry")}</button></div>}
          {resourcesLoading && resources.length === 0 ? <p role="status" className="mt-3 rounded-lg border border-dashed border-stone-300 p-4 text-center text-xs text-stone-500 dark:border-white/15 dark:text-[#A89C90]">{t("teacherAiTools.loadingLibrary")}</p>
              : resources.length === 0 ? <p className="mt-3 rounded-lg border border-dashed border-stone-300 p-4 text-center text-xs text-stone-500 dark:border-white/15 dark:text-[#A89C90]">{librarySearch || libraryStatus !== "all" ? t("teacherAiTools.noMatches") : t("teacherAiTools.emptyLibrary")}</p>
              : <div className="mt-3 space-y-2">
                {resources.map((resource) => <article key={resource.id} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-[#261E1A]">
                  <div className="flex items-start justify-between gap-2">
                    <button type="button" onClick={() => openResource(resource)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-xs font-semibold text-stone-900 dark:text-[#FDFBF7]">{resource.title}</span>
                      <span className="mt-1 block text-[11px] text-stone-500 dark:text-[#A89C90]">{resource.subject} / {resource.section} / {formatUpdatedAt(resource.updated_at, dateLocale, t("teacherAiTools.dateUnknown"))}</span>
                    </button>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${resource.status === "draft" ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200" : resource.status === "published" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-[#A89C90]"}`}>{resource.status === "draft" ? t("teacherAiTools.statusDraft") : resource.status === "published" ? t("teacherAiTools.statusPublished") : t("teacherAiTools.statusArchived")}</span>
                  </div>
                  {resource.status !== "archived" && <>
                    <button type="button" onClick={() => void archiveResource(resource)} disabled={archivingResourceId === resource.id || (publishingResource && result?.resourceId === resource.id)} className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[11px] font-semibold text-stone-500 hover:text-rose-700 disabled:opacity-50 dark:text-[#A89C90] dark:hover:text-rose-200"><Archive className="h-3.5 w-3.5" aria-hidden="true" />{resource.status === "published" ? t("teacherAiTools.unpublishArchive") : t("teacherAiTools.archiveDraft")}</button>
                    {confirmArchiveResourceId === resource.id && <div role="group" aria-label="Confirm archive resource" className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <p className="text-xs font-semibold text-amber-950 dark:text-amber-100">{t("teacherAiTools.archiveTitle", { title: resource.title })}</p>
                      <p className="mt-1 text-[11px] leading-4 text-amber-900 dark:text-amber-200">{resource.status === "published" ? t("teacherAiTools.archivePublishedDescription") : t("teacherAiTools.archiveDraftDescription")}</p>
                      <div className="mt-2 flex gap-2">
                        <button type="button" onClick={() => void confirmArchiveResource(resource)} disabled={archivingResourceId === resource.id} className="inline-flex min-h-8 items-center gap-1 rounded-md bg-amber-800 px-2.5 text-[11px] font-semibold text-white disabled:opacity-60">{archivingResourceId === resource.id && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}{archivingResourceId === resource.id ? t("teacherAiTools.archiving") : t("teacherAiTools.confirmArchive")}</button>
                        <button type="button" onClick={() => setConfirmArchiveResourceId(null)} disabled={archivingResourceId === resource.id} className="min-h-8 rounded-md border border-amber-900/30 px-2.5 text-[11px] font-semibold text-amber-950 dark:text-amber-100">{t("teacherAiTools.cancel")}</button>
                      </div>
                    </div>}
                  </>}
                  {resource.status === "archived" && <button type="button" onClick={() => void restoreResource(resource)} disabled={restoringResourceId === resource.id} className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-[11px] font-semibold text-[#881337] hover:underline disabled:opacity-50 dark:text-[#FBBF24]">{restoringResourceId === resource.id && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}{restoringResourceId === resource.id ? t("teacherAiTools.restoring") : t("teacherAiTools.restoreDraft")}</button>}
                </article>)}
                {resourcesHasMore && <button type="button" onClick={() => void loadResources(resourcesPage + 1, true)} disabled={resourcesLoading} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 hover:bg-white disabled:opacity-50 dark:border-white/15 dark:text-[#E7E0D6] dark:hover:bg-white/5">{resourcesLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}{resourcesLoading ? t("teacherAiTools.loadingMore") : t("teacherAiTools.loadMore")}</button>}
              </div>}
        </aside>
      </section>

      {result && <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-white/10 dark:bg-[#261E1A]" aria-labelledby="teaching-tool-result-title">
        <header className="flex flex-col gap-3 border-b border-stone-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><Check className="h-4 w-4" aria-hidden="true" />{result.status === "draft" ? t("teacherAiTools.privateDraft") : result.status === "published" ? t("teacherAiTools.publishedTo", { section: result.section }) : t("teacherAiTools.archivedReadOnly")}</p><h2 id="teaching-tool-result-title" className="mt-1 text-lg font-semibold text-stone-900 dark:text-[#FDFBF7]">{result.title}</h2></div>
          <div className="flex flex-wrap gap-2">
            {result.status === "draft" && <button type="button" onClick={() => void saveResource()} disabled={!hasUnsavedChanges || savingResource} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#881337] px-3 text-xs font-semibold text-white disabled:opacity-50"><Save className="h-3.5 w-3.5" aria-hidden="true" />{savingResource ? t("teacherAiTools.saving") : hasUnsavedChanges ? t("teacherAiTools.saveChanges") : t("teacherAiTools.saved")}</button>}
            {result.status === "draft" && <button type="button" onClick={() => setConfirmPublish((current) => !current)} disabled={hasUnsavedChanges || publishingResource || savingResource} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#881337] px-3 text-xs font-semibold text-[#881337] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#FBBF24] dark:text-[#FBBF24]">{t("teacherAiTools.publishToClass")}</button>}
            <button type="button" onClick={() => void copyResult()} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]"><Copy className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherAiTools.copy")}</button>
            <button type="button" onClick={downloadResult} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-semibold text-stone-700 dark:border-white/15 dark:text-[#E7E0D6]"><Download className="h-3.5 w-3.5" aria-hidden="true" />{t("teacherAiTools.download")}</button>
          </div>
        </header>
        {result.status === "draft" && confirmPublish && <div className="mx-5 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20"><p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{t("teacherAiTools.confirmPublishTitle", { section: result.section })}</p><p className="mt-1 text-xs leading-5 text-emerald-800 dark:text-emerald-200">{t("teacherAiTools.confirmPublishDescription")}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void publishResource()} disabled={publishingResource} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white disabled:opacity-60">{publishingResource && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}{publishingResource ? t("teacherAiTools.publishing") : t("teacherAiTools.confirmPublish")}</button><button type="button" onClick={() => setConfirmPublish(false)} disabled={publishingResource} className="min-h-9 rounded-lg border border-emerald-800/20 px-3 text-xs font-semibold text-emerald-900 dark:text-emerald-100">{t("teacherAiTools.cancel")}</button></div></div>}
        <label className="block p-5"><span className="mb-2 block text-xs font-semibold text-stone-600 dark:text-[#A89C90]">{t("teacherAiTools.contentLabel")}</span><textarea aria-label={t("teacherAiTools.contentLabel")} readOnly={result.status !== "draft"} value={result.content} onChange={(event) => { setConfirmPublish(false); setResult((current) => current ? { ...current, content: event.target.value } : current); }} rows={22} maxLength={100000} className="max-h-[70vh] min-h-[28rem] w-full resize-y rounded-xl border border-stone-200 bg-[#FAF8F5] p-4 font-mono text-sm leading-6 text-stone-800 outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/15 read-only:opacity-80 dark:border-white/10 dark:bg-[#1C1512] dark:text-[#E7E0D6]" /></label>
        {hasUnsavedChanges && <p className="px-5 pb-4 text-xs text-amber-700 dark:text-amber-200">{t("teacherAiTools.unsavedChanges")}</p>}
      </section>}
    </PortalPage>
  );
}
