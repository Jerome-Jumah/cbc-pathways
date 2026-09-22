"use client"

import { Button } from "@/components/ui/button"
import { useSavedItems } from "@/hooks/use-saved-items"
import type { SavedItem } from "@/lib/saved-items"
import { cn } from "@/lib/utils"
import { Bookmark01Icon, BookmarkCheck01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo } from "react"

import { trackEvent } from "@/lib/analytics"

type BookmarkButtonProps = {
  item: Omit<SavedItem, "savedAt">
  showLabel?: boolean
  className?: string
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: React.ComponentProps<typeof Button>["variant"]
}

export function BookmarkButton({
  item,
  showLabel = true,
  className,
  size = showLabel ? "default" : "icon",
  variant = "outline",
}: BookmarkButtonProps) {
  const { isSaved, toggleSaved } = useSavedItems()
  const saved = isSaved(item.id, item.type)
  const icon = saved ? BookmarkCheck01Icon : Bookmark01Icon
  const label = saved ? "Saved" : "Save"

  const savedItem = useMemo<SavedItem>(() => ({
    ...item,
    savedAt: new Date().toISOString(),
  }), [item])

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-pressed={saved}
      aria-label={`${label} ${item.title}`}
      className={cn("font-semibold", saved && "text-blue-600 dark:text-blue-300", className)}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        if (item.type === "school") {
          const match = /^\/schools\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(item.href);
          if (!match) throw new Error(`Data integrity error: school bookmark has a non-canonical URL: ${item.href}`);
          trackEvent("school_saved", { schoolSlug: match[1], saved: !saved });
        } else if (item.type === "combination") {
          trackEvent("combination_saved", { combinationId: item.id, saved: !saved });
        }
        toggleSaved(savedItem)
      }}
    >
      <HugeiconsIcon icon={icon} data-icon={showLabel ? "inline-start" : undefined} />
      {showLabel && label}
    </Button>
  )
}
