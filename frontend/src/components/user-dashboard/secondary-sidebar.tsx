"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronRight, Star, Plus } from "lucide-react"
import { cn } from "../../lib/utils"

interface SecondarySidebarProps {
  isExpanded: boolean
  onExpand?: () => void
}

export function SecondarySidebar({ isExpanded, onExpand }: SecondarySidebarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const handleSearchClick = () => {
    if (onExpand) {
      onExpand()
      // Wait for the transition to finish before focusing
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }
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
          
          {/* Favourites */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
                <ChevronDown className="h-3.5 w-3.5 mr-2" />
                Favourites
              </div>
            ) : (
              <div className="h-px w-8 bg-white/10 mb-2"></div>
            )}
            
            <div className={cn(isExpanded ? "space-y-1" : "flex flex-col items-center gap-4")}>
              {/* TechVanta */}
              <div className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} title="TechVanta">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full bg-[#22C55E]", isExpanded ? "h-2 w-2" : "h-3 w-3 shadow-[0_0_8px_#22C55E]")}></div>
                  {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">TechVanta</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />}
              </div>
              
              {/* DataPulse */}
              <div className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} title="DataPulse">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full bg-[#F97316]", isExpanded ? "h-2 w-2" : "h-3 w-3 shadow-[0_0_8px_#F97316]")}></div>
                  {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">DataPulse</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />}
              </div>
            </div>
          </div>

          {/* All Organizations */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center gap-3")}>
            {isExpanded ? (
              <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
                <ChevronDown className="h-3.5 w-3.5 mr-2" />
                All Organizations
              </div>
            ) : (
              <div className="h-px w-8 bg-white/10 my-2"></div>
            )}
            
            <div className={cn(isExpanded ? "space-y-1" : "flex flex-col items-center gap-4")}>
              {/* TechVanta again? Keeping as is for consistency with previous */}
              <div className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} title="TechVanta">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full bg-[#22C55E]", isExpanded ? "h-2 w-2" : "h-3 w-3")}></div>
                  {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">TechVanta</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />}
              </div>
              
              {/* CodeSphere */}
              <div className={cn("cursor-pointer flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg bg-white/10 border border-white/10" : "justify-center")} title="CodeSphere">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full border-[#EAB308] bg-transparent", isExpanded ? "h-2 w-2 border-2" : "h-3 w-3 border-[3px] shadow-[0_0_8px_#EAB308]")}></div>
                  {isExpanded && <span className="text-sm text-white font-medium">CodeSphere</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-white/40" />}
              </div>

              {/* CyberNexa */}
              <div className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} title="CyberNexa">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full bg-[#EF4444]", isExpanded ? "h-2 w-2" : "h-3 w-3")}></div>
                  {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">CyberNexa</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-white/40" />}
              </div>
              
              {/* ByteFlow */}
              <div className={cn("cursor-pointer group flex items-center justify-between", isExpanded ? "px-3 py-2 rounded-lg hover:bg-white/5" : "justify-center")} title="ByteFlow">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-full bg-[#A855F7]", isExpanded ? "h-2 w-2" : "h-3 w-3")}></div>
                  {isExpanded && <span className="text-sm text-white/80 group-hover:text-white transition-colors">ByteFlow</span>}
                </div>
                {isExpanded && <Star className="h-3.5 w-3.5 text-white/40" />}
              </div>
            </div>
          </div>

          {/* Pending Invitations */}
          <div className={cn(isExpanded ? "w-full" : "flex flex-col items-center")}>
            {isExpanded ? (
              <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white mt-4">
                <ChevronRight className="h-3.5 w-3.5 mr-2" />
                Pending Invitations
              </div>
            ) : (
              <div className="mt-4 h-8 w-8 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-colors" title="Pending Invitations">
                <Plus className="h-4 w-4" />
              </div>
            )}
          </div>

        </div>
      </div>
    </aside>
  )
}
