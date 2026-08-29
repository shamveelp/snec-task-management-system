"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronRight, Star, Plus, Building2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useRouter, usePathname } from "next/navigation"
import { organizationsService, OrganizationData } from "../../services/organization/organizations.service"

interface SecondarySidebarProps {
  isExpanded: boolean
  onExpand?: () => void
  selectedOrgId?: string
  onSelectOrg?: (org: any) => void
}

export function SecondarySidebar({ isExpanded, onExpand, selectedOrgId, onSelectOrg }: SecondarySidebarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [joinedOrgs, setJoinedOrgs] = React.useState<OrganizationData[]>([])
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    organizationsService.getJoinedOrganizations()
      .then((data) => {
        if (data && data.length > 0) {
          setJoinedOrgs(data)
          // Auto select first org if none selected and onSelectOrg provided
          if (!selectedOrgId && onSelectOrg) {
            onSelectOrg(data[0])
          }
        } else if (user?.organization) {
          const fallbackOrg = {
            id: user.organization.id,
            name: user.organization.name,
            category: user.organization.category || "General",
            memberCount: 1,
            createdAt: new Date().toISOString(),
          }
          setJoinedOrgs([fallbackOrg])
          if (!selectedOrgId && onSelectOrg) {
            onSelectOrg(fallbackOrg)
          }
        }
      })
      .catch(() => {
        if (user?.organization) {
          const fallbackOrg = {
            id: user.organization.id,
            name: user.organization.name,
            category: user.organization.category || "General",
            memberCount: 1,
            createdAt: new Date().toISOString(),
          }
          setJoinedOrgs([fallbackOrg])
          if (!selectedOrgId && onSelectOrg) {
            onSelectOrg(fallbackOrg)
          }
        }
      })
  }, [user?.organization?.id])

  const handleSearchClick = () => {
    if (onExpand) {
      onExpand()
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }

  const filteredOrgs = joinedOrgs.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOrgClick = (org: OrganizationData) => {
    if (onSelectOrg) {
      onSelectOrg(org)
    } else {
      router.push(`/dashboard/organizations`)
    }
  }

  return (
    <aside 
      className={cn(
        "h-full bg-[#18191E] border-r border-white/[0.04] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden select-none",
        isExpanded ? "w-[280px]" : "w-[80px]"
      )}
    >
      <div className={cn("pb-4 transition-all duration-300 h-full", isExpanded ? "p-6 pt-[104px] w-[280px]" : "py-6 pt-[104px] w-[80px] flex flex-col items-center")}>
        
        {/* Header */}
        {isExpanded ? (
          <h2 className="text-lg font-semibold mb-6 text-white whitespace-nowrap">Organizations</h2>
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
          
          {/* Joined Organizations List */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div className="flex items-center text-white/60 text-xs font-medium mb-3">
                <ChevronDown className="h-3.5 w-3.5 mr-2" />
                Joined Organizations
              </div>
            ) : (
              <div className="h-px w-8 bg-white/10 mb-2"></div>
            )}
            
            <div className={cn(isExpanded ? "space-y-1.5" : "flex flex-col items-center gap-3")}>
              {filteredOrgs.map((org) => {
                const isSelected = selectedOrgId === org.id
                return (
                  <div 
                    key={org.id}
                    onClick={() => handleOrgClick(org)}
                    className={cn(
                      "cursor-pointer group flex items-center justify-between transition-all duration-200",
                      isExpanded 
                        ? cn("px-3 py-2.5 rounded-xl", isSelected ? "bg-white/10 border border-white/10" : "hover:bg-white/5")
                        : cn("h-10 w-10 rounded-xl flex items-center justify-center", isSelected ? "bg-white/15 border border-white/20 shadow-md" : "hover:bg-white/5")
                    )} 
                    title={org.name}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "rounded-full transition-all flex-shrink-0",
                        isSelected ? "bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" : "bg-white/20 group-hover:bg-[#3B82F6]/60",
                        isExpanded ? "h-2.5 w-2.5" : "h-3.5 w-3.5"
                      )}></div>
                      {isExpanded && (
                        <span className={cn(
                          "text-sm truncate transition-colors font-medium",
                          isSelected ? "text-white font-semibold" : "text-white/70 group-hover:text-white"
                        )}>
                          {org.name}
                        </span>
                      )}
                    </div>
                    {isExpanded && (
                      <Star className={cn(
                        "h-3.5 w-3.5 transition-colors flex-shrink-0",
                        isSelected ? "text-[#EAB308] fill-[#EAB308]" : "text-white/20 group-hover:text-[#EAB308]"
                      )} />
                    )}
                  </div>
                )
              })}

              {filteredOrgs.length === 0 && (
                isExpanded && <div className="text-xs text-white/40 px-3 py-2">No organizations found.</div>
              )}
            </div>
          </div>

          {/* All Joined Organizations */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div 
                onClick={() => router.push('/dashboard/organizations/all')}
                className={cn("flex items-center text-xs font-medium mb-1 cursor-pointer py-2 px-2 rounded-lg transition-colors",
                  pathname === '/dashboard/organizations/all' ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <ChevronRight className="h-3.5 w-3.5 mr-2" />
                All Joined Organizations
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
