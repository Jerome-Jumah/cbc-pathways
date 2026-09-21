"use client"

import { BookmarkButton } from "@/components/bookmark-button"
import { NavBar } from "@/components/nav-bar"
import { ShareButton } from "@/components/share-button"
import { TurnstileWidget } from "@/components/security/turnstile-widget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { COUNTY_OPTIONS } from "@/constants/filter-options"
import { useHumanVerification } from "@/context/human-verification-context"
import { ApiError, apiPost, buildQuery } from "@/lib/api-client"
import type { RecommendationResult, RecommendationResponse } from "@/types/api"
import { ArrowRight01Icon, Building03Icon, InformationCircleIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"

function RecommendationResultsInner() {
  const searchParams = useSearchParams()
  const subjects = useMemo(() => (
    searchParams.get("subjects")?.split(",").map(subject => subject.trim()).filter(Boolean) ?? []
  ), [searchParams])
  const interests = useMemo(() => (
    searchParams.get("interests")?.split(",").map(interest => interest.trim()).filter(Boolean) ?? []
  ), [searchParams])
  const county = searchParams.get("county") ?? undefined
  const gender = searchParams.get("gender") ?? undefined

  const {
    isHumanVerified,
    isVerifying: verificationLoading,
    verificationError,
    verifyHuman,
  } = useHumanVerification()

  const [results, setResults] = useState<RecommendationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shareHref = useMemo(() => `/recommendations/results${buildQuery({
    subjects,
    interests,
    county,
    gender,
  })}`, [county, gender, interests, subjects])

  const exploreMoreSchoolsHref = useMemo(() => {
    const recommendedCombinationIds = results?.pathwayRecommendations.slice(0, 8).map(combo => combo.id) ?? []
    return `/find-schools${buildQuery({
      subjects,
      interests,
      county,
      gender,
      recommendedCombinationIds,
      preferredTrack: results?.pathwayRecommendations[0]?.track?.name,
    })}`
  }, [county, gender, interests, results, subjects])

  const fetchRecommendations = useCallback(async () => {
    if (subjects.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const res = await apiPost<RecommendationResponse>("/recommendations", { subjects, county, gender })
      setResults(res.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load recommendation results.")
    } finally {
      setLoading(false)
    }
  }, [county, gender, subjects])

  useEffect(() => {
    if (isHumanVerified) {
      queueMicrotask(() => {
        void fetchRecommendations()
      })
    }
  }, [fetchRecommendations, isHumanVerified])

  const handleVerify = useCallback(async (token: string) => {
    await verifyHuman(token)
  }, [verifyHuman])

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center pb-24">
      <NavBar />

      <main className="w-full max-w-[1100px] px-4 md:px-6 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-extrabold text-foreground">Recommendation Results</h1>
          <div className="flex flex-wrap gap-2">
            {subjects.map(subject => <Badge key={subject} variant="secondary">{subject}</Badge>)}
            {county && <Badge variant="outline">{COUNTY_OPTIONS.find(c => c.value === county)?.label ?? county}</Badge>}
            {gender && <Badge variant="outline">{gender}</Badge>}
          </div>
        </div>

        {subjects.length === 0 && (
          <Card className="rounded-2xl border-border p-8 text-center">
            <p className="font-bold text-foreground">This shared link is missing subjects.</p>
            <Button asChild className="mt-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              <Link href="/recommendations">Start recommendations</Link>
            </Button>
          </Card>
        )}

        {subjects.length > 0 && !isHumanVerified && (
          <Card className="mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border-border p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-foreground">Verify to load shared results</h2>
            <p className="mb-5 text-sm font-medium text-muted-foreground">
              This regenerates the recommendation safely from the shared inputs.
            </p>
            <TurnstileWidget
              onVerify={handleVerify}
              className="w-full"
            />
            {verificationLoading && <p className="mt-3 text-sm font-medium text-muted-foreground">Verifying…</p>}
            {verificationError && <p className="mt-3 text-sm font-semibold text-red-600">{verificationError}</p>}
          </Card>
        )}

        {isHumanVerified && loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-muted-foreground">Regenerating recommendations…</p>
          </div>
        )}

        {isHumanVerified && !loading && error && (
          <Card className="rounded-2xl border-border p-8 text-center">
            <HugeiconsIcon icon={InformationCircleIcon} className="mx-auto mb-3 text-red-500" />
            <p className="font-bold text-foreground">Could not load recommendations</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchRecommendations} className="mt-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
              Try again
            </Button>
          </Card>
        )}

        {isHumanVerified && !loading && results && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm">
                <h2 className="font-bold text-foreground mb-6">Recommended Combinations</h2>
                <div className="flex flex-col gap-3">
                  {results.pathwayRecommendations.map((combo, idx) => {
                    const title = combo.Subjects.map(s => s.name).join(", ")
                    return (
                      <div key={combo.id} className="flex items-center gap-2 rounded-xl hover:bg-muted transition-colors group">
                        <Link href={`/combination/${combo.id}`} className="flex min-w-0 flex-1 items-center gap-3 p-3">
                          <div className="size-6 rounded bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-bold shrink-0">{idx + 1}</div>
                          <span className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors flex-1 min-w-0 truncate">
                            {title}
                          </span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300 shrink-0">{combo.matchScore}%</span>
                        </Link>
                        <BookmarkButton
                          item={{
                            id: combo.id,
                            type: "combination",
                            title,
                            subtitle: `${combo.track.name} · ${combo._count.Schools} schools`,
                            href: `/combination/${combo.id}`,
                          }}
                          className="mr-2"
                        />
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="flex flex-col p-6 rounded-2xl border-border shadow-sm">
                <h2 className="font-bold text-foreground mb-6">Top Matching Schools</h2>
                <div className="flex flex-col gap-3">
                  {results.schoolOptions.slice(0, 5).map((school) => (
                    <div key={`${school.name}-${school.county}`} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                      <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 shrink-0 flex items-center justify-center border border-border">
                        <HugeiconsIcon icon={Building03Icon} className="text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">{school.name}</span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {school.county}{school.category ? ` · ${school.category}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card border border-border rounded-2xl shadow-sm">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h3 className="font-bold text-foreground">Explore more matching schools</h3>
                <p className="text-sm text-muted-foreground">Find schools tailored to your selected subjects, tracks, and county preferences.</p>
              </div>
              <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shrink-0 w-full sm:w-auto">
                <Link href={exploreMoreSchoolsHref} className="flex items-center gap-2">
                  <HugeiconsIcon icon={Search01Icon} size={16} />
                  <span>Find More Schools</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>
              </Button>
            </div>

            <div className="flex justify-center mt-2">
              <ShareButton
                title="My CBC Pathway Recommendations"
                text="Check out my recommended CBC Senior School tracks, subject combinations, and schools on CBC Pathways!"
                url={shareHref}
                className="rounded-xl font-bold"
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function RecommendationResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 dark:border-blue-800/50 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading results…</p>
      </div>
    }>
      <RecommendationResultsInner />
    </Suspense>
  )
}
