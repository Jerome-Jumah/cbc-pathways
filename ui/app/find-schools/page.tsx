"use client"

import React, { useState, useMemo } from "react"
import { NavBar } from "@/components/nav-bar"
import { School, SchoolCard } from "@/components/school-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search02Icon, FilterIcon } from "@hugeicons/core-free-icons"

// --- Mock Data ---
const MOCK_SCHOOLS: School[] = [
  {
    id: "alliance-high",
    rank: 1,
    name: "Alliance High School",
    imageUrl: "https://images.unsplash.com/photo-1592284941320-f56f1406c117?q=80&w=600&auto=format&fit=crop",
    location: "Nairobi County",
    cluster: "C2 (Extra County)",
    gender: "Boys",
    accommodation: "Boarding",
    subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "Geography", "History", "CRE"],
    matchPercentage: 92,
  },
  {
    id: "lenana-school",
    rank: 2,
    name: "Lenana School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    location: "Nairobi County",
    cluster: "C1 (National)",
    gender: "Boys",
    accommodation: "Boarding",
    subjects: ["Biology", "Chemistry", "Physics", "Mathematics", "Computer Studies", "Business", "Geography", "French"],
    matchPercentage: 89,
  },
  {
    id: "st-marys-girls",
    rank: 3,
    name: "St. Mary's Girls Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    location: "Nairobi County",
    cluster: "C2 (Extra County)",
    gender: "Girls",
    accommodation: "Boarding",
    subjects: ["Biology", "Chemistry", "Mathematics", "Kiswahili", "Home Science", "Music"],
    matchPercentage: 86,
  },
  {
    id: "strathmore-school",
    rank: 4,
    name: "Strathmore School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop",
    location: "Nairobi County",
    cluster: "C1 (National)",
    gender: "Boys",
    accommodation: "Day",
    subjects: ["Economics", "Mathematics", "Business", "Kiswahili", "Physics", "French"],
    matchPercentage: 84,
  },
  {
    id: "starehe-boys",
    rank: 5,
    name: "Starehe Boys' Centre",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    location: "Nairobi County",
    cluster: "C3 (County)",
    gender: "Boys",
    accommodation: "Boarding",
    subjects: ["Physics", "Chemistry", "Mathematics", "Computer Studies", "Agriculture", "Aviation", "Woodwork"],
    matchPercentage: 81,
  },
]

export default function FindSchoolsPage() {
  const [searchCounty, setSearchCounty] = useState("")
  const [selectedCounties, setSelectedCounties] = useState<string[]>(["Nairobi"])
  const [selectedClusters, setSelectedClusters] = useState<string[]>(["c2"])
  const [selectedGenders, setSelectedGenders] = useState<string[]>(["Any"])
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>(["Any"])

  const filteredSchools = useMemo(() => {
    return MOCK_SCHOOLS.filter(school => {
      // County
      if (selectedCounties.length > 0) {
        const isCountyMatch = selectedCounties.some(c => school.location.toLowerCase().includes(c.toLowerCase()));
        if (!isCountyMatch) return false;
      }
      // Cluster
      if (selectedClusters.length > 0) {
        const isClusterMatch = selectedClusters.some(c => school.cluster.toLowerCase().startsWith(c.toLowerCase()));
        if (!isClusterMatch) return false;
      }
      // Gender
      if (!selectedGenders.includes("Any") && selectedGenders.length > 0) {
        if (!selectedGenders.includes(school.gender) && !selectedGenders.includes("Mixed")) return false;
      }
      // Accommodation
      if (!selectedAccommodations.includes("Any") && selectedAccommodations.length > 0) {
        if (!selectedAccommodations.includes(school.accommodation) && !selectedAccommodations.includes("Mixed")) return false;
      }
      
      return true;
    });
  }, [selectedCounties, selectedClusters, selectedGenders, selectedAccommodations]);

  const toggleFilter = (set: React.Dispatch<React.SetStateAction<string[]>>, item: string, isSingleSelectGroup: boolean = false) => {
    set(prev => {
      if (isSingleSelectGroup) {
        if (item === "Any") return ["Any"];
        const newSet = prev.includes(item) ? prev.filter(i => i !== item) : [...prev.filter(i => i !== "Any"), item];
        return newSet.length === 0 ? ["Any"] : newSet;
      } else {
         if (prev.includes(item)) {
           return prev.filter(i => i !== item);
         }
         return [...prev, item];
      }
    });
  }

  const renderFilters = () => (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
        <button 
          onClick={() => {
            setSearchCounty("");
            setSelectedCounties([]);
            setSelectedClusters([]);
            setSelectedGenders(["Any"]);
            setSelectedAccommodations(["Any"]);
          }}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      {/* County Filter */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-slate-900">County</h3>
        <div className="relative">
          <HugeiconsIcon icon={Search02Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input 
            placeholder="Search county..." 
            value={searchCounty}
            onChange={(e) => setSearchCounty(e.target.value)}
            className="pl-9 bg-white border-slate-200 h-10 rounded-xl" 
          />
        </div>
        <div className="flex flex-col gap-3 mt-1">
          {[
            { label: "Nairobi", count: "1,245" },
            { label: "Kiambu", count: "692" },
            { label: "Machakos", count: "623" },
            { label: "Mombasa", count: "512" },
            { label: "Kisumu", count: "488" },
          ].filter(c => c.label.toLowerCase().includes(searchCounty.toLowerCase())).map((item) => (
            <label key={item.label} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={selectedCounties.includes(item.label)}
                onCheckedChange={() => toggleFilter(setSelectedCounties, item.label)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]" 
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label} <span className="text-slate-400 font-normal">({item.count})</span>
              </span>
            </label>
          ))}
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 self-start mt-1">
          Show more
        </button>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      {/* Cluster Filter */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-900">Cluster</h3>
        <div className="flex flex-col gap-3">
          {[
            { id: "c1", label: "C1 (Top National)", color: "text-emerald-600" },
            { id: "c2", label: "C2 (Extra County)", color: "text-blue-600" },
            { id: "c3", label: "C3 (County)", color: "text-orange-500" },
            { id: "c4", label: "C4 (Sub County)", color: "text-rose-500" },
          ].map((item) => (
            <label key={item.id} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={selectedClusters.includes(item.id)}
                onCheckedChange={() => toggleFilter(setSelectedClusters, item.id)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]" 
              />
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-bold border rounded-full px-1.5 py-0.5", item.color, `border-${item.color.split("-")[1]}-200 bg-white`)}>
                  {item.id.toUpperCase()}
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
          {[
            { label: "Any" },
            { label: "Boys" },
            { label: "Girls" },
            { label: "Mixed" },
          ].map((item) => (
            <label key={item.label} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={selectedGenders.includes(item.label)}
                onCheckedChange={() => toggleFilter(setSelectedGenders, item.label, true)}
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
          {[
            { label: "Any" },
            { label: "Boarding" },
            { label: "Day" },
            { label: "Mixed" },
          ].map((item) => (
            <label key={item.label} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox 
                checked={selectedAccommodations.includes(item.label)}
                onCheckedChange={() => toggleFilter(setSelectedAccommodations, item.label, true)}
                className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-[6px]" 
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                {item.label}
              </span>
            </label>
          ))}
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
            <h1 className="text-base font-bold text-slate-900">Schools ({filteredSchools.length})</h1>
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 shadow-sm">
                  <HugeiconsIcon icon={FilterIcon} size={16} /> Filters
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="flex-1 overflow-y-auto p-6 pt-14">
                  <div className="flex flex-col gap-6">
                    {renderFilters()}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
            <h1 className="text-lg font-bold text-slate-900">Showing {filteredSchools.length} schools</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Sort by</span>
              <Select defaultValue="best-match">
                <SelectTrigger className="w-[140px] h-10 bg-slate-50 border-slate-200 rounded-xl font-semibold text-slate-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="best-match" className="font-medium">Best Match</SelectItem>
                  <SelectItem value="rank" className="font-medium">Rank</SelectItem>
                  <SelectItem value="name" className="font-medium">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* School List */}
          <div className="flex flex-col gap-4">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-center">
                <h3 className="text-lg font-bold text-slate-900">No schools found</h3>
                <p className="text-slate-500 text-sm mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>

          {/* Pagination Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-4 pt-2">
            <span className="text-sm font-medium text-slate-500">
              Showing 1 to 10 of 1,245 schools
            </span>
            
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg w-9 h-9 border-none">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-slate-600 hover:bg-slate-100 rounded-lg w-9 h-9 border-none">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-slate-600 hover:bg-slate-100 rounded-lg w-9 h-9 border-none">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis className="text-slate-400" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-slate-600 hover:bg-slate-100 rounded-lg w-9 h-9 border-none">125</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="text-slate-600 hover:bg-slate-100 rounded-lg h-9 border-none px-3 ml-2 shadow-sm border border-slate-200 bg-white" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Rows per page</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-[70px] h-9 bg-white border-slate-200 rounded-lg font-medium text-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg min-w-[70px]">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
