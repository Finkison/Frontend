import React, { useState, useEffect, useCallback } from "react";
import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { offlineDB } from "../../utils/offlineDB";
import { offlineSyncService } from "../../services/offlineSync";

export default function OfflineSyncBadge(): React.ReactElement {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const checkPendingQueue = useCallback(async () => {
    try {
      const [reviews, events] = await Promise.all([
        offlineDB.getQueuedReviews(),
        offlineDB.getQueuedEvents()
      ]);
      setPendingCount(reviews.length + events.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  const triggerSync = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await offlineSyncService.syncAll();
      if (res.reviewsSynced > 0 || res.eventsSynced > 0) {
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 3000);
      }
      await checkPendingQueue();
    } catch (err) {
      console.warn("Manual sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    checkPendingQueue();

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      checkPendingQueue();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodic queue check every 15 seconds
    const interval = setInterval(checkPendingQueue, 15000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [checkPendingQueue]);

  if (!isOnline) {
    return (
      <div 
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold shadow-2xs"
        title="Network offline. Questions and drills are stored locally and will synchronize when connection resumes."
      >
        <CloudOff className="w-3 h-3 text-amber-600 animate-pulse shrink-0" />
        <span>Offline ({pendingCount} queued)</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-bold shadow-2xs">
        <RefreshCw className="w-3 h-3 text-sky-600 animate-spin shrink-0" />
        <span>Syncing drills...</span>
      </div>
    );
  }

  if (justSynced) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-2xs">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Synced with Cloud</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <button
        type="button"
        onClick={triggerSync}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
        title="Click to synchronize offline drills with the cloud"
      >
        <RefreshCw className="w-3 h-3 text-amber-600 shrink-0" />
        <span>Sync {pendingCount} offline drills</span>
      </button>
    );
  }

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-600 text-[10px] font-semibold"
      title="All local drills and study sessions are synchronized with the Finkison national cloud."
    >
      <Cloud className="w-3 h-3 text-emerald-600 shrink-0" />
      <span className="hidden sm:inline">Cloud Synced</span>
    </div>
  );
}
