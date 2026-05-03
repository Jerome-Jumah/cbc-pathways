"use client";

import { cn } from "@/lib/utils";
import { Book02Icon, Home01Icon, InformationCircleIcon, School01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home01Icon },
    { label: "Tracks", href: "/explore-tracks", icon: Book02Icon },
    { label: "Schools", href: "/find-schools", icon: School01Icon },
    { label: "Recommendations", href: "/recommendations", icon: StarIcon },
    { label: "About", href: "/about", icon: InformationCircleIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-card border-t border-border h-[68px] pb-2 pt-1 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.03)] px-2">
      {tabs.map(tab => {
        // Precise exact match for home, startsWith for others
        const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-blue-600 dark:text-blue-300" : "text-muted-foreground/80 hover:text-muted-foreground",
            )}
          >
            <HugeiconsIcon icon={tab.icon} size={22} />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
