"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  ArrowUpRight01Icon,
  Atom01Icon,
  Book01Icon,
  Bookmark02Icon,
  Clock01Icon,
  FavouriteIcon,
  GlobalIcon,
  HelpCircleIcon,
  Home01Icon,
  Menu01Icon,
  Layers01Icon, Mortarboard01Icon,
  Plant01Icon,
  RouteIcon,
  Search01Icon,
  StarIcon,
  TestTube01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"

const MOCK_COMBINATIONS_LIST = [
  {
    id: "1",
    name: "Biology, Chemistry, Physics",
    badge: "Most Popular",
    difficulty: "Challenging",
    difficultyColor: "bg-emerald-500",
    assessment: "Theory + Practical",
    universityFit: "High",
    universityFitColor: "bg-emerald-500"
  },
  {
    id: "2",
    name: "Biology, Chemistry, Mathematics",
    difficulty: "Challenging",
    difficultyColor: "bg-emerald-500",
    assessment: "Theory + Practical",
    universityFit: "High",
    universityFitColor: "bg-emerald-500"
  },
  {
    id: "3",
    name: "Physics, Mathematics, Chemistry",
    difficulty: "Difficult",
    difficultyColor: "bg-orange-500",
    assessment: "Theory + Practical",
    universityFit: "High",
    universityFitColor: "bg-emerald-500"
  },
  {
    id: "4",
    name: "Biology, Chemistry, Agriculture",
    difficulty: "Moderate",
    difficultyColor: "bg-emerald-500",
    assessment: "Theory + Practical",
    universityFit: "Good",
    universityFitColor: "bg-emerald-500"
  },
  {
    id: "5",
    name: "Chemistry, Mathematics, Computer Studies",
    difficulty: "Difficult",
    difficultyColor: "bg-orange-500",
    assessment: "Theory",
    universityFit: "Good",
    universityFitColor: "bg-emerald-500"
  },
  {
    id: "6",
    name: "Biology, Physics, Mathematics",
    difficulty: "Challenging",
    difficultyColor: "bg-emerald-500",
    assessment: "Theory + Practical",
    universityFit: "High",
    universityFitColor: "bg-emerald-500"
  }
];

const MENU_ITEMS = [
  { label: "Overview", icon: Home01Icon, active: false },
  { label: "All Combinations", icon: Book01Icon, active: true },
  { label: "Subjects in this Track", icon: TestTube01Icon, active: false },
  { label: "Career Pathways", icon: RouteIcon, active: false },
  { label: "Related Tracks", icon: Layers01Icon, active: false },
  { label: "Saved", icon: FavouriteIcon, active: false },
];

const PATHWAYS = [
  { name: "Medical Doctor", icon: Plant01Icon, color: "text-emerald-600" },
  { name: "Pharmacist", icon: TestTube01Icon, color: "text-purple-600" },
  { name: "Biomedical Scientist", icon: Atom01Icon, color: "text-emerald-600" },
  { name: "Environmental Scientist", icon: Plant01Icon, color: "text-emerald-600" },
  { name: "Chemical Engineer", icon: TestTube01Icon, color: "text-purple-600" },
  { name: "Lab Technician", icon: TestTube01Icon, color: "text-emerald-600" }
];

export default function TrackCombinationsPage({ params }: { params: { id: string } }) {
  
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col items-center pb-20">
      <NavBar />
      
      <main className="w-full max-w-[1400px] px-4 md:px-6 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-24">
        
        {/* LEFT COLUMN - Housed in a Card */}
        <Card className="hidden lg:flex lg:col-span-3 flex-col p-6 rounded-xl shadow-sm border-slate-200 bg-white h-fit gap-8">
          
          <div className="flex flex-col gap-4">
            <Link href="/explore-tracks" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to Tracks
            </Link>
            
            {/* Track Profile */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-slate-100">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                 <HugeiconsIcon icon={TestTube01Icon} size={40} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Pure Sciences</h2>
              <span className="text-sm font-bold text-blue-600">120+ combinations</span>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col gap-1">
              {MENU_ITEMS.map((item, idx) => (
                <button 
                  key={idx}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left leading-snug",
                    item.active 
                      ? "bg-slate-100/80 text-blue-600" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={20} className={item.active ? "text-blue-600" : "text-slate-400"} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Help Box */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
             <h4 className="font-bold text-slate-900">Need help deciding?</h4>
             <p className="text-sm font-medium text-slate-500 mb-2 leading-relaxed">
               Get personalized recommendations based on your interests.
             </p>
             <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold rounded-xl">
               Get Recommendations
             </Button>
          </div>

        </Card>

        {/* CENTER COLUMN - Housed in a Card */}
        <Card className="lg:col-span-6 flex flex-col p-6 sm:p-8 rounded-xl shadow-sm border-slate-200 bg-white h-fit">
          
          {/* Mobile Sidebar Triggers */}
          <div className="flex lg:hidden w-full items-center justify-between mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <HugeiconsIcon icon={Menu01Icon} size={16} />
                  Categories
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                <SheetTitle className="sr-only">Categories</SheetTitle>
                <div className="flex-1 overflow-y-auto p-6 pt-12">
                  <div className="flex flex-col gap-4">
                    <Link href="/explore-tracks" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to Tracks
                    </Link>
                    <div className="flex flex-col gap-1">
                      {MENU_ITEMS.map((item, idx) => (
                        <button 
                          key={idx}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left leading-snug",
                            item.active 
                              ? "bg-slate-100/80 text-blue-600" 
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          )}
                        >
                          <HugeiconsIcon icon={item.icon} size={20} className={item.active ? "text-blue-600" : "text-slate-400"} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Pathways
                  <HugeiconsIcon icon={Menu01Icon} size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 flex flex-col">
                <SheetTitle className="sr-only">Pathways</SheetTitle>
                <div className="flex-1 overflow-y-auto p-6 pt-12">
                  <div className="flex flex-col">
                    <div className="flex flex-col mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Leading to Pathways</h3>
                      <p className="text-sm text-slate-500 font-medium">Careers under Pure Sciences</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {PATHWAYS.map((pathway, idx) => (
                        <button key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 group transition-colors text-left">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                            <HugeiconsIcon icon={pathway.icon} size={20} className={pathway.color} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{pathway.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Hero Banner - Border radius reduced to xl */}
          <div className="relative overflow-hidden w-full rounded-xl border border-blue-100 bg-[#f8fbff] p-8 mb-8">
             <div className="absolute top-0 right-0 w-full h-full opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                <div className="flex flex-col max-w-md">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                         <HugeiconsIcon icon={TestTube01Icon} size={14} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Pure Sciences Track</span>
                   </div>
                   <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Subject Combinations</h1>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">
                     Explore subject combinations under Pure Sciences and discover the right path for your interests and future goals.
                   </p>
                </div>
                
                {/* Placeholder for 3D Microscope */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                   <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 rounded-full blur-2xl opacity-60"></div>
                   <Image src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400&auto=format&fit=crop" fill alt="Microscope" className="relative z-10 drop-shadow-xl rounded-full object-cover border-4 border-white" />
                </div>
             </div>
          </div>
          
          {/* Stats Row - Consolidated into a single bordered box */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-slate-100 rounded-xl mb-8 divide-x divide-y md:divide-y-0 divide-slate-100 overflow-hidden bg-slate-50/30">
             <div className="flex flex-col p-4 text-center items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                   <HugeiconsIcon icon={Book01Icon} size={20} className="text-blue-600" />
                </div>
                <span className="text-[15px] font-bold text-slate-900">120+</span>
                <span className="text-[11px] font-medium text-slate-500">Combinations</span>
             </div>

             <div className="flex flex-col p-4 text-center items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                   <HugeiconsIcon icon={Mortarboard01Icon} size={20} className="text-emerald-600" />
                </div>
                <span className="text-[15px] font-bold text-slate-900">High</span>
                <span className="text-[11px] font-medium text-slate-500">University Fit</span>
             </div>

             <div className="flex flex-col p-4 text-center items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                   <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} className="text-purple-600" />
                </div>
                <span className="text-[15px] font-bold text-slate-900">Strong</span>
                <span className="text-[11px] font-medium text-slate-500">Career Prospects</span>
             </div>

             <div className="flex flex-col p-4 text-center items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                   <HugeiconsIcon icon={Clock01Icon} size={20} className="text-orange-500" />
                </div>
                <span className="text-[15px] font-bold text-slate-900">Future Ready</span>
                <span className="text-[11px] font-medium text-slate-500">In-Demand Skills</span>
             </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
             <div className="relative flex-1 w-full">
               <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <Input placeholder="Search combinations" className="w-full h-11 pl-11 rounded-xl border-slate-200 bg-white text-sm font-medium focus-visible:ring-blue-600" />
             </div>
             
             <Select defaultValue="all-diff">
               <SelectTrigger className="w-full md:w-[160px] h-11 rounded-xl bg-white border-slate-200 text-sm font-medium text-slate-600">
                 <SelectValue placeholder="All Difficulties" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                 <SelectItem value="all-diff">All Difficulties</SelectItem>
                 <SelectItem value="moderate">Moderate</SelectItem>
                 <SelectItem value="challenging">Challenging</SelectItem>
                 <SelectItem value="difficult">Difficult</SelectItem>
               </SelectContent>
             </Select>

             <Select defaultValue="all-assess">
               <SelectTrigger className="w-full md:w-[170px] h-11 rounded-xl bg-white border-slate-200 text-sm font-medium text-slate-600">
                 <SelectValue placeholder="All Assessments" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                 <SelectItem value="all-assess">All Assessments</SelectItem>
                 <SelectItem value="theory">Theory</SelectItem>
                 <SelectItem value="practical">Theory + Practical</SelectItem>
               </SelectContent>
             </Select>

             <Select defaultValue="recommended">
               <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-white border-slate-200 text-sm font-medium text-slate-600">
                 <SelectValue placeholder="Sort: Recommended" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                 <SelectItem value="recommended">Sort: Recommended</SelectItem>
                 <SelectItem value="popular">Most Popular</SelectItem>
                 <SelectItem value="az">A-Z</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <span className="text-xs font-semibold text-slate-400 mb-4 px-2">Showing 18 combinations</span>

          {/* Combinations List */}
          <div className="flex flex-col gap-3 mb-6">
             {MOCK_COMBINATIONS_LIST.map((combo) => (
               <div key={combo.id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors gap-4">
                 
                 <div className="flex items-start xl:items-center gap-4 w-full xl:w-auto xl:flex-[1.5] min-w-0">
                   <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                     {combo.id}
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="text-[14px] font-bold text-slate-900 mb-1 leading-snug truncate">{combo.name}</span>
                     {combo.badge && (
                       <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold w-fit px-2 py-0 shrink-0">
                         <HugeiconsIcon icon={StarIcon} size={10} className="mr-1 fill-current" /> {combo.badge}
                       </Badge>
                     )}
                   </div>
                 </div>

                 <div className="flex items-center gap-4 xl:gap-6 w-full xl:w-auto xl:flex-[2] xl:justify-center min-w-0">
                   <div className="flex flex-col min-w-0 flex-1 xl:flex-auto">
                     <span className="text-[10px] font-medium text-slate-400 mb-1">Difficulty</span>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 truncate">
                       <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", combo.difficultyColor)}></div>
                       <span className="truncate">{combo.difficulty}</span>
                     </div>
                   </div>

                   <div className="flex flex-col min-w-0 flex-1 xl:flex-auto">
                     <span className="text-[10px] font-medium text-slate-400 mb-1">Assessment</span>
                     <span className="text-xs font-bold text-slate-700 truncate">{combo.assessment}</span>
                   </div>

                   <div className="flex flex-col min-w-0 flex-1 xl:flex-auto">
                     <span className="text-[10px] font-medium text-slate-400 mb-1">University Fit</span>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 truncate">
                       <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", combo.universityFitColor)}></div>
                       <span className="truncate">{combo.universityFit}</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 w-full xl:w-auto justify-end shrink-0 pt-2 xl:pt-0 border-t xl:border-none border-slate-100">
                   <Link href={`/combination/${combo.id}`}>
                     <Button variant="outline" className="h-9 px-4 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-xs font-bold bg-white">
                       View Details <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1.5" />
                     </Button>
                   </Link>
                   <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 shrink-0">
                     <HugeiconsIcon icon={Bookmark02Icon} size={18} />
                   </Button>
                 </div>

               </div>
             ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-2">
            <Button variant="outline" className="bg-white border-slate-200 text-blue-600 hover:bg-slate-50 hover:text-blue-700 text-xs font-bold h-10 px-6 rounded-xl">
               Load more combinations <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-2 rotate-90" />
            </Button>
          </div>

        </Card>

        {/* RIGHT COLUMN - Housed in a Card with Separators */}
        <Card className="hidden lg:flex lg:col-span-3 flex-col p-6 rounded-xl shadow-sm border-slate-200 bg-white h-fit gap-6">
          
          {/* About Track */}
          <div className="flex flex-col">
             <h3 className="font-bold text-slate-900 mb-3">About Pure Sciences</h3>
             <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
               The Pure Sciences track provides a strong foundation in scientific principles and analytical thinking. It is ideal for learners passionate about research, innovation and solving real-world problems.
             </p>
             <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <HugeiconsIcon icon={Search01Icon} size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Focus on research and discovery</span>
                </div>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon icon={Atom01Icon} size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Strong foundation for STEM careers</span>
                </div>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon icon={GlobalIcon} size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">Opens doors to global opportunities</span>
                </div>
             </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Top Career Pathways */}
          <div className="flex flex-col">
             <h3 className="font-bold text-slate-900 mb-5">Top Career Pathways</h3>
             <div className="flex flex-col gap-4">
               {PATHWAYS.map((path, idx) => (
                 <div key={idx} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-3">
                     <HugeiconsIcon icon={path.icon} size={18} className={path.color} />
                     <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{path.name}</span>
                   </div>
                   <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                 </div>
               ))}
             </div>
             <Button variant="link" className="mt-4 text-blue-600 font-bold h-auto p-0 hover:no-underline hover:text-blue-700 text-sm justify-start w-fit">
               View all pathways <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
             </Button>
          </div>

          <Separator className="bg-slate-100" />

          {/* Help Call to Action */}
          <div className="flex flex-col p-5 rounded-xl border-none bg-[#f8f9fc] items-center text-center">
             <div className="w-12 h-12 rounded-full bg-white text-blue-600 shadow-sm flex items-center justify-center mb-4">
               <HugeiconsIcon icon={HelpCircleIcon} size={24} />
             </div>
             <h4 className="font-bold text-slate-900 mb-2">Not sure which combination?</h4>
             <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed px-2">
               Get personalized recommendations based on your interests and goals.
             </p>
             <Link href="/recommendations" className="w-full">
               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm h-11">
                 Get Recommendations <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
               </Button>
             </Link>
          </div>

        </Card>

      </main>
    </div>
  )
}
