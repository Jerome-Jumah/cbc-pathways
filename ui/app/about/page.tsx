"use client"

import React from "react"
import { NavBar } from "@/components/nav-bar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight01Icon,
  Book01Icon,
  Briefcase02Icon,
  Building03Icon,
  CheckmarkCircle01Icon,
  FavouriteIcon,
  Mortarboard01Icon,
  Plant01Icon,
  RouteIcon,
  Search01Icon,
  Settings01Icon,
  Target01Icon,
  UserGroupIcon,
  QuoteUpIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

const FEATURES = [
  {
    title: "Explore Subjects & Interests",
    description: "Discover subjects you love and areas that match your strengths and passions.",
    icon: Search01Icon,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Find the Right Combinations",
    description: "Get personalized subject combinations that align with your interests and goals.",
    icon: Settings01Icon, // Using settings as a proxy for puzzle
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Discover Schools",
    description: "Explore and compare CBC schools that offer your preferred combinations.",
    icon: Building03Icon,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Explore Career Pathways",
    description: "See careers related to your choices and plan your path with confidence.",
    icon: RouteIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Get Smart Recommendations",
    description: "Receive data-driven recommendations tailored to you.",
    icon: FavouriteIcon,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  }
];

const TRUST_POINTS = [
  "Aligned with the Competency Based Curriculum (CBC)",
  "Curated by education experts and career professionals",
  "Up-to-date information on subjects, schools & careers",
  "Personalized recommendations based on your unique profile",
  "Built for learners, supported by parents and teachers"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col items-center pb-20">
      <NavBar />
      
      <main className="w-full max-w-[1400px] px-6 py-8 flex flex-col gap-12">
        
        {/* HERO SECTION */}
        <section className="relative w-full rounded-[2.5rem] bg-gradient-to-r from-white via-white to-blue-50/30 overflow-hidden border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-12">
          
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          {/* Left Content */}
          <div className="relative z-10 flex flex-col items-start w-full lg:w-[55%]">
            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none px-4 py-1.5 rounded-full font-bold text-xs mb-6">
              About Mwalimu
            </Badge>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Your trusted guide to <br className="hidden lg:block" /> CBC success.
            </h1>
            
            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl mb-12">
              Mwalimu helps CBC learners discover the right subject combinations, schools, and career pathways—so you can make confident choices for your future.
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-y-6 gap-x-8 lg:gap-x-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Building03Icon} size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-slate-900 leading-none mb-1">1000+</span>
                  <span className="text-xs font-semibold text-slate-500">Schools</span>
                </div>
              </div>
              
              <div className="w-px h-10 bg-slate-200 hidden sm:block"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={UserGroupIcon} size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-slate-900 leading-none mb-1">120+</span>
                  <span className="text-xs font-semibold text-slate-500">Subject Combinations</span>
                </div>
              </div>
              
              <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={Briefcase02Icon} size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-slate-900 leading-none mb-1">50+</span>
                  <span className="text-xs font-semibold text-slate-500">Career Pathways</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - 3D Illustration Placeholder */}
          <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
            {/* Background Blob */}
            <div className="absolute w-[80%] h-[80%] bg-blue-100 rounded-full blur-3xl opacity-60"></div>
            
            {/* Main Image */}
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10">
               <Image 
                 src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                 fill 
                 alt="Students studying together" 
                 className="object-cover"
               />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-[10%] left-[5%] w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '3s' }}>
              <HugeiconsIcon icon={Mortarboard01Icon} size={28} className="text-blue-600" />
            </div>
            <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <HugeiconsIcon icon={Building03Icon} size={24} className="text-emerald-600" />
            </div>
            <div className="absolute bottom-[20%] right-[0%] w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
              <HugeiconsIcon icon={Target01Icon} size={32} className="text-purple-600" />
            </div>
          </div>
          
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="flex flex-col items-center gap-8 pt-4">
          <h2 className="text-2xl font-extrabold text-slate-900">How Mwalimu helps you</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
            {FEATURES.map((feature, idx) => (
              <Card key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl border-slate-200 shadow-sm bg-white hover:-translate-y-1 transition-transform cursor-pointer">
                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-5 shrink-0", feature.bgColor, feature.color)}>
                  <HugeiconsIcon icon={feature.icon} size={28} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-2 leading-tight px-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6">
          
          {/* Trust Section */}
          <Card className="flex flex-col md:flex-row items-center overflow-hidden rounded-2xl border-slate-200 shadow-sm bg-[#f8fbff]">
             
             <div className="flex flex-col p-8 lg:p-10 w-full md:w-3/5">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Why learners and parents trust Mwalimu</h3>
                <div className="flex flex-col gap-4">
                  {TRUST_POINTS.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-slate-700 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="relative w-full md:w-2/5 min-h-[250px] md:min-h-full flex items-center justify-center p-8">
                {/* Placeholder for 3D Shield */}
                <div className="relative w-48 h-48">
                   <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
                   <Image 
                     src="https://images.unsplash.com/photo-1614064641913-6b71f301683b?q=80&w=400&auto=format&fit=crop" 
                     fill 
                     alt="Security Shield" 
                     className="object-cover rounded-3xl shadow-xl z-10 border-4 border-white"
                   />
                </div>
             </div>
             
          </Card>

          <div className="flex flex-col gap-6">
            
            {/* Mission Section */}
            <Card className="flex flex-col p-8 rounded-2xl border-slate-200 shadow-sm bg-white h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Target01Icon} size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                  To empower every CBC learner in Kenya with the knowledge, tools, and guidance to make informed academic choices and build a successful future.
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex gap-4 items-start relative overflow-hidden">
                 <HugeiconsIcon icon={QuoteUpIcon} size={32} className="text-blue-100 absolute -top-1 -left-1 opacity-50 rotate-180" />
                 <div className="text-blue-600 shrink-0 relative z-10">
                   <HugeiconsIcon icon={QuoteUpIcon} size={24} className="fill-current" />
                 </div>
                 <p className="text-sm font-bold text-slate-700 italic relative z-10 leading-relaxed">
                   "Your journey is unique. We're here to guide every step."
                 </p>
              </div>
            </Card>

          </div>
        </div>

        {/* Call to Action Banner */}
        <Card className="w-full rounded-2xl bg-slate-50 border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white text-blue-600 shadow-sm flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Mortarboard01Icon} size={28} />
              </div>
              <div className="flex flex-col">
                 <h3 className="text-xl font-bold text-slate-900 mb-1">Ready to discover your path?</h3>
                 <p className="text-sm text-slate-500 font-medium">Start exploring combinations, schools and careers that match who you are and where you want to go.</p>
              </div>
           </div>
           
           <Link href="/explore-tracks" className="w-full md:w-auto shrink-0">
             <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm h-12 px-8 text-[15px]">
               Explore Now <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="ml-2" />
             </Button>
           </Link>
        </Card>

      </main>
    </div>
  )
}
