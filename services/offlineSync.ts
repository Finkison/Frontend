
import { offlineDB } from "../utils/offlineDB";
import { learningEngineService } from "./learningEngineService";

class OfflineSyncService {
  private isSyncing = false;

  init() {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
      console.log("[OfflineSync] Network restored. Syncing pending data...");
      this.syncAll();
    });
  }

  async syncAll(): Promise<{ reviewsSynced: number; eventsSynced: number }> {
    if (this.isSyncing || !navigator.onLine) {
      return { reviewsSynced: 0, eventsSynced: 0 };
    }

    this.isSyncing = true;
    let reviewsSynced = 0;
    let eventsSynced = 0;

    try {
      const queuedReviews = await offlineDB.getQueuedReviews();
      if (queuedReviews.length > 0) {
        const syncedIds: string[] = [];
        for (const rev of queuedReviews) {
          try {
            await learningEngineService.submitReview(
              rev.concept_id,
              (rev.quality >= 1 && rev.quality <= 4 ? rev.quality : 3) as 1 | 2 | 3 | 4,
              rev.response_time_ms
            );
            syncedIds.push(rev.id);
            reviewsSynced++;
          } catch (err) {
            console.warn(`[OfflineSync] Failed to sync review ${rev.id}:`, err);
            break;
          }
        }
        if (syncedIds.length > 0) {
          await offlineDB.clearQueuedReviews(syncedIds);
        }
      }

      const queuedEvents = await offlineDB.getQueuedEvents();
      if (queuedEvents.length > 0) {
        const syncedEventIds: string[] = [];
        for (const evt of queuedEvents) {
          try {
            await learningEngineService.recordStudyEvent({
              event_type: evt.event_type,
              concept_id: evt.concept_id,
              duration_seconds: evt.duration_seconds,
              confidence_before: evt.confidence_before,
              is_correct: evt.is_correct,
              is_offline: true,
            });
            syncedEventIds.push(evt.id);
            eventsSynced++;
          } catch (err) {
            console.warn(`[OfflineSync] Failed to sync event ${evt.id}:`, err);
            break;
          }
        }
        if (syncedEventIds.length > 0) {
          await offlineDB.clearQueuedEvents(syncedEventIds);
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return { reviewsSynced, eventsSynced };
  }
}

export const offlineSyncService = new OfflineSyncService();
