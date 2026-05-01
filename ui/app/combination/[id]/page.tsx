"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowLeft01Icon, ArrowRight01Icon,
  ArrowUpRight01Icon,
  Atom01Icon,
  Book01Icon, Building03Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  FavouriteIcon,
  Home01Icon,
  Idea01Icon,
  InformationCircleIcon,
  Layers01Icon,
  Location01Icon,
  Mortarboard01Icon,
  Plant01Icon,
  RouteIcon,
  Task01Icon,
  TestTube01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const MOCK_COMBINATION = {
  id: "1",
  title: "Biology, Chemistry, Physics",
  track: "Pure Sciences Track",
  description: "A powerful combination for students passionate about the natural sciences. Opens doors to diverse career paths in medicine, research, engineering, and environmental sciences.",
  stats: [
    { label: "120+ Schools offer this combination", icon: Clock01Icon, color: "text-slate-500" }, // Using a generic icon for schools count if needed, or maybe Information
    { label: "High Demand", icon: ArrowUpRight01Icon, color: "text-emerald-600" },
    { label: "Strong Career Prospects", icon: Idea01Icon, color: "text-purple-600" }
  ],
  about: "This combination develops strong analytical and problem-solving skills through the study of living organisms, chemical processes, and physical principles. Ideal for students who enjoy experiments, research, and discovery.",
  cards: [
    { 
      title: "Best For", 
      desc: "Students interested in sciences, research, and problem solving", 
      icon: Book01Icon, 
      color: "text-blue-600", 
      bg: "bg-blue-50/50",
      border: "border-blue-100" 
    },
    { 
      title: "Difficulty Level", 
      desc: "High", 
      badge: "Challenging",
      icon: Mortarboard01Icon, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50/50",
      border: "border-emerald-100"
    },
    { 
      title: "Universities", 
      desc: "All major universities accept this combination", 
      icon: Building03Icon, 
      color: "text-purple-600", 
      bg: "bg-purple-50/50",
      border: "border-purple-100"
    },
    { 
      title: "Future Ready", 
      desc: "High demand in STEM and healthcare industries", 
      icon: Clock01Icon, 
      color: "text-amber-600", 
      bg: "bg-amber-50/50",
      border: "border-amber-100"
    }
  ],
  subjects: [
    { name: "Biology", code: "101/1", cluster: "Pure Sciences", assessment: "Theory + Practical", icon: Plant01Icon, color: "text-green-600", bg: "bg-green-50" },
    { name: "Chemistry", code: "102/2", cluster: "Pure Sciences", assessment: "Theory + Practical", icon: TestTube01Icon, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Physics", code: "103/3", cluster: "Pure Sciences", assessment: "Theory + Practical", icon: Idea01Icon, color: "text-orange-500", bg: "bg-orange-50" }
  ],
  schools: [
    { name: "Alliance High School", location: "Nairobi County", type: "Boarding", match: "92%", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&auto=format&fit=crop" },
    { name: "Lenana School", location: "Nairobi County", type: "Boarding", match: "89%", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop" },
    { name: "St. Mary's Girls Nairobi", location: "Nairobi County", type: "Boarding", match: "86%", img: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?q=80&w=200&auto=format&fit=crop" }
  ],
  pathways: [
    { name: "Medical Doctor", match: "High Compatibility", icon: FavouriteIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Pharmacist", match: "High Compatibility", icon: TestTube01Icon, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Biomedical Scientist", match: "High Compatibility", icon: Atom01Icon, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Environmental Scientist", match: "High Compatibility", icon: Plant01Icon, color: "text-green-600", bg: "bg-green-50" },
    { name: "Chemical Engineer", match: "High Compatibility", icon: TestTube01Icon, color: "text-purple-600", bg: "bg-purple-50" }
  ],
  benefits: [
    "Opens doors to medical and health professions",
    "Strong foundation for engineering and technology",
    "Develops analytical and research skills",
    "High demand in job market",
    "Opportunities for innovation and discovery"
  ]
};

const MENU_ITEMS = [
  { label: "Overview", icon: Home01Icon, active: true },
  { label: "Schools Offering", icon: Building03Icon, active: false },
  { label: "Career Pathways", icon: RouteIcon, active: false },
  { label: "Requirements", icon: Task01Icon, active: false },
  { label: "Subject Details", icon: Book01Icon, active: false },
  { label: "Related Combinations", icon: Layers01Icon, active: false },
  { label: "Save Combination", icon: FavouriteIcon, active: false },
];

export default function CombinationDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col items-center pb-20">
      <NavBar />
      
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-slate-200 py-4 px-6 flex justify-center sticky top-0 z-30 shadow-sm">
        <div className="w-full max-w-[1400px]">
          <Link href="/recommendations" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" /> Back to results
          </Link>
        </div>
      </div>
      
      <main className="w-full max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Main Icon Card */}
          <Card className="w-full aspect-square rounded-3xl bg-[#f0f4ff] border-none shadow-sm flex items-center justify-center">
            <HugeiconsIcon icon={TestTube01Icon} size={120} className="text-blue-600" />
          </Card>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-1">
            {MENU_ITEMS.map((item, idx) => (
              <button 
                key={idx}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left",
                  item.active 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <HugeiconsIcon icon={item.icon} size={20} className={item.active ? "text-blue-600" : "text-slate-500"} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Help Box */}
          <Card className="flex flex-col p-5 rounded-2xl border-slate-200 bg-white shadow-sm mt-4">
             <h4 className="font-bold text-slate-900 mb-2">Need help choosing?</h4>
             <p className="text-sm font-medium text-slate-500 mb-4 leading-relaxed">
               Get personalized recommendations based on your interests.
             </p>
             <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold rounded-xl">
               Get Recommendations
             </Button>
          </Card>

        </div>

        {/* CENTER COLUMN */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
               <HugeiconsIcon icon={TestTube01Icon} size={20} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">{MOCK_COMBINATION.title}</h1>
          </div>
          
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold w-fit mb-6 px-3 py-1">
            {MOCK_COMBINATION.track}
          </Badge>

          <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-6">
            {MOCK_COMBINATION.description}
          </p>

          {/* Mini Stats */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-semibold">
            {MOCK_COMBINATION.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-600">
                <HugeiconsIcon icon={stat.icon} size={18} className={stat.color} />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Horizontal Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto">
            {["Overview", "Schools (124)", "Career Pathways", "Requirements", "Subject Details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-sm font-bold whitespace-nowrap transition-colors relative",
                  activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* About Section */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-3">About this Combination</h3>
            <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-6">
              {MOCK_COMBINATION.about}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_COMBINATION.cards.map((card, idx) => (
                <Card key={idx} className={cn("flex flex-col p-4 rounded-2xl border shadow-none", card.bg, card.border)}>
                  <div className="flex items-center gap-2 mb-3">
                    <HugeiconsIcon icon={card.icon} size={18} className={card.color} />
                    <span className="text-sm font-bold text-slate-900">{card.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{card.desc}</p>
                  {card.badge && (
                    <Badge variant="secondary" className="mt-auto pt-3 w-fit bg-emerald-100/50 text-emerald-700 border-none font-bold px-2 py-0.5 text-[10px]">
                      {card.badge}
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Subjects Table */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Subjects in this Combination</h3>
            <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-4 px-6 font-semibold text-slate-500 text-xs tracking-wider uppercase">Subject</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-xs tracking-wider uppercase">Code</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-xs tracking-wider uppercase">Cluster</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-xs tracking-wider uppercase">Assessment</th>
                    <th className="py-4 px-6 font-semibold text-slate-500 text-xs tracking-wider uppercase">Importance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_COMBINATION.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded bg-opacity-20 flex items-center justify-center shrink-0", sub.bg)}>
                            <HugeiconsIcon icon={sub.icon} size={16} className={sub.color} />
                          </div>
                          <span className="font-bold text-slate-900">{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">{sub.code}</td>
                      <td className="py-4 px-6 font-medium text-slate-600">{sub.cluster}</td>
                      <td className="py-4 px-6 font-medium text-slate-600">{sub.assessment}</td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-2 py-0.5">Core</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-blue-50/50 p-4 border-t border-slate-100 flex items-start gap-3">
                <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-slate-600">
                  These subjects complement each other to provide a strong foundation for advanced studies and careers in science and technology.
                </p>
              </div>
            </div>
          </div>

          {/* Schools Offering */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Schools Offering This Combination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
               {MOCK_COMBINATION.schools.map((school, idx) => (
                 <Card key={idx} className="flex flex-col p-3 rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                   <div className="w-full h-24 rounded-xl bg-slate-200 shrink-0 overflow-hidden relative border border-slate-100 mb-3">
                     <Image src={school.img} fill alt={school.name} className="object-cover" />
                   </div>
                   <div className="flex flex-col flex-1">
                     <span className="text-sm font-bold text-slate-900 leading-tight mb-1">{school.name}</span>
                     <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-2">
                       <HugeiconsIcon icon={Location01Icon} size={12} className="shrink-0" /> {school.location}
                     </div>
                     <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-semibold text-[10px] w-fit px-2 py-0 mb-3">
                       {school.type}
                     </Badge>
                     <span className="text-xs font-bold text-emerald-600 mt-auto">{school.match} <span className="font-medium text-[10px]">Match</span></span>
                   </div>
                 </Card>
               ))}
               
               {/* View All Card */}
               <Card className="flex flex-col items-center justify-center p-4 rounded-2xl border-slate-200 bg-slate-50 shadow-sm hover:bg-slate-100 transition-colors cursor-pointer text-center">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3 text-slate-600 shadow-sm shrink-0">
                   <HugeiconsIcon icon={Building03Icon} size={18} />
                 </div>
                 <span className="text-sm font-bold text-slate-900 leading-tight mb-4">View all 124 schools offering this combination</span>
                 <Button variant="link" className="text-blue-600 font-bold h-auto p-0 hover:no-underline hover:text-blue-700 text-xs mt-auto">
                   View All Schools <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="ml-1" />
                 </Button>
               </Card>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Top Career Pathways */}
          <Card className="flex flex-col p-6 rounded-2xl border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-5">Top Career Pathways</h3>
             <div className="flex flex-col gap-4">
               {MOCK_COMBINATION.pathways.map((path, idx) => (
                 <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                   <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", path.bg)}>
                     <HugeiconsIcon icon={path.icon} size={18} className={path.color} />
                   </div>
                   <div className="flex flex-col flex-1">
                     <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{path.name}</span>
                     <span className="text-xs font-semibold text-emerald-600">{path.match}</span>
                   </div>
                   <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                 </div>
               ))}
             </div>
             <Button variant="link" className="mt-4 text-blue-600 font-bold h-auto p-0 hover:no-underline hover:text-blue-700 text-sm justify-start w-fit">
               View all career pathways <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
             </Button>
          </Card>

          {/* Key Benefits */}
          <Card className="flex flex-col p-6 rounded-2xl border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-5">Key Benefits</h3>
             <div className="flex flex-col gap-4">
               {MOCK_COMBINATION.benefits.map((benefit, idx) => (
                 <div key={idx} className="flex items-start gap-3">
                   <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                   <span className="text-sm font-medium text-slate-700 leading-snug">{benefit}</span>
                 </div>
               ))}
             </div>
          </Card>

        </div>

      </main>
    </div>
  )
}
