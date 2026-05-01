"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home01Icon,
  Book02Icon,
  Search01Icon,
  StarIcon,
  InformationCircleIcon,
  School01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function MobileBottomNav() {
  const pathname = usePathname()

  const tabs = [
    { label: "Home", href: "/", icon: Home01Icon },
    { label: "Tracks", href: "/explore-tracks", icon: Book02Icon },
    { label: "Schools", href: "/find-schools", icon: School01Icon },
    { label: "Recommendations", href: "/recommendations", icon: StarIcon }, 
    { label: "About", href: "/about", icon: InformationCircleIcon }, 
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t border-slate-200 h-[68px] pb-2 pt-1 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.03)] px-2">
      {tabs.map((tab) => {
        // Precise exact match for home, startsWith for others
        const isActive = tab.href === "/" 
          ? pathname === "/"
          : pathname.startsWith(tab.href)
        
        return (
          <Link 
            key={tab.label}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <HugeiconsIcon icon={tab.icon} size={22} className={isActive ? "fill-current" : ""} />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
