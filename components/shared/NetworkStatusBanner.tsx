import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { offlineSyncService } from "../../services/offlineSync";

export default function NetworkStatusBanner(): React.ReactElement | null {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      offlineSyncService.syncAll().catch(() => {});
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  if (!isOnline) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md z-50 sticky top-0">
        <WifiOff className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span>
          Offline Resilience Mode Active: Local device caching enabled. Your exam answers will auto-sync once connection restores.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-md z-50 sticky top-0 transition-opacity duration-500">
      <Wifi className="w-4 h-4 shrink-0 text-emerald-200" />
      <span>Online: Network connection restored. Synced with Finkison National Cloud.</span>
    </div>
  );
}
