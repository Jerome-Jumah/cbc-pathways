"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSavedItems } from "@/hooks/use-saved-items"
import type { SavedItem } from "@/lib/saved-items"
import { Bookmark01Icon, Delete02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

const SECTIONS: Array<{ type: SavedItem["type"]; title: string }> = [
  { type: "school", title: "Saved Schools" },
  { type: "combination", title: "Saved Combinations" },
  { type: "track", title: "Saved Tracks" },
]

export default function SavedPage() {
  const { items, toggleSaved } = useSavedItems()
  const hasItems = items.length > 0

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center pb-24">
      <NavBar />

      <main className="w-full max-w-[1200px] px-4 md:px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-muted border border-border flex items-center justify-center text-blue-600 dark:text-blue-300">
              <HugeiconsIcon icon={Bookmark01Icon} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">Saved Items</h1>
              <p className="text-sm font-medium text-muted-foreground">Device-only favorites for quick access.</p>
            </div>
          </div>
        </div>

        {!hasItems && (
          <Card className="rounded-2xl border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <div className="size-14 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={Bookmark01Icon} />
              </div>
              <h2 className="text-lg font-bold text-foreground">No saved items yet.</h2>
              <p className="max-w-md text-sm font-medium text-muted-foreground">
                Save schools or combinations to access them quickly later.
              </p>
              <Button asChild className="mt-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                <Link href="/find-schools">Find schools</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {hasItems && (
          <div className="grid grid-cols-1 gap-6">
            {SECTIONS.map((section) => {
              const sectionItems = items.filter((item) => item.type === section.type)

              return (
                <Card key={section.type} className="rounded-2xl border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3 text-lg">
                      {section.title}
                      <Badge variant="secondary">{sectionItems.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sectionItems.length === 0 ? (
                      <p className="text-sm font-medium text-muted-foreground">Nothing saved here yet.</p>
                    ) : (
                      <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                        {sectionItems.map((item) => (
                          <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 bg-card p-4">
                            <div className="flex flex-1 min-w-0 flex-col gap-1">
                              <Link href={item.href} className="font-bold text-foreground hover:text-blue-600 dark:hover:text-blue-300 truncate">
                                {item.title}
                              </Link>
                              {item.subtitle && (
                                <p className="text-sm font-medium text-muted-foreground truncate">{item.subtitle}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" asChild aria-label={`Open ${item.title}`}>
                              <Link href={item.href}>
                                <HugeiconsIcon icon={ArrowRight01Icon} />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove ${item.title}`}
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => toggleSaved(item)}
                            >
                              <HugeiconsIcon icon={Delete02Icon} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
