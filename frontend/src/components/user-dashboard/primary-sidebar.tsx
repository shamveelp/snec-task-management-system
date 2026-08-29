"use client"

import * as React from "react"
import { 
  BellRing, 
  HelpCircle, 
  FolderKanban, 
  Menu, 
  ChevronLeft, 
  LayoutDashboard, 
  UserCircle2, 
  MailPlus, 
  Building2,
  LifeBuoy
} from "lucide-react"
import { cn } from "../../lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface PrimarySidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

const SIDEBAR_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    match: (p: string) => p === "/dashboard",
    color: "group-hover:text-[#60A5FA]",
    activeBg: "bg-[#3B82F6]/15 text-white border-white/10",
    activeIconColor: "text-[#60A5FA]"
  },
  {
    icon: Building2,
    label: "Organizations",
    href: "/dashboard/organizations",
    match: (p: string) => p.startsWith("/dashboard/organizations"),
    color: "group-hover:text-[#A78BFA]",
    activeBg: "bg-[#7C68EE]/15 text-white border-white/10",
    activeIconColor: "text-[#A78BFA]"
  },
  {
    icon: FolderKanban,
    label: "My Projects",
    href: "/dashboard/projects",
    match: (p: string) => p.startsWith("/dashboard/projects"),
    color: "group-hover:text-[#38BDF8]",
    activeBg: "bg-[#0284C7]/15 text-white border-white/10",
    activeIconColor: "text-[#38BDF8]"
  },
  {
    icon: UserCircle2,
    label: "Profile",
    href: "/dashboard/profile",
    match: (p: string) => p.startsWith("/dashboard/profile"),
    color: "group-hover:text-[#FBBF24]",
    activeBg: "bg-[#D97706]/15 text-white border-white/10",
    activeIconColor: "text-[#FBBF24]"
  },
  {
    icon: MailPlus,
    label: "Invitations",
    href: "/dashboard/invitations",
    match: (p: string) => p.startsWith("/dashboard/invitations"),
    color: "group-hover:text-[#34D399]",
    activeBg: "bg-[#059669]/15 text-white border-white/10",
    activeIconColor: "text-[#34D399]"
  },
  {
    icon: BellRing,
    label: "Notifications",
    href: "/dashboard/notifications",
    match: (p: string) => p.startsWith("/dashboard/notifications"),
    color: "group-hover:text-[#F87171]",
    activeBg: "bg-[#DC2626]/15 text-white border-white/10",
    activeIconColor: "text-[#F87171]"
  }
]

export function PrimarySidebar({ isExpanded, onToggle }: PrimarySidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "h-screen bg-[#0D0E12] border-r border-white/[0.04] flex flex-col py-6 z-30 transition-all duration-300 flex-shrink-0 select-none",
      isExpanded ? "w-64 px-4 items-start" : "w-16 items-center"
    )}>
      <div className={cn("flex items-center w-full mb-8", isExpanded ? "justify-between px-2" : "justify-center")}>
        {isExpanded && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#7C68EE] flex items-center justify-center flex-shrink-0 shadow-md">
              <div className="h-3.5 w-3.5 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-white tracking-wider text-base">FlowTask</span>
          </div>
        )}
        <div 
          onClick={onToggle}
          className="p-2 text-white/40 hover:text-white cursor-pointer rounded-xl hover:bg-white/5 transition-colors"
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 flex-1 w-full">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = item.match(pathname || "")
          const Icon = item.icon

          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={cn(
                "group p-3 cursor-pointer transition-all duration-200 rounded-xl flex items-center relative border",
                isActive 
                  ? cn(item.activeBg, "shadow-sm") 
                  : "border-transparent text-white/40 hover:text-white hover:bg-white/5",
                isExpanded ? "gap-3 justify-start px-3.5" : "justify-center w-11 h-11 mx-auto"
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors",
                isActive ? item.activeIconColor : cn("text-white/40", item.color)
              )} />
              {isExpanded && (
                <span className={cn(
                  "font-medium text-sm whitespace-nowrap transition-colors",
                  isActive ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
                )}>
                  {item.label}
                </span>
              )}
              {isActive && !isExpanded && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#3B82F6] rounded-r-full shadow-[0_0_8px_#3B82F6]"></div>
              )}
            </Link>
          )
        })}
      </div>
      
      <div className="mt-auto w-full">
        <Link 
          href="#"
          className={cn(
            "group p-3 cursor-pointer transition-colors rounded-xl flex items-center text-white/40 hover:text-white hover:bg-white/5 border border-transparent",
            isExpanded ? "gap-3 justify-start px-3.5" : "justify-center w-11 h-11 mx-auto"
          )}
          title={!isExpanded ? "Help & Support" : undefined}
        >
          <LifeBuoy className="h-5 w-5 flex-shrink-0 group-hover:text-cyan-400 transition-colors" />
          {isExpanded && <span className="font-medium text-sm whitespace-nowrap text-white/60 group-hover:text-white">Help & Support</span>}
        </Link>
      </div>
    </aside>
  )
}
