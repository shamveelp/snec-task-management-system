"use client"

import * as React from "react"
import { 
  ChevronRight, Lock, MoreVertical, Plus, Paperclip, 
  MessageSquare, CheckSquare, AlignJustify, SlidersHorizontal, Diamond, ArrowUpRight, Check 
} from "lucide-react"
import { cn } from "../../lib/utils"

export function KanbanBoard() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#131417]">
      {/* Header Area */}
      <div className="px-8 pt-[104px] pb-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center text-sm font-medium text-white/60 gap-2">
            <span className="hover:text-white cursor-pointer">All Organizations</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">CodeSphere</span>
          </div>
          <div className="flex items-center text-xs font-medium text-white/40 gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"></div>
            Last Update on Jan 06, 2025 - 10:45 AM
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 rounded-full border-[3px] border-[#EAB308]"></div>
            <h1 className="text-3xl font-semibold tracking-tight text-white/90">CodeSphere - Design Project</h1>
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white/40 cursor-pointer hover:bg-white/10 hover:text-white">
              <Lock className="h-3.5 w-3.5" />
            </div>
          </div>
          
          {/* Avatars */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-[#131417] z-40"></div>
              <div className="h-8 w-8 rounded-full bg-green-500 border-2 border-[#131417] z-30"></div>
              <div className="h-8 w-8 rounded-full bg-purple-500 border-2 border-[#131417] z-20"></div>
              <div className="h-8 w-8 rounded-full bg-orange-500 border-2 border-[#131417] z-10"></div>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold ml-2 text-white/80 cursor-pointer hover:bg-white/10">
              +5
            </div>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="flex items-center gap-8 border-b border-white/[0.04] pb-4">
          {[
            { name: "Overview", active: false },
            { name: "Tasks", active: true },
            { name: "Discussions", active: false },
            { name: "Team Members", active: false },
            { name: "Notifications", active: false },
            { name: "Files", active: false },
            { name: "Integrations", active: false },
          ].map(tab => (
            <div 
              key={tab.name} 
              className={cn(
                "flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors relative",
                tab.active ? "text-white" : "text-white/40 hover:text-white/70"
              )}
            >
              <Diamond className={cn("h-2.5 w-2.5", tab.active ? "text-white fill-white" : "")} />
              {tab.name}
              {tab.active && (
                <div className="absolute -bottom-4.5 left-0 right-0 h-[2px] bg-white rounded-t-full"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center bg-[#18191E] border border-white/[0.04] p-1 rounded-xl">
            <div className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-medium shadow-sm cursor-pointer border border-white/[0.04]">
              Kanban
            </div>
            <div className="px-5 py-2 rounded-lg text-white/50 hover:text-white text-sm font-medium cursor-pointer transition-colors">
              Table View
            </div>
            <div className="px-5 py-2 rounded-lg text-white/50 hover:text-white text-sm font-medium cursor-pointer transition-colors">
              Timeline View
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#18191E] border border-white/[0.04] rounded-xl text-white/70 text-sm font-medium cursor-pointer hover:text-white hover:bg-white/5 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
              Sort By
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#18191E] border border-white/[0.04] rounded-xl text-white/70 text-sm font-medium cursor-pointer hover:text-white hover:bg-white/5 transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </div>
          </div>
        </div>

      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 stylish-scrollbar-dark">
        <div className="flex gap-6 h-full min-w-max">
          
          {/* To Do Column */}
          <div className="w-[340px] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin-slow"></div>
                <span className="font-semibold text-white/90">To Do</span>
                <span className="text-white/40 text-sm font-medium">2</span>
              </div>
              <div className="flex items-center gap-1 text-white/40">
                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-white" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto stylish-scrollbar-dark space-y-4 pr-2">
              {/* Card 1 */}
              <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-5 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 rounded-full">High</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 rounded-full">Wireframe</span>
                  </div>
                  <span className="text-white/40 text-xs font-medium">A-198</span>
                </div>
                
                <div className="w-full h-40 bg-white/5 rounded-xl mb-4 border border-white/5 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                  <div className="flex gap-4 opacity-50 blur-[1px]">
                    <div className="w-24 h-32 bg-white rounded-lg shadow-xl shadow-black/50 rotate-[-5deg]"></div>
                    <div className="w-20 h-28 bg-white/80 rounded-lg shadow-xl shadow-black/50 mt-4 rotate-[2deg]"></div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-white mb-2">Create Wireframe</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">Wireframe for the new marketing website.</p>
                
                <div className="space-y-2.5 mb-4">
                  {['Home Page', 'About Us', 'Our Service', 'Contact Us'].map((task) => (
                    <div key={task} className="flex items-center gap-3 group/task">
                      <div className="h-3.5 w-3.5 rounded border border-white/20 flex-shrink-0 group-hover/task:border-white/50 cursor-pointer"></div>
                      <span className="text-white/60 text-xs font-medium">{task}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-semibold cursor-pointer mb-6 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Subtask
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Progress</span>
                  <span className="text-white/60 text-xs font-semibold">0%</span>
                </div>
                
                <div className="h-1.5 w-full bg-[#131417] rounded-full overflow-hidden mb-6 border border-white/5">
                  <div className="h-full bg-[#EAB308] w-[0%] rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border border-[#1C1E24] z-30"></div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border border-[#1C1E24] z-20"></div>
                    <div className="h-6 w-6 rounded-full bg-purple-500 border border-[#1C1E24] z-10"></div>
                    <div className="h-6 w-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] text-white/60">
                      +2
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Paperclip className="h-3.5 w-3.5" /> 3</div>
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> 7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="w-[340px] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current text-white/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                  </svg>
                </div>
                <span className="font-semibold text-white/90">In Progress</span>
                <span className="text-white/40 text-sm font-medium">23</span>
              </div>
              <div className="flex items-center gap-1 text-white/40">
                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-white" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto stylish-scrollbar-dark space-y-4 pr-2">
              {/* Card 2 */}
              <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-5 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EAB308] bg-[#EAB308]/10 rounded-full">Medium</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 rounded-full">Marketing Copy</span>
                  </div>
                  <span className="text-white/40 text-xs font-medium">A-200</span>
                </div>
                
                <h3 className="font-semibold text-white mb-2">Prepare Copy for FAQ's</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-6">Prepare the questions and the answers.</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Progress</span>
                  <span className="text-white/60 text-xs font-semibold">40%</span>
                </div>
                
                <div className="h-1.5 w-full bg-[#131417] rounded-full overflow-hidden mb-6 border border-white/5">
                  <div className="h-full bg-[#EAB308] w-[40%] rounded-full shadow-[0_0_10px_#EAB308]"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border border-[#1C1E24] z-30"></div>
                    <div className="h-6 w-6 rounded-full bg-orange-500 border border-[#1C1E24] z-20"></div>
                    <div className="h-6 w-6 rounded-full bg-pink-500 border border-[#1C1E24] z-10"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Paperclip className="h-3.5 w-3.5" /> 5</div>
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> 1</div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-5 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 rounded-full">High</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 rounded-full">UX Design</span>
                  </div>
                  <span className="text-white/40 text-xs font-medium">A-202</span>
                </div>
                
                <div className="w-full h-36 bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-white/10 p-4">
                    <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                        <span className="text-xl font-bold text-[#141518]">Userflow</span>
                    </div>
                </div>
                
                <h3 className="font-semibold text-white mb-2">Dashboard Userflow</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">Prepare userflow for the admin panel.</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Progress</span>
                  <span className="text-white/60 text-xs font-semibold">0%</span>
                </div>
                
                <div className="h-1.5 w-full bg-[#131417] rounded-full overflow-hidden mb-6 border border-white/5">
                  <div className="h-full bg-[#EAB308] w-[0%] rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border border-[#1C1E24] z-30"></div>
                    <div className="h-6 w-6 rounded-full bg-green-500 border border-[#1C1E24] z-20"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Paperclip className="h-3.5 w-3.5" /> 2</div>
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Done Column */}
          <div className="w-[340px] h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-white/60" />
                <span className="font-semibold text-white/90">Done</span>
                <span className="text-white/40 text-sm font-medium">71</span>
              </div>
              <div className="flex items-center gap-1 text-white/40">
                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-white" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto stylish-scrollbar-dark space-y-4 pr-2">
              {/* Card 4 */}
              <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-5 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 rounded-full">High</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EAB308] bg-[#EAB308]/10 rounded-full">UX Design</span>
                  </div>
                  <span className="text-white/40 text-xs font-medium">A-203</span>
                </div>
                
                <h3 className="font-semibold text-white mb-2">Prepare Roadmap</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-4">Create new product roadmap.</p>
                
                <div className="space-y-2.5 mb-4">
                  {['New Features', 'Testing Phase', 'Product Roadmap'].map((task) => (
                    <div key={task} className="flex items-center gap-3 group/task">
                      <div className="h-3.5 w-3.5 rounded border border-white/20 bg-white/20 flex-shrink-0 cursor-pointer flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-white/60 line-through decoration-white/30 text-xs font-medium">{task}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-semibold cursor-pointer mb-6 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add Subtask
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Progress</span>
                  <span className="text-white/60 text-xs font-semibold">100%</span>
                </div>
                
                <div className="h-1.5 w-full bg-[#131417] rounded-full overflow-hidden mb-6 border border-white/5">
                  <div className="h-full bg-[#22C55E] w-[100%] rounded-full shadow-[0_0_10px_#22C55E]"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500 border border-[#1C1E24] z-30"></div>
                    <div className="h-6 w-6 rounded-full bg-pink-500 border border-[#1C1E24] z-20"></div>
                    <div className="h-6 w-6 rounded-full bg-orange-500 border border-[#1C1E24] z-10"></div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><Paperclip className="h-3.5 w-3.5" /> 12</div>
                    <div className="flex items-center gap-1 hover:text-white cursor-pointer"><MessageSquare className="h-3.5 w-3.5" /> 3</div>
                  </div>
                </div>
              </div>
              
              {/* Card 5 */}
              <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-5 shadow-lg group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/10 rounded-full">Low</span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 rounded-full">Marketing Copy</span>
                  </div>
                  <span className="text-white/40 text-xs font-medium">A-204</span>
                </div>
                
                <h3 className="font-semibold text-white mb-2">Create Hero Illustration</h3>
                <p className="text-white/40 text-xs leading-relaxed">Illustration mockup for hero section.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
