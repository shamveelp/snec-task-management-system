"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Cloud, 
  Share2, 
  Folder,
  Star,
  Trash2,
  BarChart2,
  Calendar,
  LogOut,
  ArrowRightLeft
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"

const topNavItems = [
  { name: "My Drive", href: "/organization/dashboard", icon: Cloud },
  { name: "Shared Files", href: "/organization/dashboard#shared", icon: Share2 },
  { name: "File Requests", href: "/organization/dashboard#requests", icon: Folder },
  { name: "Starred", href: "/organization/dashboard#starred", icon: Star },
  { name: "Trash", href: "/organization/dashboard#trash", icon: Trash2 },
]

const bottomNavItems = [
  { name: "Statistics", href: "/organization/dashboard#stats", icon: BarChart2 },
  { name: "Task", href: "/organization/dashboard#task", icon: Calendar },
]

export function OrganizationSidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <aside className="w-[260px] h-full flex-shrink-0 bg-[#1C1F37] flex flex-col z-20 py-8">
      {/* Logo */}
      <div className="flex items-center px-8 mb-10 gap-3">
        <div className="flex items-center justify-center transform rotate-45">
          <ArrowRightLeft className="h-6 w-6 text-yellow-400" />
        </div>
        <span className="font-serif text-2xl font-bold text-white tracking-wide">Drive.</span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Nav */}
        <div className="space-y-1 px-4">
          {topNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                    isActive ? "text-white" : "text-[#8F96AE] hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-[15px]">
                    {item.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Separator */}
        <div className="my-4 px-8">
          <div className="h-[1px] w-full bg-white/10"></div>
        </div>

        {/* Bottom Nav */}
        <div className="space-y-1 px-4">
          {bottomNavItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer text-[#8F96AE] hover:text-white hover:bg-white/5">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
          
          <div 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer text-[#8F96AE] hover:text-white hover:bg-white/5 mt-2"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium text-[15px]">Logout</span>
          </div>
        </div>
      </div>

      {/* Storage Widget */}
      <div className="px-8 mt-auto pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white">
            <Cloud className="h-4 w-4" />
            <span className="text-sm font-medium">Storage</span>
          </div>
          <span className="text-xs text-white">27%</span>
        </div>
        
        <div className="h-1.5 w-full bg-[#2A2E4C] rounded-full overflow-hidden flex mb-2">
          <div className="h-full bg-[#FFB84C] w-[15%] rounded-l-full"></div>
          <div className="h-full bg-[#7C68EE] w-[12%] rounded-r-full"></div>
        </div>
        
        <p className="text-[11px] text-[#8F96AE]">27/100 GB Used</p>
      </div>
    </aside>
  )
}
