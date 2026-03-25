"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { homeDemoNewsItems } from "@/page-components/home/dummy-data/news";

const STORAGE_KEY = "jijinews.saved-news-ids";
const STORAGE_EVENT = "saved-news-updated";

const defaultSavedIds = homeDemoNewsItems
  .filter((article) => article.isSaved)
  .map((article) => article.id);

function getDefaultSavedIds() {
  return [...defaultSavedIds];
}

function normalizeSavedIds(ids: string[]) {
  return Array.from(new Set(ids));
}

function dispatchSavedNewsUpdated(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<string[]>(STORAGE_EVENT, { detail: ids }),
  );
}

export function readSavedNewsIds() {
  if (typeof window === "undefined") {
    return getDefaultSavedIds();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const initial = getDefaultSavedIds();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("saved ids should be an array");
    }

    return normalizeSavedIds(
      parsed.filter((id): id is string => typeof id === "string"),
    );
  } catch {
    const fallback = getDefaultSavedIds();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function writeSavedNewsIds(ids: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeSavedIds(ids);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  dispatchSavedNewsUpdated(normalized);
}

export function toggleSavedNewsId(newsId: string) {
  const currentIds = readSavedNewsIds();
  const nextIds = currentIds.includes(newsId)
    ? currentIds.filter((id) => id !== newsId)
    : [...currentIds, newsId];

  writeSavedNewsIds(nextIds);
  return nextIds;
}

export function useSavedNews() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const syncSavedIds = () => {
      setSavedIds(readSavedNewsIds());
    };

    syncSavedIds();

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== STORAGE_KEY) {
        return;
      }

      syncSavedIds();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, syncSavedIds);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, syncSavedIds);
    };
  }, []);

  const savedIdSet = useMemo(() => new Set(savedIds), [savedIds]);

  const isSaved = useCallback(
    (newsId: string) => {
      return savedIdSet.has(newsId);
    },
    [savedIdSet],
  );

  const toggleSaved = useCallback((newsId: string) => {
    const nextIds = toggleSavedNewsId(newsId);
    setSavedIds(nextIds);
  }, []);

  return {
    savedIds,
    isSaved,
    toggleSaved,
    setSavedIds: writeSavedNewsIds,
  };
}
