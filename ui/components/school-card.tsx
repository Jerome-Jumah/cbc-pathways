import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location01Icon,
  UserGroupIcon,
  Building03Icon,
  Favorite,
  Sun01Icon
} from "@hugeicons/core-free-icons"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface School {
  id: string
  rank: number
  name: string
  imageUrl?: string
  location: string
  cluster: string
  gender: string
  accommodation: string
  subjects: string[]
  matchPercentage?: number
}

interface SchoolCardProps {
  school: School
}

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-emerald-600 transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-900">{value}%</span>
      </div>
    </div>
  )
}

export function SchoolCard({ school }: SchoolCardProps) {
  const clusterColors: Record<string, string> = {
    C1: "text-blue-600 border-blue-200 bg-white",
    C2: "text-blue-600 border-blue-200 bg-white",
    C3: "text-blue-600 border-blue-200 bg-white",
    C4: "text-blue-600 border-blue-200 bg-white",
  }

  // Get first 4 subjects and count the rest
  const visibleSubjects = school.subjects.slice(0, 4)
  const remainingSubjects = Math.max(0, school.subjects.length - 4)

  return (
    <Link href={`/school/${school.id}`} className="block">
      <Card className="flex flex-col sm:flex-row p-4 gap-6 rounded-2xl hover:shadow-md transition-shadow border-slate-100 bg-white relative">
        
        {/* Image Section */}
        <div className="relative w-full sm:w-[240px] h-[160px] shrink-0 rounded-xl overflow-hidden bg-slate-100">
          {school.imageUrl ? (
            <Image
              src={school.imageUrl}
              alt={school.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
              <span className="text-3xl font-extrabold text-slate-300">
                {school.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          {/* Rank Badge */}
          <div className="absolute top-2 left-2 bg-emerald-700 text-white w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm shadow-sm">
            {school.rank}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-grow justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-slate-900">{school.name}</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location01Icon} size={16} className="text-slate-400" />
                {school.location}
              </div>
              <Badge variant="outline" className={cn("px-2 py-0 h-6 font-semibold border rounded-md", clusterColors[school.cluster.split(" ")[0]] || "text-slate-600 border-slate-200")}>
                {school.cluster.split(" ")[0]}
              </Badge>
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={UserGroupIcon} size={16} className="text-slate-400" />
                {school.gender}
              </div>
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon icon={school.accommodation === "Boarding" ? Building03Icon : Sun01Icon} size={16} className="text-slate-400" />
                {school.accommodation}
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {visibleSubjects.map((subject, idx) => (
              <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-medium px-3 py-1 rounded-full">
                {subject}
              </Badge>
            ))}
            {remainingSubjects > 0 && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-medium px-3 py-1 rounded-full">
                +{remainingSubjects}
              </Badge>
            )}
          </div>
        </div>

        {/* Match Percentage & Actions */}
        <div className="flex flex-col items-center justify-between sm:w-24 shrink-0 border-l border-slate-100 pl-4">
          <button onClick={(e) => { e.preventDefault(); /* handle favorite toggle */ }} className="self-end text-slate-400 hover:text-red-500 transition-colors p-1">
            <HugeiconsIcon icon={Favorite} size={20} />
          </button>
          
          {school.matchPercentage !== undefined && (
            <div className="flex flex-col items-center mb-2">
              <CircularProgress value={school.matchPercentage} />
              <span className="text-xs font-semibold text-slate-500 mt-1">Match</span>
            </div>
          )}
        </div>

      </Card>
    </Link>
  )
}
