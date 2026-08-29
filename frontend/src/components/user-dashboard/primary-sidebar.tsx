"use client"

import * as React from "react"
import { Bell, HelpCircle, FolderKanban, Menu, ChevronLeft, LayoutDashboard, User, UserPlus } from "lucide-react"
import { cn } from "../../lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface PrimarySidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function PrimarySidebar({ isExpanded, onToggle }: PrimarySidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "h-screen bg-[#0D0E12] border-r border-white/[0.04] flex flex-col py-6 z-30 transition-all duration-300 flex-shrink-0",
      isExpanded ? "w-64 px-4 items-start" : "w-16 items-center"
    )}>
      <div className={cn("flex items-center w-full mb-8", isExpanded ? "justify-between px-2" : "justify-center")}>
        {isExpanded && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 cursor-pointer">
              <div className="h-4 w-4 bg-[#0D0E12] rounded-full border-[3px] border-white"></div>
            </div>
            <span className="font-bold text-white tracking-wide">SNEC</span>
          </div>
        )}
        <div 
          onClick={onToggle}
          className="p-1.5 text-white/40 hover:text-white cursor-pointer rounded-lg hover:bg-white/5 transition-colors"
        >
          {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 flex-1 w-full">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          href="/dashboard"
          active={pathname === "/dashboard"} 
          isExpanded={isExpanded} 
        />
        <SidebarItem 
          icon={FolderKanban} 
          label="Organizations" 
          href="/dashboard/organizations"
          active={pathname?.startsWith("/dashboard/organizations")} 
          badge="6" 
          isExpanded={isExpanded} 
        />
        <SidebarItem 
          icon={FolderKanban} 
          label="My Projects" 
          href="/dashboard/projects"
          active={pathname?.startsWith("/dashboard/projects")} 
          isExpanded={isExpanded} 
        />
        <SidebarItem 
          icon={User} 
          label="Profile" 
          href="/dashboard/profile"
          active={pathname?.startsWith("/dashboard/profile")} 
          isExpanded={isExpanded} 
        />
        <SidebarItem 
          icon={UserPlus} 
          label="Invitations" 
          href="/dashboard/invitations"
          active={pathname?.startsWith("/dashboard/invitations")} 
          isExpanded={isExpanded} 
        />
        <SidebarItem 
          icon={Bell} 
          label="Notifications" 
          href="/dashboard/notifications"
          active={pathname?.startsWith("/dashboard/notifications")} 
          isExpanded={isExpanded} 
        />
      </div>
      
      <div className="mt-auto w-full">
        <SidebarItem 
          icon={HelpCircle} 
          label="Help & Support" 
          href="#"
          active={false}
          isExpanded={isExpanded} 
        />
      </div>
    </aside>
  )
}

function SidebarItem({ icon: Icon, label, badge, isExpanded, active, href }: any) {
  return (
    <Link href={href} className={cn(
      "p-3 cursor-pointer transition-colors rounded-xl flex items-center relative",
      active ? "text-white bg-white/5" : "text-white/40 hover:text-white hover:bg-white/5",
      isExpanded ? "gap-3 justify-start" : "justify-center"
    )}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isExpanded && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
      {badge && (
        <div className={cn(
          "absolute bg-[#FF6B6B] rounded-full border-2 border-[#131417] flex items-center justify-center text-white font-bold",
          isExpanded ? "right-2 top-1/2 -translate-y-1/2 h-5 min-w-[20px] px-1 text-[10px]" : "top-1.5 right-1.5 h-3.5 w-3.5 text-[0px]"
        )}>
          {isExpanded ? badge : ""}
        </div>
      )}
    </Link>
  )
}
