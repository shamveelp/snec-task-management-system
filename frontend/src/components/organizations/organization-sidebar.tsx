"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ListTodo,
  Users,
  Bell,
  BarChart2,
  Activity,
  UserPlus,
  Shield,
  HelpCircle,
  ChevronDown
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"

const sidebarSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "COLLABORATION",
    items: [
      { name: "Team", href: "/organization/team", icon: Users },
      { name: "Notifications", href: "/organization/dashboard#notifications", icon: Bell, badge: "3" },
    ]
  },
  {
    title: "WORKSPACE",
    items: [
      { name: "Projects", href: "/organization/dashboard#projects", icon: FolderKanban },
      { name: "Tasks", href: "/organization/dashboard#tasks", icon: CheckSquare },
      { name: "My Tasks", href: "/organization/dashboard#mytasks", icon: ListTodo },
    ]
  },
  {
    title: "INSIGHTS",
    items: [
      { name: "Reports", href: "/organization/dashboard#reports", icon: BarChart2 },
      { name: "Activity / Audit Logs", href: "/organization/dashboard#logs", icon: Activity },
    ]
  },
  {
    title: "ADMINISTRATION",
    items: [
      { name: "Members", href: "/organization/dashboard#members", icon: UserPlus },
      { name: "Roles & Permissions", href: "/organization/dashboard#roles", icon: Shield },
    ]
  }
]

export function OrganizationSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const userName = user?.name?.split(' ')[0] || 'Sarah'

  return (
    <aside className="w-[280px] h-full flex-shrink-0 bg-[#1C1F37] flex flex-col z-20 py-6 text-[#8F96AE] stylish-scrollbar overflow-y-auto">
      
      {/* Top Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-7 w-7 rounded bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center flex-shrink-0 shadow-sm">
            <div className="h-3 w-3 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl text-white tracking-wide">FlowTask</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col gap-6 px-4 mb-8">
        {sidebarSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-4 mb-2">
              <span className="text-[11px] font-bold tracking-wider text-white/40">{section.title}</span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
                        isActive ? "bg-[#7C68EE]/10 text-white" : "hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-[#7C68EE]" : "")} />
                        <span className="font-medium text-[14px]">
                          {item.name}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="bg-[#FF6B6B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto px-4 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer hover:text-white hover:bg-white/5">
          <HelpCircle className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium text-[14px]">Help & Documentation</span>
        </div>
        
        {/* User Profile Card */}
        <div className="bg-[#15172A] rounded-[20px] p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFB84C] to-[#ff9b00] flex items-center justify-center text-white font-bold shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white font-bold text-[14px]">{userName}</div>
              <div className="text-[#8F96AE] text-[12px] font-medium">Admin</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-[#8F96AE] cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  )
}
