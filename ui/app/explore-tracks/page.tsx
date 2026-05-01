"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowRight01Icon,
  Book01Icon,
  Building03Icon,
  Chart03Icon,
  InformationCircleIcon,
  PaintBoardIcon,
  Plant01Icon,
  RouteIcon,
  Settings01Icon,
  TestTube01Icon,
  UserGroupIcon,
  Wrench01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"

const TRACKS_DATA = [
  {
    id: 1,
    title: "Pure Sciences",
    combinationsCount: "120+",
    description: "For learners passionate about scientific research and innovation.",
    color: "bg-[#f2f8fc] border-blue-100", // Soft blue tint
    iconBg: "bg-blue-100/50",
    iconColor: "text-blue-600",
    textColor: "text-blue-600",
    icon: TestTube01Icon,
  },
  {
    id: 2,
    title: "Engineering & Technology",
    combinationsCount: "85+",
    description: "For future engineers, innovators and problem solvers.",
    color: "bg-[#f4fbf5] border-emerald-100", // Soft green tint
    iconBg: "bg-emerald-100/50",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-600",
    icon: Settings01Icon,
  },
  {
    id: 3,
    title: "Business Studies",
    combinationsCount: "90+",
    description: "For aspiring entrepreneurs and business leaders.",
    color: "bg-[#fbf4fc] border-purple-100", // Soft purple tint
    iconBg: "bg-purple-100/50",
    iconColor: "text-purple-600",
    textColor: "text-purple-600",
    icon: Chart03Icon,
  },
  {
    id: 4,
    title: "Arts & Sports",
    combinationsCount: "60+",
    description: "For creative minds and talented performers.",
    color: "bg-[#fcf4f4] border-rose-100", // Soft rose/pink tint
    iconBg: "bg-rose-100/50",
    iconColor: "text-rose-600",
    textColor: "text-rose-600",
    icon: PaintBoardIcon,
  },
  {
    id: 5,
    title: "Social Sciences",
    combinationsCount: "70+",
    description: "For social leaders and change makers.",
    color: "bg-[#fcf6f0] border-orange-100", // Soft orange tint
    iconBg: "bg-orange-100/50",
    iconColor: "text-orange-600",
    textColor: "text-orange-600",
    icon: UserGroupIcon,
  },
  {
    id: 6,
    title: "Technical Studies",
    combinationsCount: "55+",
    description: "For hands-on learners who build and create.",
    color: "bg-[#f0f9f9] border-teal-100", // Soft teal tint
    iconBg: "bg-teal-100/50",
    iconColor: "text-teal-600",
    textColor: "text-teal-600",
    icon: Wrench01Icon,
  },
  {
    id: 7,
    title: "Agriculture & Natural Resources",
    combinationsCount: "40+",
    description: "For nurturing and sustaining our environment.",
    color: "bg-[#f5fbf0] border-lime-100", // Soft olive/lime tint
    iconBg: "bg-lime-100/50",
    iconColor: "text-lime-600",
    textColor: "text-lime-600",
    icon: Plant01Icon,
  }
]

export default function ExploreTracksPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col items-center">
      <NavBar />
      
      <main className="w-full max-w-[1400px] px-6 py-8 flex flex-col gap-12 mt-4">
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row justify-between items-center gap-12 relative">
          
          {/* Left Text */}
          <div className="flex flex-col gap-6 max-w-xl z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold shadow-sm">
                3
              </span>
              <span className="text-sm font-bold text-slate-500 tracking-wider">
                EXPLORE TRACKS PAGE
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-tight tracking-tight">
              Explore CBC Tracks
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Discover 7 CBC tracks and 500+ subject combinations designed to shape your future.
            </p>
          </div>

          {/* Right Image Placeholder */}
          <div className="relative w-full lg:w-[480px] h-[280px] shrink-0">
             {/* Using a placeholder for the 3D graduation cap illustration */}
             <div className="absolute top-0 right-0 w-full h-full bg-blue-50/50 rounded-[3rem] -z-10 blur-3xl opacity-50"></div>
             <Image 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop"
                alt="Education illustration placeholder"
                fill
                className="object-cover rounded-3xl shadow-sm mix-blend-multiply opacity-90"
             />
          </div>

        </section>

        {/* Stats Bar */}
        <Card className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mt-4 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-8 md:gap-0">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-5 md:px-8 first:pl-0">
               <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={RouteIcon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">7 Tracks</span>
                 <span className="text-sm text-slate-500 font-medium">Career pathways</span>
               </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-5 md:px-8">
               <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={Book01Icon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">500+ Combinations</span>
                 <span className="text-sm text-slate-500 font-medium">Subject combinations</span>
               </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-5 md:px-8 last:pr-0">
               <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                 <HugeiconsIcon icon={Building03Icon} size={28} />
               </div>
               <div className="flex flex-col gap-0.5">
                 <span className="text-xl font-extrabold text-slate-900">10,000+ Schools</span>
                 <span className="text-sm text-slate-500 font-medium">Across Kenya</span>
               </div>
            </div>

          </div>
        </Card>

        {/* Tracks Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          
          {TRACKS_DATA.map((track) => (
            <div 
              key={track.id}
              className={cn(
                "relative flex flex-col p-6 rounded-2xl border transition-transform hover:-translate-y-1 hover:shadow-sm cursor-pointer h-full",
                track.color
              )}
            >
              {/* Top Left Number Badge */}
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px] font-bold shadow-sm text-slate-600 mb-6">
                {track.id}
              </div>

              {/* Main Content (Row) */}
              <div className="flex flex-col xl:flex-row gap-5 mb-8 flex-1">
                 {/* Icon */}
                 <div className={cn("w-20 h-20 shrink-0 rounded-full flex items-center justify-center shadow-sm", track.iconBg, track.iconColor)}>
                    <HugeiconsIcon icon={track.icon} size={40} />
                 </div>
                 
                 {/* Text Content */}
                 <div className="flex flex-col">
                   <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{track.title}</h3>
                   <span className={cn("text-xs font-bold mb-3", track.textColor)}>
                     {track.combinationsCount} combinations
                   </span>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">
                     {track.description}
                   </p>
                 </div>
              </div>

              {/* Action Link */}
              <Link 
                href={`/explore-tracks/${track.id}`}
                className={cn("flex items-center text-sm font-bold transition-opacity hover:opacity-80 mt-auto", track.textColor)}
              >
                Explore combinations
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
              </Link>
            </div>
          ))}

          {/* Call To Action Card */}
          <div className="flex flex-col p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 h-full">
             <div className="flex items-center gap-4 mt-6">
               <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={InformationCircleIcon} size={28} className="text-blue-600" />
               </div>
               <div className="flex flex-col">
                 <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">Not sure where to start?</h3>
               </div>
             </div>
             
             <p className="text-sm text-slate-600 font-medium leading-relaxed mt-4 mb-6">
               Get personalized recommendations based on your interests and favorite subjects.
             </p>

             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-bold shadow-sm mt-auto">
               Get Recommendations
               <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
             </Button>
          </div>

        </section>

      </main>
    </div>
  )
}
