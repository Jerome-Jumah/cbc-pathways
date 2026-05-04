"use client"

import {
  SAVED_ITEMS_CHANGED_EVENT,
  type SavedItem,
  getSavedItems,
  isSaved as readIsSaved,
  toggleSaved as toggleStoredSaved,
} from "@/lib/saved-items"
import { useCallback, useEffect, useState } from "react"

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>([])

  const refresh = useCallback(() => {
    setItems(getSavedItems())
  }, [])

  useEffect(() => {
    queueMicrotask(refresh)
    window.addEventListener("storage", refresh)
    window.addEventListener(SAVED_ITEMS_CHANGED_EVENT, refresh)

    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener(SAVED_ITEMS_CHANGED_EVENT, refresh)
    }
  }, [refresh])

  const isSaved = useCallback((id: string, type: SavedItem["type"]) => {
    return readIsSaved(id, type)
  }, [])

  const toggleSaved = useCallback((item: SavedItem) => {
    toggleStoredSaved(item)
    refresh()
  }, [refresh])

  return { items, isSaved, toggleSaved }
}
