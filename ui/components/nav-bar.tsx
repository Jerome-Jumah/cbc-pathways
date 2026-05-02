"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeartAddIcon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from 'next/image'

export function NavBar() {
  const pathname = usePathname()
  
  const isActive = (href: string) => pathname === href

  return (
    <div className="w-full px-6 pt-6">
      <header className="flex h-20 w-full items-center justify-between px-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Mwalimu Logo" 
            width={140} 
            height={140} 
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex h-full items-center gap-8 text-sm font-semibold text-zinc-500">
          <Link href="/" className={cn("h-full flex items-center border-b-[3px] pt-[3px] transition-colors", isActive("/") ? "text-blue-600 border-blue-600" : "hover:text-slate-900 border-transparent")}>Home</Link>
          <Link href="/explore-tracks" className={cn("h-full flex items-center border-b-[3px] pt-[3px] transition-colors", isActive("/explore-tracks") ? "text-blue-600 border-blue-600" : "hover:text-slate-900 border-transparent")}>Explore Tracks</Link>
          <Link href="/find-schools" className={cn("h-full flex items-center border-b-[3px] pt-[3px] transition-colors", isActive("/find-schools") ? "text-blue-600 border-blue-600" : "hover:text-slate-900 border-transparent")}>Find Schools</Link>
          <Link href="/recommendations" className={cn("h-full flex items-center border-b-[3px] pt-[3px] transition-colors", isActive("/recommendations") ? "text-blue-600 border-blue-600" : "hover:text-slate-900 border-transparent")}>Recommendations</Link>
          <Link href="/about" className={cn("h-full flex items-center border-b-[3px] pt-[3px] transition-colors", isActive("/about") ? "text-blue-600 border-blue-600" : "hover:text-slate-900 border-transparent")}>About</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-black rounded-full h-10 w-10">
            <HugeiconsIcon icon={HeartAddIcon} size={40} />
          </Button>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-700">
                <HugeiconsIcon icon={Menu01Icon} size={28} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-8 mt-10">
                <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-xl">
                  <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">Juma M.</span>
                    <span className="text-xs text-slate-500">Student Account</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link href="/" className="px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    Home
                  </Link>
                  <Link href="/explore-tracks" className="px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    Explore Tracks
                  </Link>
                  <Link href="/find-schools" className="px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    Find Schools
                  </Link>
                  <Link href="/recommendations" className="px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    Recommendations
                  </Link>
                  <Link href="/about" className="px-4 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    About Mwalimu
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
    </header>
    </div>
  )
}
