import {
  SAVED_ITEMS_KEY,
  getSavedItems,
  isSaved,
  removeItem,
  saveItem,
  toggleSaved,
  type SavedItem,
} from "@/lib/saved-items"
import { beforeEach, describe, expect, it } from "vitest"

const school: SavedItem = {
  id: "school-1",
  type: "school",
  title: "Alliance High School",
  subtitle: "Nairobi",
  href: "/school/school-1",
  savedAt: "2026-05-04T00:00:00.000Z",
}

const track: SavedItem = {
  id: "track-1",
  type: "track",
  title: "Pure Sciences",
  href: "/explore-tracks/track-1",
  savedAt: "2026-05-04T01:00:00.000Z",
}

describe("saved items storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("saves latest items first and persists them", () => {
    saveItem(school)
    saveItem(track)

    expect(getSavedItems()).toEqual([track, school])
  })

  it("prevents duplicates by id and type", () => {
    saveItem(school)
    saveItem({ ...school, title: "Alliance Updated", savedAt: "2026-05-04T02:00:00.000Z" })

    expect(getSavedItems()).toHaveLength(1)
    expect(getSavedItems()[0].title).toBe("Alliance Updated")
  })

  it("removes and toggles saved items", () => {
    saveItem(school)
    expect(isSaved(school.id, school.type)).toBe(true)

    removeItem(school.id, school.type)
    expect(isSaved(school.id, school.type)).toBe(false)

    toggleSaved(school)
    expect(isSaved(school.id, school.type)).toBe(true)

    toggleSaved(school)
    expect(isSaved(school.id, school.type)).toBe(false)
  })

  it("falls back to an empty list for invalid JSON", () => {
    localStorage.setItem(SAVED_ITEMS_KEY, "{bad json")
    expect(getSavedItems()).toEqual([])
  })
})
