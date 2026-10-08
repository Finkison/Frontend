
const DB_NAME = "finkison_offline_db";
const DB_VERSION = 1;

export interface QueuedReview {
  id: string;
  concept_id: string;
  quality: 1 | 2 | 3 | 4;
  response_time_ms: number;
  timestamp: string;
}

export interface QueuedStudyEvent {
  id: string;
  event_type: string;
  concept_id?: string;
  duration_seconds: number;
  confidence_before?: number;
  is_correct?: boolean;
  timestamp: string;
}

class OfflineDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.indexedDB) {
        return reject(new Error("IndexedDB is not supported on this platform"));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Offline queued reviews
        if (!db.objectStoreNames.contains("queued_reviews")) {
          db.createObjectStore("queued_reviews", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("queued_events")) {
          db.createObjectStore("queued_events", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("cached_content")) {
          db.createObjectStore("cached_content", { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async queueReview(review: Omit<QueuedReview, "id" | "timestamp">): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_reviews", "readwrite");
      const store = tx.objectStore("queued_reviews");
      const item: QueuedReview = {
        ...review,
        id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      store.put(item);
    } catch (e) {
      console.warn("Failed to queue review in IndexedDB:", e);
    }
  }

  async getQueuedReviews(): Promise<QueuedReview[]> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_reviews", "readonly");
      const store = tx.objectStore("queued_reviews");
      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  // Clear synced reviews
  async clearQueuedReviews(ids: string[]): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_reviews", "readwrite");
      const store = tx.objectStore("queued_reviews");
      ids.forEach((id) => store.delete(id));
    } catch (e) {
      console.warn("Failed to clear queued reviews:", e);
    }
  }

  async queueStudyEvent(event: Omit<QueuedStudyEvent, "id" | "timestamp">): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_events", "readwrite");
      const store = tx.objectStore("queued_events");
      const item: QueuedStudyEvent = {
        ...event,
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      store.put(item);
    } catch (e) {
      console.warn("Failed to queue event in IndexedDB:", e);
    }
  }

  async getQueuedEvents(): Promise<QueuedStudyEvent[]> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_events", "readonly");
      const store = tx.objectStore("queued_events");
      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async clearQueuedEvents(ids: string[]): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("queued_events", "readwrite");
      const store = tx.objectStore("queued_events");
      ids.forEach((id) => store.delete(id));
    } catch (e) {
      console.warn("Failed to clear queued events:", e);
    }
  }

  async setCachedData<T>(key: string, data: T): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("cached_content", "readwrite");
      tx.objectStore("cached_content").put({ key, data, cachedAt: Date.now() });
    } catch (e) {
      console.warn("Failed to cache content:", e);
    }
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction("cached_content", "readonly");
      return new Promise((resolve) => {
        const request = tx.objectStore("cached_content").get(key);
        request.onsuccess = () => resolve(request.result ? request.result.data : null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }
}

export const offlineDB = new OfflineDatabase();
