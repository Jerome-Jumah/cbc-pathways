import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeartAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function NavBar() {
  return (
    <div className="w-full px-6 pt-6">
      <header className="flex h-20 w-full items-center justify-between px-8 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-blue-600 p-1.5 w-10 h-10">
            <span className="text-xl font-bold text-white tracking-tighter">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight">Mwalimu</span>
            <span className="text-xs text-zinc-500 leading-tight">Your CBC Guide</span>
          </div>
        </div>

        <nav className="hidden md:flex h-full items-center gap-8 text-sm font-semibold text-zinc-500">
          <Link href="#" className="h-full flex items-center text-blue-600 border-b-[3px] border-blue-600 pt-[3px]">Home</Link>
          <Link href="#" className="h-full flex items-center hover:text-slate-900 border-b-[3px] border-transparent pt-[3px]">Explore Tracks</Link>
          <Link href="#" className="h-full flex items-center hover:text-slate-900 border-b-[3px] border-transparent pt-[3px]">Find Schools</Link>
          <Link href="#" className="h-full flex items-center hover:text-slate-900 border-b-[3px] border-transparent pt-[3px]">Recommendations</Link>
          <Link href="#" className="h-full flex items-center hover:text-slate-900 border-b-[3px] border-transparent pt-[3px]">About</Link>
        </nav>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-black rounded-full h-10 w-10">
            <HugeiconsIcon icon={HeartAddIcon} size={40} />
          </Button>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
    </div>
  )
}
