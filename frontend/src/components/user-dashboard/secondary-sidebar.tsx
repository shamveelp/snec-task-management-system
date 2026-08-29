"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronRight, Star, Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useRouter, usePathname } from "next/navigation"

interface SecondarySidebarProps {
  isExpanded: boolean
  onExpand?: () => void
}

export function SecondarySidebar({ isExpanded, onExpand }: SecondarySidebarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleSearchClick = () => {
    if (onExpand) {
      onExpand()
      // Wait for the transition to finish before focusing
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }

  const organization = user?.organization

  // Filter organization based on search query
  const matchesSearch = organization?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false

  return (
    <aside 
      className={cn(
        "h-full bg-[#18191E] border-r border-white/[0.04] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden",
        isExpanded ? "w-[280px]" : "w-[80px]"
      )}
    >
      <div className={cn("pb-4 transition-all duration-300 h-full", isExpanded ? "p-6 pt-[104px] w-[280px]" : "py-6 pt-[104px] w-[80px] flex flex-col items-center")}>
        
        {/* Header */}
        {isExpanded ? (
          <h2 className="text-lg font-semibold mb-6 whitespace-nowrap">Organizations</h2>
        ) : (
          <div className="mb-6 h-7 w-7 rounded bg-white/5 flex items-center justify-center border border-white/10" title="Organizations">
            <span className="text-white/40 text-xs font-bold">O</span>
          </div>
        )}
        
        {/* Search */}
        {isExpanded ? (
          <div className="bg-[#121316] border border-white/[0.05] rounded-xl flex items-center px-3 py-2.5 mb-6">
            <Search className="h-4 w-4 text-white/40 mr-2 flex-shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search organizations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/40"
            />
          </div>
        ) : (
          <div 
            onClick={handleSearchClick}
            className="mb-6 h-10 w-10 rounded-xl hover:bg-white/5 flex items-center justify-center cursor-pointer transition-colors" 
            title="Search"
          >
            <Search className="h-4 w-4 text-white/40" />
          </div>
        )}
        
        <div className={cn("overflow-y-auto stylish-scrollbar-dark h-[calc(100vh-180px)]", isExpanded ? "space-y-6 pr-2" : "space-y-8 flex flex-col items-center")}>
          
          {/* Favourites / Joined */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
                <ChevronDown className="h-3.5 w-3.5 mr-2" />
                Joined Organizations
              </div>
            ) : (
              <div className="h-px w-8 bg-white/10 mb-2"></div>
            )}
            
            <div className={cn(isExpanded ? "space-y-1" : "flex flex-col items-center gap-4")}>
              {organization && matchesSearch ? (
                <div 
                  onClick={() => router.push('/organization/dashboard')}
                  className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} 
                  title={organization.name}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-full bg-[#3B82F6]", isExpanded ? "h-2 w-2" : "h-3 w-3 shadow-[0_0_8px_#3B82F6]")}></div>
                    {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">{organization.name}</span>}
                  </div>
                  {isExpanded && <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />}
                </div>
              ) : organization && !matchesSearch ? null : (
                isExpanded && <div className="text-xs text-white/40 px-3">No organizations joined.</div>
              )}
            </div>
          </div>

          {/* All Organizations */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div 
                onClick={() => router.push('/dashboard/organizations/all')}
                className={cn("flex items-center text-xs font-medium mb-1 cursor-pointer py-2 px-2 rounded-lg transition-colors",
                  pathname === '/dashboard/organizations/all' ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <ChevronRight className="h-3.5 w-3.5 mr-2" />
                All Organizations
              </div>
            ) : (
              <>
                <div className="h-px w-8 bg-white/10 my-2"></div>
                <div 
                  onClick={() => router.push('/dashboard/organizations/all')}
                  className={cn("cursor-pointer group flex items-center justify-center h-8 w-8 rounded-full",
                    pathname === '/dashboard/organizations/all' ? "bg-white/10 border border-white/20" : "hover:bg-white/5"
                  )} 
                  title="All Organizations"
                >
                  <span className="text-white/60 font-bold text-xs group-hover:text-white">All</span>
                </div>
              </>
            )}
          </div>

          {/* Pending Invitations */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center")}>
            {isExpanded ? (
              <div 
                onClick={() => router.push('/dashboard/invitations')}
                className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white mt-4 py-2 px-2 rounded-lg hover:bg-white/5"
              >
                <ChevronRight className="h-3.5 w-3.5 mr-2" />
                Pending Invitations
              </div>
            ) : (
              <div 
                onClick={() => router.push('/dashboard/invitations')}
                className="mt-4 h-8 w-8 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-colors" 
                title="Pending Invitations"
              >
                <Plus className="h-4 w-4" />
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  )
}
