"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Book01Icon,
  Building03Icon,
  CheckmarkBadge01Icon,
  CheckmarkCircle01Icon,
  GlobalIcon,
  Home01Icon,
  Idea01Icon,
  Image01Icon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
  RouteIcon,
  Settings01Icon,
  Share01Icon,
  SmartPhone01Icon,
  Task01Icon,
  UserGroupIcon,
  UserIcon,
  Favorite,
  FavouriteIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock Data
const MOCK_SCHOOL = {
  id: "alliance-high",
  name: "Alliance High School",
  headerImage: "https://images.unsplash.com/photo-1592284941320-f56f1406c117?q=80&w=1200&auto=format&fit=crop",
  logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&auto=format&fit=crop", // Placeholder for logo
  location: "Nairobi County",
  fullLocation: "Lavington, Nairobi County",
  cluster: "C2",
  clusterName: "Extra County",
  gender: "Boys",
  accommodation: "Boarding",
  population: "Approx. 1,250",
  schoolType: "Public",
  description: "Alliance High School is one of Kenya's top performing schools with a rich history of academic excellence and holistic development.",
  motto: "Fortis Fortuna Adiuvat",
  established: "1926",
  principal: "Mr. David Mwangi",
  phone: "+254 20 123 4567",
  email: "info@alliance.sc.ke",
  website: "alliance.sc.ke",
  subjectCombinations: [
    "Biology, Chemistry, Physics",
    "Biology, Chemistry, Mathematics",
    "Physics, Mathematics, Computer Studies",
    "Economics, Mathematics, Business",
    "History, Government, CRE",
    "Literature, Kiswahili, History",
    "Geography, Biology, Chemistry",
    "Agriculture, Biology, Chemistry",
  ],
  tracks: [
    {
      title: "Pure Sciences",
      description: "Focus on scientific subjects and preparation for STEM careers.",
      combinationsCount: "120+",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      badgeColor: "bg-blue-100 text-blue-700",
      icon: Idea01Icon // using Idea as a placeholder for science flask
    },
    {
      title: "Technical Studies",
      description: "Hands-on technical and practical subjects for future innovators.",
      combinationsCount: "55+",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      badgeColor: "bg-emerald-100 text-emerald-700",
      icon: Settings01Icon
    }
  ],
  highlights: [
    "Strong academic performance",
    "Excellent co-curricular programs",
    "Modern facilities and resources",
    "Experienced and dedicated staff"
  ]
}

export default function SchoolDetailsPage() {
  const [activeTab, setActiveTab] = useState("Overview")

  const SIDEBAR_LINKS = [
    { label: "Overview", icon: Home01Icon },
    { label: "Subject Combinations", icon: Task01Icon },
    { label: "Tracks Offered", icon: RouteIcon },
    { label: "Gallery", icon: Image01Icon },
    { label: "More Information", icon: InformationCircleIcon },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafe] font-sans flex flex-col items-center">
      <NavBar />
      
      <main className="w-full max-w-[1400px] px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">
        
        {/* Left Sidebar */}
        <Card className="flex flex-col gap-8 p-6 rounded-2xl shadow-sm h-fit">
          <div className="flex flex-col gap-4">
            <Link href="/find-schools" className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-2" />
              Back to results
            </Link>
            
            <nav className="flex flex-col gap-1">
              {SIDEBAR_LINKS.map((link) => (
                <button 
                  key={link.label}
                  onClick={() => setActiveTab(link.label)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left leading-snug",
                    activeTab === link.label 
                      ? "bg-slate-100/80 text-blue-600" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <HugeiconsIcon 
                    icon={link.icon} 
                    size={20} 
                    className={cn("mr-3 shrink-0", activeTab === link.label ? "text-blue-600" : "text-slate-400")} 
                  />
                  <span>{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900">Need help deciding?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-1">
              Get personalized recommendations based on your interests.
            </p>
            <Button variant="outline" className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold h-auto py-2.5 rounded-xl whitespace-normal leading-snug">
              Get Recommendations
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-row items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
               <HugeiconsIcon icon={FavouriteIcon} size={20} />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-slate-900 text-sm">Save this school</span>
               <span className="text-xs text-slate-500 font-medium">Add to favorites</span>
             </div>
          </div>
        </Card>

        {/* Main Center Content */}
        <Card className="flex flex-col gap-8 rounded-2xl shadow-sm overflow-hidden h-fit pb-8">
          
          <div className="relative w-full h-[320px] rounded-3xl overflow-hidden bg-slate-200">
            <Image 
              src={MOCK_SCHOOL.headerImage}
              alt={MOCK_SCHOOL.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <Button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 text-sm font-semibold rounded-xl h-10 px-4 shadow-sm backdrop-blur-sm">
              <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2" />
              Save
            </Button>
          </div>

          {/* School Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start -mt-20 relative z-10 px-4">
            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg shrink-0 border border-slate-100">
               <div className="w-full h-full rounded-xl bg-slate-50 relative overflow-hidden flex items-center justify-center">
                 {/* Replace with actual logo logic */}
                 <div className="w-16 h-16 bg-emerald-800 rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={Book01Icon} className="text-white" size={32} />
                 </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-16 sm:mt-20">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{MOCK_SCHOOL.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Location01Icon} size={16} className="text-slate-400" />
                  {MOCK_SCHOOL.location}
                </div>
                <Badge variant="outline" className="px-2 py-0 h-6 font-semibold border border-blue-200 text-blue-600 bg-white rounded-md">
                  {MOCK_SCHOOL.cluster}
                </Badge>
                <span className="text-slate-500 -ml-2">({MOCK_SCHOOL.clusterName})</span>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-slate-400" />
                  {MOCK_SCHOOL.gender}
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="text-slate-400" />
                  {MOCK_SCHOOL.accommodation}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <p className="text-slate-600 leading-relaxed max-w-3xl">
              {MOCK_SCHOOL.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={Location01Icon} size={18} className="mr-2" />
                View on Map
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={Share01Icon} size={18} className="mr-2 text-blue-600" />
                Share
              </Button>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl h-11 px-6 shadow-sm">
                <HugeiconsIcon icon={FavouriteIcon} size={18} className="mr-2 text-blue-600" />
                Save School
              </Button>
            </div>
          </div>

          {/* Main Content Tabs (Visual only for now based on mockup) */}
          <div className="flex items-center gap-8 border-b border-slate-200 px-4 mt-4 overflow-x-auto no-scrollbar">
            {SIDEBAR_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => setActiveTab(link.label)}
                className={cn(
                  "pb-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap",
                  activeTab === link.label 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-slate-500 hover:text-slate-900"
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="px-8 flex flex-col gap-8">
            {/* Subject Combinations */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900">
                Available Subject Combinations <span className="text-slate-500 font-medium">({MOCK_SCHOOL.subjectCombinations.length + 10})</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MOCK_SCHOOL.subjectCombinations.map((combo, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 border border-slate-100">
                    <HugeiconsIcon icon={Book01Icon} size={18} className="text-blue-600 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 truncate">{combo}</span>
                  </div>
                ))}
                <div className="flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-3 border border-slate-100 cursor-pointer">
                    <span className="text-sm font-semibold text-slate-500">+10 more combinations</span>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Tracks Offered */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-900">
                Tracks Offered <span className="text-slate-500 font-medium">({MOCK_SCHOOL.tracks.length})</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SCHOOL.tracks.map((track, idx) => (
                  <div key={idx} className={cn("rounded-2xl border p-5 flex gap-4 items-start transition-shadow hover:shadow-sm", track.color)}>
                     <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                       <HugeiconsIcon icon={track.icon} size={24} className="opacity-80" />
                     </div>
                     <div className="flex flex-col gap-2">
                       <h4 className="font-bold text-base text-slate-900">{track.title}</h4>
                       <p className="text-sm opacity-80 leading-relaxed text-slate-700">{track.description}</p>
                       <Badge variant="secondary" className={cn("self-start mt-2 border-none font-semibold px-2.5 py-0.5", track.badgeColor)}>
                         {track.combinationsCount} combinations
                       </Badge>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </Card>

        {/* Right Sidebar - Quick Facts */}
        <Card className="flex flex-col gap-8 p-6 rounded-2xl shadow-sm h-fit">
          
          {/* Key Info */}
          <div className="flex flex-col gap-4">
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={CheckmarkBadge01Icon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Motto</span>
               <span className="text-slate-600 font-medium">{MOCK_SCHOOL.motto}</span>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={Home01Icon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Established</span>
               <span className="text-slate-600 font-medium">{MOCK_SCHOOL.established}</span>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={UserIcon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Principal</span>
               <span className="text-slate-600 font-medium">{MOCK_SCHOOL.principal}</span>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={SmartPhone01Icon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Phone</span>
               <span className="text-slate-600 font-medium">{MOCK_SCHOOL.phone}</span>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={Mail01Icon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Email</span>
               <span className="text-slate-600 font-medium">{MOCK_SCHOOL.email}</span>
             </div>
             <Separator className="bg-slate-100" />
             <div className="grid grid-cols-[32px_100px_1fr] items-center text-sm">
               <HugeiconsIcon icon={GlobalIcon} size={18} className="text-emerald-600" />
               <span className="font-semibold text-slate-700">Website</span>
               <a href="#" className="text-blue-600 font-semibold hover:underline flex items-center">
                 {MOCK_SCHOOL.website}
                 <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="ml-1" />
               </a>
             </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Highlights */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900">Why students choose this school</h3>
            <div className="flex flex-col gap-3">
              {MOCK_SCHOOL.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-600 leading-snug">{highlight}</span>
                </div>
              ))}
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center mt-2 self-start">
              See all highlights <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
            </button>
          </div>

          <Separator className="bg-slate-100" />

          {/* At a Glance */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-slate-900">At a glance</h3>
            <div className="flex flex-col gap-4">
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={Location01Icon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">Location</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.fullLocation}</span>
               </div>
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={Task01Icon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">Cluster</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.cluster} ({MOCK_SCHOOL.clusterName})</span>
               </div>
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={UserIcon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">Gender</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.gender}</span>
               </div>
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={Building03Icon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">Accommodation</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.accommodation}</span>
               </div>
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">Student Population</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.population}</span>
               </div>
               <div className="grid grid-cols-[28px_145px_1fr] items-start text-sm">
                 <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} className="text-slate-400 mt-0.5" />
                 <span className="font-semibold text-slate-700">School Type</span>
                 <span className="text-slate-600 font-medium">{MOCK_SCHOOL.schoolType}</span>
               </div>
            </div>
          </div>

        </Card>

      </main>
    </div>
  )
}
