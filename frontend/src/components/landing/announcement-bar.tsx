"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background px-4 py-2 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 relative z-50">
      <span className="hidden sm:inline">Organize work. Empower teams. Deliver better.</span>
      <span className="sm:hidden">Deliver better work, together.</span>
      <Link href="/register" className="inline-flex items-center hover:underline group">
        <span>Learn more</span>
        <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
