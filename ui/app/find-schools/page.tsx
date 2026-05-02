"use client"

import { NavBar } from "@/components/nav-bar"
import { SchoolCard } from "@/components/school-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ACCOMMODATION_OPTIONS,
  CLUSTER_OPTIONS,
  COUNTY_OPTIONS,
  GENDER_OPTIONS,
  getClusterLabel,
} from "@/constants/filter-options"
import { ApiError, apiGet, buildQuery } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { School, SchoolsListResponse } from "@/types/api"
import { FilterIcon, RefreshIcon, Search02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react"

const LIMIT = 20

// ─── School Card adapter ──────────────────────────────────────────────────────
// The SchoolCard component expects its own School type; adapt backend School

function adaptSchool(s: School, index: number) {
  const clusterLabel = s.cluster ? getClusterLabel(s.cluster) : "Unknown"
  const clusterValue = s.cluster ?? "Unknown"
  const subjects = [...new Set(
    s.Combinations.flatMap((c) => [] as string[]) // subjects come from combination profile
  )]

  return {
    id: s.id,
    rank: index + 1,
    name: s.name,
    imageUrl: undefined,
    location: s.county,
    cluster: clusterValue ? `${clusterValue} (${clusterLabel})` : "",
    gender: s.gender ?? "Unknown",
    accommodation: s.accommodationType ?? "Unknown",
    subjects,
    matchPercentage: undefined,
  }
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────

function FindSchoolsInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── Parse initial filters from URL ──
  const initialCounties = searchParams.get("county")
    ? [searchParams.get("county") as string]
    : []
  const initialSubjects = searchParams.get("subjects")
    ? searchParams.get("subjects")!.split(",")
    : []
  const initialCluster = searchParams.get("cluster") ?? ""
  const initialGender = searchParams.get("gender") ?? ""

  // ── Filter state ──
  const [searchCounty, setSearchCounty] = useState("")
  const [selectedCounties, setSelectedCounties] = useState<string[]>(initialCounties)
  const [selectedClusters, setSelectedClusters] = useState<string[]>(
    initialCluster ? [initialCluster] : []
  )
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    initialGender ? [initialGender] : ["Any"]
  )
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(["Any"])
  const [sortBy, setSortBy] = useState("name")

  // ── Pagination & data ──
  const [schools, setSchools] = useState<School[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Refs to avoid double-fetch on mount ──
  const isMounted = useRef(false)

  // ── Sync filters to URL ──
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (selectedCounties[0]) params.set("county", selectedCounties[0])
    if (selectedClusters[0]) params.set("cluster", selectedClusters[0])
    const gender = selectedGenders.find((g) => g !== "Any")
    if (gender) params.set("gender", gender)
    const qs = params.toString()
    router.replace(qs ? `/find-schools?${qs}` : "/find-schools", { scroll: false })
  }, [router, selectedCounties, selectedClusters, selectedGenders])

  // ── Build API query ──
  const buildApiQuery = useCallback(
    (p: number) => {
      const gender = selectedGenders.find((g) => g !== "Any") ?? undefined
      const accommodation = selectedAccommodations.find((a) => a !== "Any") ?? undefined
      const county = selectedCounties[0] ?? undefined
      const cluster = selectedClusters[0] ?? undefined

      return buildQuery({
        page: p,
        limit: LIMIT,
        county,
        gender,
        accommodation,
        category: cluster,
      })
    },
    [selectedCounties, selectedClusters, selectedGenders, selectedAccommodations]
  )

  // ── Fetch schools ──
  const fetchSchools = useCallback(
    async (p: number, append = false) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(null)

      try {
        const qs = buildApiQuery(p)
        const res = await apiGet<SchoolsListResponse>(`/schools${qs}`)
        const incoming = res.data.data
        setTotal(res.data.meta.total)
        setTotalPages(res.data.meta.totalPages)
        setPage(p)
        setSchools((prev) => (append ? [...prev, ...incoming] : incoming))
      } catch (err) {
        const msg =
          err instanceof ApiError ? err.message : "Failed to load schools. Please try again."
        setError(msg)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [buildApiQuery]
  )

  // ── Initial load + filter change ──
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    }
    queueMicrotask(() => {
      void fetchSchools(1)
    })
    syncUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCounties, selectedClusters, selectedGenders, selectedAccommodations])

  // ── Toggle helper ──
  const toggleFilter = (
    set: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    isSingleSelectGroup = false
  ) => {
    set((prev) => {
      if (isSingleSelectGroup) {
        if (item === "Any") return ["Any"]
        const newSet = prev.includes(item)
          ? prev.filter((i) => i !== item)
          : [...prev.filter((i) => i !== "Any"), item]
        return newSet.length === 0 ? ["Any"] : newSet
      } else {
        if (prev.includes(item)) return prev.filter((i) => i !== item)
        return [...prev, item]
      }
    })
  }

  const clearAll = () => {
    setSearchCounty("")
    setSelectedCounties([])
    setSelectedClusters([])
    setSelectedGenders(["Any"])
    setSelectedAccommodations(["Any"])
  }

  const filteredCountyOptions = COUNTY_OPTIONS.filter((c) =>
    c.label.toLowerCase().includes(searchCounty.toLowerCase())
  )

  // ── Render filters ──
  const renderFilters = () => (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        <button
          onClick={clearAll}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      {/* County Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-slate-900">County</h3>
        <div className="relative">
          <HugeiconsIcon
            icon={Search02Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="Search county..."
            value={searchCounty}
            onChange={(e) => setSearchCounty(e.target.value)}
            className="pl-9 bg-white border-slate-200 h-10 rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-3 mt-1 max-h-48 overflow-y-auto pr-1">
          {filteredCountyOptions.map((item) => (
            <label key={item.value} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={selectedCounties.includes(item.value)}
                onCheckedChange={() => toggleFilter(setSelectedCounties, item.value)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* Cluster Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Cluster</h3>
        <div className="flex flex-col gap-3">
          {CLUSTER_OPTIONS.map((item) => (
            <label key={item.value} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={selectedClusters.includes(item.value)}
                onCheckedChange={() => toggleFilter(setSelectedClusters, item.value)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]"
              />
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-bold border rounded-full px-1.5 py-0.5",
                    item.color,
                    item.border,
                    item.bg
                  )}
                >
                  {item.value}
                </span>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* Gender Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Gender</h3>
        <div className="flex flex-col gap-3">
          {[{ value: "Any", label: "Any" }, ...GENDER_OPTIONS.map((g) => ({ value: g.value, label: g.label }))].map((item) => (
            <label key={item.value} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={selectedGenders.includes(item.value)}
                onCheckedChange={() => toggleFilter(setSelectedGenders, item.value, true)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]"
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* Accommodation Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Accommodation</h3>
        <div className="flex flex-col gap-3">
          {[{ value: "Any", label: "Any" }, ...ACCOMMODATION_OPTIONS.map((a) => ({ value: a.value, label: a.label }))].map(
            (item) => (
              <label
                key={item.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <Checkbox
                  checked={selectedAccommodations.includes(item.value)}
                  onCheckedChange={() =>
                    toggleFilter(setSelectedAccommodations, item.value, true)
                  }
                  className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]"
                />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </label>
            )
          )}
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#f8fafe] font-sans flex flex-col items-center pb-20">
      <NavBar />

      <main className="w-full max-w-[1400px] px-4 md:px-6 py-4 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 pb-24">

        {/* Left Sidebar - Filters (Desktop) */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
          {renderFilters()}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">

          {/* Mobile Filters Trigger */}
          <div className="flex lg:hidden w-full items-center justify-between">
            <h1 className="text-base font-bold text-slate-900">
              Schools {!loading && `(${total})`}
            </h1>
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 shadow-sm">
                  <HugeiconsIcon icon={FilterIcon} size={16} /> Filters
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="flex-1 overflow-y-auto p-6 pt-14">
                  <div className="flex flex-col gap-6">{renderFilters()}</div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
            <h1 className="text-lg font-bold text-slate-900">
              {loading
                ? "Loading schools…"
                : `Showing ${schools.length} of ${total} schools`}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="name" className="font-medium">Name (A-Z)</SelectItem>
                  <SelectItem value="county" className="font-medium">County</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-slate-500">Loading schools…</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-2xl border border-red-100 text-center">
              <p className="text-base font-bold text-red-700 mb-2">Something went wrong</p>
              <p className="text-sm text-red-500 mb-6">{error}</p>
              <Button
                onClick={() => fetchSchools(1)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-6 font-semibold"
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} className="mr-2" /> Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && schools.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-center">
              <h3 className="text-lg font-bold text-slate-900">No schools found</h3>
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
              <Button
                onClick={clearAll}
                variant="outline"
                className="mt-4 rounded-xl font-semibold border-slate-200"
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* School List */}
          {!loading && !error && schools.length > 0 && (
            <>
              <div className="flex flex-col gap-4">
                {schools.map((school, idx) => (
                  <SchoolCard key={school.id} school={adaptSchool(school, idx)} />
                ))}
              </div>

              {/* Load More */}
              {page < totalPages && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    disabled={loadingMore}
                    onClick={() => fetchSchools(page + 1, true)}
                    className="border-slate-200 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl h-11 px-8"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-2" />
                        Loading…
                      </>
                    ) : (
                      `Load more schools (${total - schools.length} remaining)`
                    )}
                  </Button>
                </div>
              )}

              <p className="text-sm text-center text-slate-400 font-medium mt-2">
                Showing {schools.length} of {total} schools
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Exported page (Suspense boundary for useSearchParams) ────────────────────

export default function FindSchoolsPage() {
  return (
    <Suspense>
      <FindSchoolsInner />
    </Suspense>
  )
}
