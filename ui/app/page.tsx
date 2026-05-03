"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { MultiSelect, Option } from "@/components/ui/multi-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { COUNTY_OPTIONS, SUBJECT_OPTIONS, CLUSTER_OPTIONS } from "@/constants/filter-options"
import { cn } from "@/lib/utils"
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Book01Icon,
  Book02Icon,
  Compass01Icon,
  FilterIcon,
  School01Icon,
  Search01Icon,
  Shield01Icon,
  StarIcon,
  Target01Icon,
  Tick02Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Map subjects from constants into MultiSelect Option format
const SUBJECT_OPTIONS_SELECT: Option[] = SUBJECT_OPTIONS.map((s) => ({
  label: s.label,
  value: s.value,
}))

export default function Home() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<string[]>([])
  const [county, setCounty] = useState<string>("")
  const [countyOpen, setCountyOpen] = useState(false)
  const [gender, setGender] = useState<string>("any")
  const [cluster, setCluster] = useState<string>("")
  const [countySearch, setCountySearch] = useState("")

  const filteredCounties = COUNTY_OPTIONS.filter((c) =>
    c.label.toLowerCase().includes(countySearch.toLowerCase())
  )

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (subjects.length > 0) params.set("subjects", subjects.join(","))
    if (county) params.set("county", county)
    if (gender && gender !== "any") params.set("gender", gender)
    if (cluster) params.set("cluster", cluster)
    router.push(`/find-schools?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col items-center">
      <NavBar />
      
      <main className="w-full max-w-7xl px-8 flex flex-col items-center pb-24">
        
        {/* Hero Section */}
        <section className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 pt-4 lg:pt-8 pb-0 lg:items-end">
          <div className="flex flex-col items-start z-10 pb-0 lg:pb-16">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/40 border-none px-4 py-1.5 text-xs lg:text-sm font-medium rounded-full mb-4 lg:mb-0">
              CBC Made Simple
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.15] lg:leading-[1.1] tracking-tight lg:mt-8">
              Find the <span className="text-blue-600 dark:text-blue-300">best</span> subject<br className="hidden lg:block" />
              combination and schools<br className="hidden lg:block" />
              <span className="text-blue-600 dark:text-blue-300"> for you</span>
            </h1>
            <p className="text-muted-foreground mt-4 lg:mt-6 text-base lg:text-lg max-w-[480px] leading-relaxed">
              Explore 500+ combinations and 10,000+ schools across Kenya aligned to the CBC pathway.
            </p>
            <div className="hidden lg:flex gap-4 mt-10">
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-7 text-base shadow-sm font-semibold"
              >
                <HugeiconsIcon icon={Search01Icon} size={20} className="mr-2 stroke-[2.5]" /> 
                Find Schools
              </Button>
              <Button
                variant="outline"
                className="px-8 py-7 text-base text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800/50 hover:bg-accent font-semibold shadow-sm"
                onClick={() => router.push("/recommendations")}
              >
                <HugeiconsIcon icon={Compass01Icon} size={20} className="mr-2 stroke-[2.5]" /> 
                Get Recommendations
              </Button>
            </div>
          </div>
          
          <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] flex items-end justify-center mt-2 lg:mt-0">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[500px] bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl -z-10"></div>
            
            {/* Main Illustration */}
            <div className="relative w-full max-w-[550px] h-full lg:translate-y-4">
              <Image 
                src="/hero-image.png" 
                alt="Students exploring options" 
                fill
                className="object-contain object-bottom lg:object-center"
                priority
              />
            </div>

            {/* Floating Badges */}
            <Card className="absolute top-4 lg:top-12 right-0 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-top-right">
              <div className="bg-blue-600 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white">
                <HugeiconsIcon icon={School01Icon} size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">10,000+</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">Schools</p>
              </div>
            </Card>

            <Card className="absolute bottom-6 lg:bottom-16 -right-2 lg:-right-4 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-bottom-right">
              <div className="bg-emerald-600 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white">
                <HugeiconsIcon icon={Book02Icon} size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">500+</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">Combinations</p>
              </div>
            </Card>

            <Card className="absolute top-1/2 -left-2 lg:-left-8 -translate-y-1/2 flex flex-row items-center gap-3 lg:gap-4 p-2 lg:p-3 pr-4 lg:pr-6 rounded-xl lg:rounded-2xl shadow-lg border-border/60 bg-card/90 backdrop-blur-sm whitespace-nowrap scale-75 lg:scale-100 origin-left">
              <div className="bg-indigo-50 dark:bg-indigo-950/300 p-2 lg:p-2.5 rounded-lg lg:rounded-xl text-white flex items-center justify-center">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-6 lg:h-6">
                    <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor"/>
                    <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-base lg:text-lg leading-tight text-foreground">7</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium">Tracks</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Search Bar Section */}
        <div className="w-full bg-card rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border p-4 mb-10 z-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_auto] gap-4 items-end">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground ml-1">Select Subjects</label>
              <MultiSelect
                options={SUBJECT_OPTIONS_SELECT}
                selected={subjects}
                onChange={setSubjects}
                placeholder="Search subjects..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground ml-1">County <span className="text-muted-foreground/80 font-normal">(Optional)</span></label>
              <Popover open={countyOpen} onOpenChange={setCountyOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countyOpen}
                    className="flex h-[46px] w-full items-center justify-between border border-border rounded-xl px-4 py-3 bg-card font-medium text-foreground hover:bg-card hover:border-border shadow-none text-sm"
                  >
                    {county
                      ? COUNTY_OPTIONS.find((c) => c.value === county)?.label
                      : <span className="text-muted-foreground/80 font-normal">Select county...</span>}
                    <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="text-muted-foreground/80 opacity-100" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search county..."
                      value={countySearch}
                      onValueChange={setCountySearch}
                    />
                    <CommandList>
                      <CommandEmpty>No county found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCounties.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(currentValue) => {
                              setCounty(currentValue === county ? "" : currentValue)
                              setCountyOpen(false)
                              setCountySearch("")
                            }}
                          >
                            <HugeiconsIcon
                              icon={Tick02Icon}
                              className={cn(
                                "mr-2 h-4 w-4",
                                county === c.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-semibold text-foreground ml-1">Gender <span className="text-muted-foreground/80 font-normal">(Optional)</span></label>
              <div className="relative w-full">
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full appearance-none flex items-center justify-between border border-border rounded-xl px-4 py-3 bg-card cursor-pointer hover:border-border text-foreground font-medium text-sm h-[46px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="any">Any</option>
                  <option value="BOYS">Boys School</option>
                  <option value="GIRLS">Girls School</option>
                  <option value="MIXED">Mixed School</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/80">
                  <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-semibold text-foreground ml-1">Cluster <span className="text-muted-foreground/80 font-normal">(Optional)</span></label>
              <div className="relative w-full">
                <select
                  value={cluster}
                  onChange={(e) => setCluster(e.target.value)}
                  className={cn(
                    "w-full appearance-none flex items-center justify-between border border-border rounded-xl px-4 py-3 bg-card cursor-pointer hover:border-border text-sm h-[46px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                    !cluster ? "text-muted-foreground/80 font-normal" : "text-foreground font-medium"
                  )}
                >
                  <option value="">Any cluster</option>
                  {CLUSTER_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/80">
                  <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
                </div>
              </div>
            </div>

            <Button
              id="home-search-btn"
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-[46px] shadow-sm font-semibold w-full md:w-auto"
            >
              <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" /> Find Schools
            </Button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card
            onClick={() => router.push("/explore-tracks")}
            className="p-6 rounded-2xl flex flex-row items-center justify-between hover:shadow-md transition-shadow border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 cursor-pointer"
          >
            <div className="flex flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <HugeiconsIcon icon={Book01Icon} size={32}/>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-1">Explore Tracks</h3>
                <p className="text-sm text-muted-foreground leading-snug">Discover 7 CBC tracks and<br />500+ subject combinations</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted shrink-0 shadow-sm ml-4">
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </div>
          </Card>

          <Card
            onClick={() => router.push("/recommendations")}
            className="p-6 rounded-2xl flex flex-row items-center justify-between hover:shadow-md transition-shadow border-orange-100 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/30 cursor-pointer"
          >
            <div className="flex flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-400 flex items-center justify-center text-white shadow-sm shrink-0">
                <HugeiconsIcon icon={StarIcon} size={32} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-foreground mb-1">Get Recommendations</h3>
                <p className="text-sm text-muted-foreground leading-snug">Answer a few questions and<br />get personalized suggestions</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-muted shrink-0 shadow-sm ml-4">
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </div>
          </Card>
        </div>

        {/* Features Bottom Section */}
        <Card className="w-full p-8 rounded-2xl shadow-sm border-border bg-card">
          <h2 className="text-xl font-bold text-foreground mb-8">Everything you need. All in one place.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={Target01Icon} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-1.5">Smart Matching</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">AI-powered matching for the best schools and combinations</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={Shield01Icon} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-1.5">Trusted Data</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Accurate information on schools, subjects and pathways</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
                <HugeiconsIcon icon={ArrowUp01Icon} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-1.5">Career Pathways</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">See what your subjects can lead you to</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 shadow-sm flex items-center justify-center dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-300">
                <HugeiconsIcon icon={FilterIcon} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm mb-1.5">Filters that Matter</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Filter by county, cluster, gender and accommodation</p>
              </div>
            </div>

          </div>
        </Card>

      </main>
    </div>
  );
}
