/**
 * Custom hook to watch for admin data changes in localStorage
 * This allows the frontend to react to admin panel updates
 */

import { useEffect, useState } from "react";

export function useAdminData<T>(
  key: string,
  defaultValue: T,
  getData: () => T
): T {
  const [data, setData] = useState<T>(defaultValue);

  useEffect(() => {
    // Initial load
    const loadData = () => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(key);
          if (stored) {
            setData(JSON.parse(stored));
          } else {
            setData(getData());
          }
        }
      } catch (error) {
        console.error(`Error loading ${key}:`, error);
        setData(getData());
      }
    };

    loadData();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing ${key}:`, error);
        }
      }
    };

    // Listen for custom events (when localStorage changes in same tab)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("adminDataChanged" as keyof WindowEventMap, handleCustomStorageChange as EventListener);

    // Poll for changes (fallback for same-tab updates) - faster polling for visibility changes
    const interval = setInterval(() => {
      loadData();
    }, 500); // Check every 500ms for faster updates

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("adminDataChanged" as keyof WindowEventMap, handleCustomStorageChange as EventListener);
      clearInterval(interval);
    };
  }, [key, getData]);

  return data;
}

/**
 * Helper function to dispatch a custom event when admin data changes
 * This notifies other components to refresh their data
 */
export function notifyAdminDataChange(key: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("adminDataChanged", {
        detail: { key },
      })
    );
  }
}
