export type SavedItem = {
  id: string
  type: "school" | "combination" | "track"
  title: string
  subtitle?: string
  href: string
  savedAt: string
}

export const SAVED_ITEMS_KEY = "cbc_pathways_saved_items"
export const SAVED_ITEMS_CHANGED_EVENT = "cbc-pathways-saved-items-changed"

function getStorage() {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function emitSavedItemsChanged() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(SAVED_ITEMS_CHANGED_EVENT))
}

function parseSavedItems(value: string | null): SavedItem[] {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is SavedItem => (
      typeof item?.id === "string"
      && ["school", "combination", "track"].includes(item?.type)
      && typeof item?.title === "string"
      && typeof item?.href === "string"
      && typeof item?.savedAt === "string"
      && (item.subtitle === undefined || typeof item.subtitle === "string")
    ))
  } catch {
    return []
  }
}

function writeSavedItems(items: SavedItem[]) {
  const storage = getStorage()
  if (!storage) return

  try {
    storage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items))
    emitSavedItemsChanged()
  } catch {
    // localStorage can fail in private browsing or low-storage contexts.
  }
}

export function getSavedItems(): SavedItem[] {
  const storage = getStorage()
  if (!storage) return []

  try {
    return parseSavedItems(storage.getItem(SAVED_ITEMS_KEY))
  } catch {
    return []
  }
}

export function saveItem(item: SavedItem): void {
  const items = getSavedItems()
  const next = [
    { ...item, savedAt: item.savedAt || new Date().toISOString() },
    ...items.filter((saved) => !(saved.id === item.id && saved.type === item.type)),
  ]
  writeSavedItems(next)
}

export function removeItem(id: string, type: SavedItem["type"]): void {
  writeSavedItems(getSavedItems().filter((item) => !(item.id === id && item.type === type)))
}

export function isSaved(id: string, type: SavedItem["type"]): boolean {
  return getSavedItems().some((item) => item.id === id && item.type === type)
}

export function toggleSaved(item: SavedItem): void {
  if (isSaved(item.id, item.type)) {
    removeItem(item.id, item.type)
    return
  }

  saveItem(item)
}
