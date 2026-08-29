"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronRight, Star } from "lucide-react"
import { cn } from "../../lib/utils"

interface SecondarySidebarProps {
  isExpanded: boolean
}

export function SecondarySidebar({ isExpanded }: SecondarySidebarProps) {
  return (
    <aside 
      className={cn(
        "h-full bg-[#18191E] border-r border-white/[0.04] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden",
        isExpanded ? "w-[280px] opacity-100" : "w-0 opacity-0 border-none"
      )}
    >
      <div className="p-6 pb-4 w-[280px]">
        <h2 className="text-lg font-semibold mb-6">Organizations</h2>
        
        <div className="bg-[#121316] border border-white/[0.05] rounded-xl flex items-center px-3 py-2.5 mb-6">
          <Search className="h-4 w-4 text-white/40 mr-2 flex-shrink-0" />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/40"
          />
        </div>
        
        <div className="space-y-6 overflow-y-auto stylish-scrollbar-dark h-[calc(100vh-180px)] pr-2">
          
          {/* Favourites */}
          <div>
            <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
              <ChevronDown className="h-3.5 w-3.5 mr-2" />
              Favourites
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#22C55E]"></div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">TechVanta</span>
                </div>
                <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#F97316]"></div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">DataPulse</span>
                </div>
                <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />
              </div>
            </div>
          </div>

          {/* All Organizations */}
          <div>
            <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
              <ChevronDown className="h-3.5 w-3.5 mr-2" />
              All Organizations
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#22C55E]"></div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">TechVanta</span>
                </div>
                <Star className="h-3.5 w-3.5 text-[#EAB308] fill-[#EAB308]" />
              </div>
              
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 border border-white/10 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full border-2 border-[#EAB308] bg-transparent"></div>
                  <span className="text-sm text-white font-medium">CodeSphere</span>
                </div>
                <Star className="h-3.5 w-3.5 text-white/40" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#EF4444]"></div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">CyberNexa</span>
                </div>
                <Star className="h-3.5 w-3.5 text-white/40" />
              </div>
              
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#A855F7]"></div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">ByteFlow</span>
                </div>
                <Star className="h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
          </div>

          {/* Pending Invitations */}
          <div>
            <div className="flex items-center text-white/60 text-xs font-medium mb-3 cursor-pointer hover:text-white">
              <ChevronRight className="h-3.5 w-3.5 mr-2" />
              Pending Invitations
            </div>
          </div>

        </div>
      </div>
    </aside>
  )
}
